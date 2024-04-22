import { html } from "lit";
import { customElement, query, state, property } from "lit/decorators.js";
import "./components/calendar";
import "./components/display";
import { TailwindElement } from "./shared/tailwind.element";
import style from "./index.css?inline";

@customElement("start-element")
export class StartElement extends TailwindElement(style) {
  @state () clickedDate: Date;
  @state () clickedDateString : String;
  @query ('#modal') modal: HTMLDialogElement;
  @query ('#task') inputTask: HTMLInputElement;
  @state () newTask: String;
  private handleClickDate(e: CustomEvent) {
    this.clickedDate = e.detail.date;
  }
  constructor() {
    super();
  }

  private openAddModal(e:CustomEvent) {
    this.modal.showModal();
    let date = e.detail.date;
    this.clickedDateString = date.toLocaleString('de-de', { day: 'numeric', month: 'long' });
  }

  private closeAddModal(e:CustomEvent) {
    this.modal.close();
    this.newTask = this.inputTask.value;
    console.log(this.newTask);
  }

  render() {
    return html`
      <calendar-element @clickedDate=${this.handleClickDate} @addTask=${this.openAddModal}></calendar-element>
      <display-element day=${this.clickedDate}></display-element>
      
      <dialog id="modal" class="modal">
        <div class="modal-box">
        <h3 class="font-bold text-lg">Was habe ich am ${this.clickedDateString} gemacht?</h3>
        <label for="task">Tätigkeit:</label>
        <input type="text" id="task" name="task"><br>
        <form method="dialog" class="modal-backdrop">
        <button @click=${this.closeAddModal} class="btn">Close</button>
        </form>
      </div>
    
</dialog>

    `;
  }
} 

