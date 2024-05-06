import { html } from "lit";
import { customElement, query, state, property } from "lit/decorators.js";
import "./components/calendar";
import "./components/display";
import "./components/projects";
import { TailwindElement } from "./shared/tailwind.element";
import style from "./index.css?inline";
import "./db";
import { openDB, deleteDB, wrap, unwrap } from 'idb';
import { getStorageProjects, getStorageTasks, setStorageProjects, setStorageTask } from "./db";
//import { startDB, addItemToStore, getAllTasks} from "./db";


@customElement("start-element")
export class StartElement extends TailwindElement(style) {
  @state () clickedDate: Date;
  @state () clickedDateString : String;
  @state () projects : Project [] = getStorageProjects();
  @state () tasks : Task [] = [];
  @state () tasksToShow : Task [] = [];
  @query ('#modal') modal: HTMLDialogElement;
  @query ('#task') inputTask: HTMLInputElement;
  @query ('#projectSelect') projectSelect: HTMLInputElement;
  @query ('#mandays') inputMandays: HTMLInputElement;

  constructor() {
    super();
  }

  private normalizeDate(date: Date){
    return date.toLocaleString('de-DE');
  }

  private handleClickDate(e: CustomEvent) {
    this.tasksToShow = [];
    this.clickedDate = e.detail.date;
    
    this.tasksToShow = getStorageTasks()?.filter((task) => {
      const taskDate = new Date(task.date);
      return (this.normalizeDate(this.clickedDate)  === this.normalizeDate(taskDate));
    })
    console.log(this.tasksToShow);
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
    const selectedProject = this.projectSelect.value;
    const project = this.projects.find((project) => {
      return project.text === selectedProject;
    })
    this.modal.close();
    const newTask : Task = {
      text: this.inputTask.value,
      date: this.clickedDate,
      project: project,
      mandays: Number(this.inputMandays.value)
    }
    console.log(newTask);
    this.tasks.push(newTask);
    setStorageTask(this.tasks);
  }

  updateProjectList(e: CustomEvent) {
    const projectList = e.detail.list;
    this.projects = projectList;
    setStorageProjects(this.projects);
  }
  render() {
    return html`
      <div class="flex flex-row">
      <calendar-element class="w-3/4" @clickedDate=${this.handleClickDate} @addTask=${this.openAddModal}></calendar-element>
      <projects-element class="ml-3 mt-20 mr-10" @newProjectList=${this.updateProjectList}></projects-element>
      </div>
      <display-element day=${this.clickedDate} .tasks=${this.tasksToShow}></display-element>
      
      <dialog id="modal" class="modal">
        <div class="modal-box">
        <h3 class="font-bold text-lg">Was habe ich am ${this.clickedDateString} gemacht?</h3>
        <label for="task">Tätigkeit:</label>
        <input type="text" id="task" name="task"><br>
        <label for="projectSelect">Dazugehöriges Projekt: </label>
            <select name="projectSelect" id="projectSelect">
              ${this.projects?.map((project) => {
                return html`<option value = ${project.text}>${project.text}</option>`
              })}
            </select><br>
        <label for="mandays">Stunden:</label>
        <input type="text" id="mandays" name="mandays">
        <form method="dialog" class="modal-backdrop">
        <button @click=${this.addNewTask} class="btn">Hinzufügen</button>
        <button @click=${this.closeAddModal} class="btn">Abbrechen</button>
        </form>
        </div>
      </dialog>
    `;
  }
} 

