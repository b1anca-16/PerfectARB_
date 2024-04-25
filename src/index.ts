import { html } from "lit";
import { customElement, query, state, property } from "lit/decorators.js";
import "./components/calendar";
import "./components/display";
import "./components/projects";
import { TailwindElement } from "./shared/tailwind.element";
import style from "./index.css?inline";
import "./db";
import { openDB, deleteDB, wrap, unwrap } from 'idb';
import { DBStart } from "./db";

async function doDatabaseStuff() {
  const db = await openDB("data");
}

DBStart();
doDatabaseStuff();


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
      <div class="flex flex-row">
      <calendar-element class="w-3/4" @clickedDate=${this.handleClickDate} @addTask=${this.openAddModal}></calendar-element>
      <projects-element class="ml-3"></projects-element>
      </div>
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

