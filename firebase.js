// Felles oppsett for Firebase. Alle sidene henter herfra.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
 
export const firebaseConfig = {
  apiKey: "AIzaSyCUyyzkAFbMs4sF6o25TjGzEXPJLoavZjI",
  authDomain: "itsmathiasx-overlays.firebaseapp.com",
  databaseURL: "https://itsmathiasx-overlays-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "itsmathiasx-overlays",
  storageBucket: "itsmathiasx-overlays.firebasestorage.app",
  messagingSenderId: "549466142017",
  appId: "1:549466142017:web:79fa56f12d21610a4f9dc0"
};
 
// Brukerne som får styre tavla. Samme liste står i databasereglene.
export const ADMINER = ["1jdYBVQ2J8TZm00EtPe3POoDDS32", "zUdaple6AwdA75ibXH2WGK75DR62", "IJdT7gMd5tcJvJM5yfOgPsRPT3G2"];
 
// Standardverdier hvis ingenting er lagret ennå
export const STANDARD = {
  tier1: 50, tier2: 100, tier3: 250, bits: 10, gave: true, plate: 25, slor: true
};
 
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
 
export const tall = v => Number(v) || 0;
export const kr = x => Math.round(x).toLocaleString("nb-NO");
 
