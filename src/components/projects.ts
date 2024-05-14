import { LitElement, css, html, unsafeCSS} from "lit";
import { map } from 'lit/directives/map.js';
import { customElement, query, state, property } from "lit/decorators.js";
import { TailwindElement } from "../shared/tailwind.element";
import style from './projects.component.scss?inline'; 
//import { getElement, removeElement, addProject, editElement } from "../db";
import { getStorageProjects } from "../db";

@customElement("projects-element")
export class ProjectsElement extends TailwindElement(style) {
    @state() projects: Project [] = getStorageProjects();
    @query ('#todo-input') inputProject: HTMLInputElement;
    @query ('#project-list') projectList: HTMLInputElement;

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
    const inputText = this.inputProject.value.trim();
    if(inputText !== '') {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        const newProject : Project = {
          text: inputText,
          color: randomColor,
        };
        this.projects?.push(newProject);
        this.requestUpdate();
        this.inputProject.value = '';
        this.changeprojectList(); 
    }
  }

  removeProject(index: number) {
    if (this.projects.length > 0) {
      const confirmation = confirm("Bist du dir sicher, dass du dieses Projekt entfernen möchtest?");
      
      if (confirmation) {
        this.projects.splice(index, 1);
        this.projects = [...this.projects];
        this.changeprojectList(); 
      }
    }
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
                <span class="dot" style="background-color: #${project.color}"></span>
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