import { html } from "lit";
import { customElement, query, state, property } from "lit/decorators.js";
import "./components/calendar";
import "./components/display";
import "./components/projects";
import { TailwindElement } from "./shared/tailwind.element";
import style from "./index.css?inline";
import "./db";
import { openDB, deleteDB, wrap, unwrap } from 'idb';
import { DBStart, addElement, addItemToStore} from "./db";

async function doDatabaseStuff() {
  const db = await openDB("data");
}

DBStart();
doDatabaseStuff();


@customElement("start-element")
export class StartElement extends TailwindElement(style) {
  @state () clickedDate: Date;
  @state () clickedDateString : String;
  @state () projects : Project [] = [];
  @state () tasks : Task [] = [];
  @state () tasksToShow : Task [] = [];
  @query ('#modal') modal: HTMLDialogElement;
  @query ('#task') inputTask: HTMLInputElement;
  @query ('#projectSelect') projectSelect: HTMLInputElement;

  constructor() {
    super();
  }

  private handleClickDate(e: CustomEvent) {
    this.tasksToShow = [];
    this.clickedDate = e.detail.date;
    this.tasksToShow = this.tasks.filter((task) => {
      return task.date == e.detail.date
    })
  }

  private openAddModal(e:CustomEvent) {
    this.modal.showModal();
    let date = e.detail.date;
    this.clickedDateString = date.toLocaleString('de-de', { day: 'numeric', month: 'long' });
  }

  closeAddModal() {
    this.modal.close();
  }

  private addNewTask(e:CustomEvent) {
    this.modal.close();
    const newTask : Task = {
      text: this.inputTask.value,
      date: this.clickedDate,
      project: this.projectSelect.value
    }
    this.tasks.push(newTask);
    console.log(this.tasks);
    addItemToStore(this.tasks);
  }

  updateProjectList(e: CustomEvent) {
    const projectList = e.detail.list;
    this.projects = projectList;
  }
  render() {
    return html`
      <div class="flex flex-row">
      <calendar-element class="w-3/4" @clickedDate=${this.handleClickDate} @addTask=${this.openAddModal}></calendar-element>
      <projects-element class="ml-3" @newProjectList=${this.updateProjectList}></projects-element>
      </div>
      <display-element day=${this.clickedDate} tasks=${this.tasksToShow}></display-element>
      
      <dialog id="modal" class="modal">
        <div class="modal-box">
        <h3 class="font-bold text-lg">Was habe ich am ${this.clickedDateString} gemacht?</h3>
        <label for="task">Tätigkeit:</label>
        <input type="text" id="task" name="task"><br>
        <label for="projectSelect">Dazugehöriges Projekt: </label>
            <select name="projectSelect" id="projectSelect">
              ${this.projects.map((project) => {
                return html`<option value = ${project.text}>${project.text}</option>`
              })}
            </select>
        <form method="dialog" class="modal-backdrop">
        <button @click=${this.addNewTask} class="btn">Hinzufügen</button>
        <button @click=${this.closeAddModal} class="btn">Abbrechen</button>
        </form>
        </div>
      </dialog>
    `;
  }
} 

