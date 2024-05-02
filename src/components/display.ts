import { LitElement, css, html, unsafeCSS} from "lit";
import { map } from 'lit/directives/map.js';
import { customElement, query, state, property } from "lit/decorators.js";
import { TailwindElement } from "../shared/tailwind.element";
import style from './display.component.scss?inline'; 

@customElement("display-element")
export class DisplayElement extends TailwindElement(style) {
    @property() day:Date;
    @state() daystring: string = "";

  constructor() {
    super(); 
  }


  makeDayString() {
      return new Date(this.day).toLocaleString('de-DE', { day:"numeric", month:"long", year:"numeric"});
  }


  render() {
    return html `<div id="display-box">
    <h3>Tätigkeits-Übersicht</h3>
    <p id="test">${this.makeDayString()}</p>
  </div>`
    ;
  }
}