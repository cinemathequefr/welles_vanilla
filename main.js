import {
  getWidth,
  getHeight,
  getOffset,
} from "https://cdn.jsdelivr.net/npm/mezr/+esm";
import sample from "https://cdn.jsdelivr.net/npm/lodash/sample/+esm";

import createFSM from "./createFSM.js";

const fsm = createFSM(
  {
    initial: {
      on: {
        initialize: {
          target: "ready",
          action: initialize,
        },
      },
    },
    ready: {
      delay: 100,
      on: { "": { target: "first", action: next } },
    },
    first: {
      onEnter: () => {
        console.log("First");
      },
      on: { click: { target: "next", action: next } },
    },
    next: {
      onEnter: () => {
        console.log("Next");
      },
    },
  },
  "initial"
);

fsm.send("initialize");

const el_viewport = document.getElementById("viewport");
let el_fixed_name = null;

let data = [];
let m_items_initial;
let ids_initial; // Tableau des ids de m_items_initial.
let m_items;
let ids;

async function initialize() {
  try {
    data = await (await fetch("./data.json")).json();
  } catch (e) {
    console.log(e);
  }
  m_items_initial = new Map(data.map((i) => [i.id, i]));
  ids_initial = Array.from(m_items_initial.keys()); // Tableau des ids de m_items_initial.
  m_items = new Map(m_items_initial);
  ids = [...ids_initial];
}

//--- Initialisation ---
// Chargement des données.

// Prend 1 item.
// let id = sample(ids);
// let item = m_items.get(id);
// ids = ids.filter((i) => i !== id);
// let i = add_item(item);
// el_fixed_name = i.el_extracted_name;

function next() {
  let id = sample(ids);
  let item = m_items.get(id);
  ids = ids.filter((i) => i !== id);
  let i = add_item(item);
}

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
  // const el_extracted_name = el_name.cloneNode(true);

  for (const el of el_names) {
    el.style.cursor = "pointer";
    el.addEventListener("click", handle_click_name);
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

  // const offset_extracted_name = getOffset(el_name, el_viewport);
  // el_extracted_name.classList.add("name");
  // el_extracted_name.style.position = "absolute";
  // el_extracted_name.style.backgroundColor = "#69f";
  // el_extracted_name.style.left = `${offset_extracted_name.left}px`;
  // el_extracted_name.style.top = `${offset_extracted_name.top}px`;
  // el_extracted_name.style.zIndex = 10; // TODO: consolider les z-index.
  // el_viewport.appendChild(el_extracted_name);
  // el_name.style.visibility = "hidden";

  return el_item;
}

/**
 * handle_click_name
 * @param {*} e Élément el_name cliqué.
 */
function handle_click_name(e) {
  const el_name = e.target;
  const el_extracted_name = el_name.cloneNode(true);
  const offset_extracted_name = getOffset(el_name, el_viewport);

  el_extracted_name.classList.add("name");
  Object.assign(el_extracted_name.style, {
    position: "absolute",
    left: `${offset_extracted_name.left}px`,
    top: `${offset_extracted_name.top}px`,
  });
  el_viewport.appendChild(el_extracted_name);
  el_name.style.visibility = "hidden";

  el_name.parentNode.parentNode.animate(
    [{ opacity: 0 }],
    {
      duration: 250,
      easing: "ease-in-out",
      fill: "forwards",
    }
    // [{ transform: `translate(${dx}px, ${dy}px)`, opacity: 1 }],
    // {
    //   duration: 500,
    //   easing: "ease-in-out",
    //   fill: "forwards",
    // }
  );

  // Detach event listeners.
  const el_names = el_name.parentNode.querySelectorAll(".name");
  for (const el of el_names) {
    el.removeEventListener("click", handle_click_name);
    el.style.backgroundColor = "transparent";
  }

  el_fixed_name = el_extracted_name; // Test

  fsm.send("click");
  // next();
}
