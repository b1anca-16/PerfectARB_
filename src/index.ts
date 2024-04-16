import { html } from "lit";
import { customElement } from "lit/decorators.js";
import "./components/calendar.ts";
import { TailwindElement } from "./shared/tailwind.element";
import style from "./index.css?inline";

@customElement("start-element")
export class StartElement extends TailwindElement(style) {
  private handleEvent(e: CustomEvent) {
    console.log(e);
  }
  constructor() {
    super();
  }

  render() {
    return html`
      <calendar-element></calendar-element>
    `;
  }
}