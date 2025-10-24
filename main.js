import { getWidth, getHeight, getOffset } from "https://esm.run/mezr";
import sample from "https://esm.run/lodash/sample";

console.log(getWidth(window), getHeight(window));

let data = [];

try {
  data = await (await fetch("./data.json")).json();
} catch (e) {
  console.log(e);
}

const el_viewport = document.getElementById("viewport");

add_blockquote(sample(data).text);

function add_blockquote(html) {
  const el_bq = document.createElement("blockquote");
  el_bq.innerHTML = html;
  el_viewport.appendChild(el_bq);
}
