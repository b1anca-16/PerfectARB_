import { LitElement, css, html, unsafeCSS} from "lit";
import { map } from 'lit/directives/map.js';
import { customElement, query, state, property } from "lit/decorators.js";
import { TailwindElement } from "../shared/tailwind.element";
import style from './projects.component.scss?inline'; 
//import { getElement, removeElement, addProject, editElement } from "../db";
import { getStorageProjects, getStorageTasks, setStorageTask } from "../db";

@customElement("projects-element")
export class ProjectsElement extends TailwindElement(style) {
    @state() projects: Project [] = getStorageProjects();
    @state() tasks: Task [] = getStorageTasks();
    @query ('#todo-input') inputProject: HTMLInputElement;
    @query ('#project-list') projectList: HTMLInputElement;
    @state() colors: string[] = ["#1abc9c", "#3498db", "#e74c3c", "#9b59b6", "#f1c40f", "#e67e22", "#2ecc71", "#34495e", "#16a085", "#2980b9", "#c0392b", "#8e44ad", "#f39c12", "#d35400", "#27ae60", "#2c3e50", "#95a5a6", "#7f8c8d", "#ecf0f1", "#d1d8e0"];

  constructor() {
    super(); 
  }


  changeprojectList() {
    const newProjectList = new CustomEvent('newProjectList', {
      detail: {
        list: this.projects
      }
    })
    this.dispatchEvent(newProjectList);
  }

  
  addTodo() {
    if (this.projects.length >= this.colors.length) {
      //window.electron.notification.showNotification('Projekt hinzugefügt', 'Ihr neues Projekt wurde erfolgreich hinzugefügt.');
      //alert("Maximale Anzahl an Projekten erreicht.");
      return;
    }
    const inputText = this.inputProject.value.trim();
    if(inputText !== '') {
        let randomColor = this.getRandomColor();
        while(this.isColorUsed(randomColor)) {
          randomColor = this.getRandomColor();
        }
        const newProject : Project = {
          text: inputText,
          color: randomColor,
        };
        this.projects?.push(newProject);
        this.requestUpdate();
        this.inputProject.value = '';
        this.changeprojectList(); 
    } else{
      //alert ("Projekttitel eingeben");
    }
  }

  getRandomColor() {
    let randomIndex = Math.floor(Math.random() * this.colors.length);
    let randomColor = this.colors[randomIndex];
    return randomColor;
  }

  isColorUsed(color: string) {
    return this.projects.some(project => project.color === color);
  }

  removeProject(index: number) {
      //const confirmation = confirm("Achtung! Bist du dir sicher, dass du dieses Projekt entfernen möchtest?");

      const deleteProject = this.projects[index];
        const stayingTasks = this.tasks.filter(task => {
          return deleteProject.color !== task.project.color
        });
      
        this.projects.splice(index, 1);
        this.projects = [...this.projects];
        this.changeprojectList(); 

        setStorageTask(stayingTasks);
        window.location.reload();
    }

  render() {
    return html`
      <div id="display-box-projects">
        <h3>Projekte</h3>
        <div id = "projectsDiv">
        
        <ul id="project-list">
            ${this.projects?.map((project, index) => {
                return html`
                <li style="">
                <span class="dot" style="background-color: ${project.color}"></span>
                  <span>${project.text}</span> <span @click="${() => this.removeProject(index)}">✖️</span>
                </li>
                `;
            })}
        </ul>
        <div id="projectInput">
          <input type="text" id="todo-input" maxlength="45"/>
          <button id="add-todo" @click="${this.addTodo}">Projekt hinzufügen</button>
        </div>
        </div>
      </div>
    `;
  }
}