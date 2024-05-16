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
    @state() colors: string[] = [
      "#005f73", "#0a9396", "#e9d8a6", "#ca6702", "#9b2226",
      "#ff6f61", "#6a0572", "#ffcc00", "#006d77", "#f4a261",
      "#264653", "#2a9d8f", "#e76f51", "#8338ec", "#3a86ff",
      "#ffbe0b", "#9e0059", "#06d6a0", "#ef476f", "#118ab2"
    ]
    ;

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
          <button id="add-todo" class="hover:bg-blue-700 bg-blue-900 text-white text-base py-2 px-4 rounded-md inline-flex items-center mt-5" @click="${this.addTodo}">Projekt hinzufügen</button>
        </div>
        </div>
      </div>
    `;
  }
}