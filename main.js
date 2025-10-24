import { getWidth, getHeight, getOffset } from "https://esm.run/mezr";
import sample from "https://esm.run/lodash/sample";
import createFSM from "./create_fsm.js";

const fsm = createFSM(
  {
    initial: { click: "final", toggle: "final" },
    final: { toggle: "initial" },
  },
  "initial"
);

//--- Initialisation ---
// Chargement des données.
let data = [];
try {
  data = await (await fetch("./data.json")).json();
} catch (e) {
  console.log(e);
}

// Transformation des données en map.
const m_items_initial = new Map(data.map((i) => [i.id, i.text]));
const ids_initial = Array.from(m_items_initial.keys()); // Tableau des ids de m_items_initial.
let m_items = new Map(m_items_initial); // Clone of the original map
let ids = [...ids_initial]; // Clone of the original array

// console.log(getWidth(window), getHeight(window));

const el_viewport = document.getElementById("viewport");

add_blockquote(sample(data).text);

function add_blockquote(html) {
  const el_bq = document.createElement("blockquote");
  el_bq.innerHTML = html;
  el_viewport.appendChild(el_bq);
}
