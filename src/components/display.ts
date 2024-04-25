import { LitElement, css, html, unsafeCSS} from "lit";
import { map } from 'lit/directives/map.js';
import { customElement, query, state, property } from "lit/decorators.js";
import { TailwindElement } from "../shared/tailwind.element";
import style from './display.component.scss?inline'; 

@customElement("display-element")
export class DisplayElement extends TailwindElement(style) {
    @property() day:Date;
    @property() tasks: Task [] = [];
    @state() daystring: string = "";

  constructor() {
    super(); 
  }

  updated() {
    console.log(this.tasks);
  }

  makeDayString() {
      this.daystring = this.day.toLocaleString('de-DE', { day:"numeric", month:"long", year:"numeric"});
  }

  render() {
    return html`
      <div id="display-box">
        <h3>Tätigkeits-Übersicht</h3>
        ${this.makeDayString()}
        <p id="test">${this.daystring}</p>
        <div>
        ${this.tasks.length > 0 ? (
          this.tasks.map((task) => html`
          <p>${task.text}</p>
          `)
        ) : (
          `Keine Aufgaben vorhanden`
        )}
        </div>
      </div>
    `;
  }
}