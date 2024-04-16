import { html } from "lit";
import { customElement, query, state, property } from "lit/decorators.js";
import "./components/calendar";
import "./components/display";
import { TailwindElement } from "./shared/tailwind.element";
import style from "./index.css?inline";
//import style from './index.scss'; 

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
    const modal = this.shadowRoot?.getElementById("modal") as HTMLDialogElement;
    const modalCheckbox = this.shadowRoot?.getElementById("modal") as HTMLInputElement;
    modalCheckbox.checked = true;
    let date = e.detail.date;
    console.log(date);
  }

  private closeAddModal(e:CustomEvent) {
    const modalCheckbox = this.shadowRoot?.getElementById("modal") as HTMLInputElement;
    modalCheckbox.checked = false;
  }

  render() {
    return html`
      <calendar-element @clickedDate=${this.handleClickDate} @addTask=${this.openAddModal} message="test"></calendar-element>
      <display-element day=${this.clickedDate}></display-element>
      <input type="checkbox" id="modal" class="modal-toggle" />
      <div class="modal" role="dialog">
        <div class="modal-box">
        <h3 class="font-bold text-lg">Hello!</h3>
        <p class="py-4">This modal works with a hidden checkbox!</p>
      <div class="modal-action">
      <label for="modal" class="btn">Close!</label>
    </div>
  </div>
</div>

    `;
  }
} 