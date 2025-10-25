import { getWidth, getHeight, getOffset } from "https://esm.run/mezr";
import sample from "https://esm.run/lodash/sample";
import createFSM from "./create_fsm.js";

const el_viewport = document.getElementById("viewport");
let el_fixed_name = null;

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
let i = add_item(item);
el_fixed_name = i.el_extracted_name;

// id = sample(ids);
// item = m_items.get(id);
// ids = ids.filter((i) => i !== id);
// add_item(item, el_fixed_name);

// console.log(getWidth(window), getHeight(window));

/**
 * add_item
 * Ajoute l'item sélectionné dans le DOM et effectue les opérations nécessaires dessus.
 * @param {object} item item de données à afficher et positionner.
 * @param {HTMLElement?} el_fixed_name Élément contenant le nom, positionné à l'affichage de l'item précédent. `undefined` lors du premier appel.
 * @returns
 */
function add_item(item) {
  const el_item = document.createElement("blockquote");
  el_item.innerHTML = item.text;

  const el_names = el_item.querySelectorAll(".name");
  const el_name = sample(el_names);
  const el_extracted_name = el_name.cloneNode(true);

  for (const el of el_names) {
    el.style.cursor = "pointer";
    el.addEventListener("click", () => {
      alert("Clicky");
    });
  }

  el_viewport.appendChild(el_item);

  // Si un nom fixé existe, on positionne le nouvel item pour que le nom choisi (el_name) prenne la position du nom fixé.
  if (el_fixed_name instanceof HTMLElement) {
    const { left: x, top: y } = getOffset(el_fixed_name, window);
    const { left: dx, top: dy } = getOffset(el_name, el_item);
    el_item.style.position = "absolute";
    el_item.style.left = `${x - dx}px`;
    el_item.style.top = `${y - dy}px`;
  }

  const offset_extracted_name = getOffset(el_name, el_viewport);
  el_extracted_name.classList.add("name");
  el_extracted_name.style.position = "absolute";
  el_extracted_name.style.backgroundColor = "#69f";
  el_extracted_name.style.left = `${offset_extracted_name.left}px`;
  el_extracted_name.style.top = `${offset_extracted_name.top}px`;
  el_extracted_name.style.zIndex = 10; // TODO: consolider les z-index.
  el_viewport.appendChild(el_extracted_name);
  el_name.style.visibility = "hidden";

  return { el_item, el_extracted_name };
}
