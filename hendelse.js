// Gjør om en hendelse fra StreamElements til endringer i tellerne.
// Ren funksjon uten Firebase, så den kan testes for seg selv.
// Returnerer null hvis hendelsen skal ignoreres.

const n = v => Number(v) || 0;

export function beregn(e, innst) {
  if (!e || !e.type) return null;
  const d = e.data || {};
  const navn = d.displayName || d.username || d.name || "noen";
  const id = String(e._id || "");
  if (!id) return null;

  if (e.type === "tip") {
    const belop = n(d.amount);
    if (belop <= 0) return null;
    const valuta = d.currency || "NOK";
    return {
      id,
      endringer: { "tall/dono/kr": belop, "tall/kombo/kr": belop },
      tekst: `${Math.round(belop)} ${valuta === "NOK" ? "kr" : valuta} fra ${navn}`,
      advarsel: valuta !== "NOK" ? `Donasjonen kom i ${valuta}, telt som kroner` : null,
      type: "dono"
    };
  }

  if (e.type === "cheer") {
    const bits = n(d.amount);
    const verdi = (bits / 100) * n(innst.bits);
    if (verdi <= 0) return null;
    return {
      id,
      endringer: { "tall/dono/kr": verdi, "tall/kombo/kr": verdi },
      tekst: `${bits} bits fra ${navn}`,
      type: "bits"
    };
  }

  if (e.type === "subscriber") {
    // Gavesubs fra en pakke kommer også enkeltvis. Vi teller bare pakken.
    if (d.isCommunityGift) return null;
    const gave = !!(d.gifted || d.bulkGifted);
    if (gave && innst.gave === false) return null;
    const antall = d.bulkGifted ? Math.max(1, n(d.amount)) : 1;
    const t = String(d.tier || "1000");
    const tier = t === "3000" ? "t3" : t === "2000" ? "t2" : "t1"; // prime teller som tier 1
    const tekst = d.bulkGifted ? `${antall} gavesubs fra ${navn}`
      : d.gifted ? `Gavesub fra ${d.sender || navn}`
      : `${t === "prime" ? "Prime sub" : "Sub"} fra ${navn}`;
    return {
      id,
      endringer: { "tall/subs/antall": antall, [`tall/kombo/${tier}`]: antall },
      tekst,
      type: "sub"
    };
  }

  return null;
}

// Testhendelser fra StreamElements kommer i et annet format
export function fraTest(e) {
  if (!e || !e.listener) return null;
  const type = String(e.listener).replace("-latest", "");
  return { type, data: e.event || {}, _id: "test" + Date.now() + Math.floor(Math.random() * 1000) };
}
