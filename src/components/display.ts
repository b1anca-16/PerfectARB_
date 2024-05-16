import { LitElement, css, html, unsafeCSS} from "lit";
import { map } from 'lit/directives/map.js';
import { customElement, query, state, property } from "lit/decorators.js";
import { TailwindElement } from "../shared/tailwind.element";
import style from './display.component.scss?inline'; 
import { getStorageTasks, setStorageTask } from "../db";

@customElement("display-element")
export class DisplayElement extends TailwindElement(style) {
    @property() day:Date;
    @state() daystring: string = "";
    @state() tasks: Task[] = [];


  constructor() {
    
    super(); 
  }



  changeTasksList() {
    const newTasksList = new CustomEvent('newTasksList', {
      detail: {
        list: this.tasks
      }
    })
    this.dispatchEvent(newTasksList);
  }


  makeDayString() {
    return new Date(this.day).toLocaleString('de-DE', { day:"numeric", month:"long", year:"numeric"});
  }

  removeTask(id: String) {
    let myTasks = getStorageTasks();
    for (let i = 0; i<myTasks.length; i++) {
      if(myTasks[i].id === id) {
        myTasks.splice(i, 1);
        break;
      }
    }
    myTasks = [...myTasks];
    this.tasks = myTasks;
    console.log(myTasks);
    this.changeTasksList();
    window.location.reload();
  }
 

  render() {
    return html `
    <div id="display-box">
    <h3 class="header">Tätigkeits-Übersicht für den ${this.makeDayString()}</h3>

    ${this.tasks?.map((task) => {
      return html`
      <p> 
      <span class="dot" style="background-color: ${task.project.color}"></span>
      <span class="text">${task.mandays} Stunden:</span>
      <span class="text">${task.text}</span> <span id="removeBtn" @click="${() => this.removeTask(task.id)}">✖️</span>
      `
    })}
  </div>`
    ;
  }
}