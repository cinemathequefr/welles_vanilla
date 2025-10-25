import { getWidth, getHeight, getOffset } from "https://esm.run/mezr";
import sample from "https://esm.run/lodash/sample";
import createFSM from "./create_fsm.js";

const el_viewport = document.getElementById("viewport");

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
const m_items_initial = new Map(data.map((i) => [i.id, i]));
const ids_initial = Array.from(m_items_initial.keys()); // Tableau des ids de m_items_initial.
let m_items = new Map(m_items_initial);
let ids = [...ids_initial];

// Prend 1 item.
let id = sample(ids);
let item = m_items.get(id);
ids = ids.filter((i) => i !== id);

const {
  el_item: el_item_source,
  el_extracted_name,
  offset_extracted_name,
} = add_item(item);

//... et un autre.
// id = sample(ids);
// item = m_items.get(id);
// ids = ids.filter((i) => i !== id);
// add_item(item);

// console.log(getWidth(window), getHeight(window));

/**
 * add_item
 * Ajoute l'item sélectionné dans le DOM et effectue les opérations nécessaires dessus.
 * @param {*} item
 * @returns
 */
function add_item(item) {
  const el_item = document.createElement("blockquote");
  el_item.innerHTML = item.text;
  const el_name = sample(el_item.querySelectorAll(".name"));
  const el_extracted_name = el_name.cloneNode(true);
  el_viewport.appendChild(el_item);

  const offset_extracted_name = getOffset(el_name, el_viewport);

  el_extracted_name.classList.add("name");
  el_extracted_name.style.position = "absolute";
  el_extracted_name.style.left = `${offset_extracted_name.left}px`;
  el_extracted_name.style.top = `${offset_extracted_name.top}px`;
  el_extracted_name.style.zIndex = 10; // TODO: consolider les z-index.
  el_viewport.appendChild(el_extracted_name);
  el_name.style.visibility = "hidden";

  // setTimeout(() => {
  //   el_item.style.transition = "ease-in-out .5s";
  //   el_item.style.transform = "translateX(75%) translateY(50%)";
  // }, 200);

  return { el_item, el_extracted_name, offset_extracted_name };
}
