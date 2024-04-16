import { html } from "lit";
import { customElement, query, state, property } from "lit/decorators.js";
import "./components/calendar";
import "./components/display";
import { TailwindElement } from "./shared/tailwind.element";
import style from "./index.css?inline";

@customElement("start-element")
export class StartElement extends TailwindElement(style) {
  @state () clickedDate: Date;
  private handleClickDate(e: CustomEvent) {
    this.clickedDate = e.detail.date;
  }
  constructor() {
    super();
  }

  private openAddModal(e:CustomEvent) {
    let date = e.detail.date;
    console.log(date);
  }

  render() {
    return html`
      <calendar-element @clickedDate=${this.handleClickDate} @addTask=${this.openAddModal} message="test"></calendar-element>
      <display-element day=${this.clickedDate}></display-element>
    `;
  }
}