// Felles kode for de tre overlayene.
// Hvilken teller som vises styres av data-teller på <body>.
// Legg til ?plate=av på slutten av lenken for versjonen uten plate.
import { db, STANDARD, tall, kr } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const type = document.body.dataset.teller;
const ETIKETT = { kombo: "Subs + dono", subs: "Subs", dono: "Donasjoner" };

if (new URLSearchParams(location.search).get("plate") === "av") {
  document.body.classList.add("uten");
}

document.body.insertAdjacentHTML("beforeend", `
  <div class="plass" id="plass">
    <div class="plate">
      <div class="rad">
        <span class="tittel sk" id="tittel"></span>
        <span class="etikett sk">${ETIKETT[type] || ""}</span>
        <span class="pst sk" id="pst">0%</span>
      </div>
      <div class="spor"><div class="fyll" id="fyll"><span class="glans"></span></div></div>
      <div class="bunn">
        <span class="na sk" id="na">0</span>
        <span class="av sk" id="av"></span>
        <span class="splitt sk" id="splitt"></span>
      </div>
    </div>
  </div>`);

const $ = id => document.getElementById(id);
let mal = {}, t = {}, innst = { ...STANDARD };
let lastet = { mal: false, tall: false, innst: false };
let forrige = null;

function tegn() {
  if (!lastet.mal || !lastet.tall || !lastet.innst) return;

  const subs = t.subs || {}, dono = t.dono || {}, k = t.kombo || {};
  let naa, enhet;

  if (type === "subs") {
    naa = tall(subs.antall); enhet = " subs";
  } else if (type === "dono") {
    naa = tall(dono.kr); enhet = " kr";
  } else {
    naa = tall(k.t1) * tall(innst.tier1) + tall(k.t2) * tall(innst.tier2)
        + tall(k.t3) * tall(innst.tier3) + tall(k.kr);
    enhet = " kr";
    const antall = tall(k.t1) + tall(k.t2) + tall(k.t3);
    $("splitt").innerHTML = `<b>${antall}</b> subs · <b>${kr(tall(k.kr))}</b> kr`;
  }

  const maks = tall(mal.maal);
  const pst = maks > 0 ? (naa / maks) * 100 : 0;

  $("tittel").textContent = mal.tittel || "";
  $("pst").textContent = Math.round(pst) + "%";
  $("fyll").style.width = Math.min(Math.max(pst, 0), 100) + "%";
  $("na").textContent = type === "subs" ? kr(naa) : kr(naa) + " kr";
  $("av").textContent = "/ " + kr(maks) + enhet;

  if (forrige !== null && naa > forrige) {
    const p = $("plass");
    p.classList.remove("puls"); void p.offsetWidth; p.classList.add("puls");
  }
  forrige = naa;
  $("plass").classList.add("klar");
}

onValue(ref(db, "mal/" + type), s => { mal = s.val() || {}; lastet.mal = true; tegn(); });
onValue(ref(db, "tall"), s => { t = s.val() || {}; lastet.tall = true; tegn(); });
onValue(ref(db, "innst"), s => {
  innst = { ...STANDARD, ...(s.val() || {}) };
  const r = document.documentElement.style;
  r.setProperty("--a", (Math.min(Math.max(tall(innst.plate), 0), 60) / 100).toFixed(2));
  r.setProperty("--blur", innst.slor === false ? 0 : 1);
  lastet.innst = true; tegn();
});
