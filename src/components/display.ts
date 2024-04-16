import { LitElement, css, html, unsafeCSS} from "lit";
import { map } from 'lit/directives/map.js';
import { customElement, query, state, property } from "lit/decorators.js";
import { TailwindElement } from "../shared/tailwind.element";
import style from './display.component.scss?inline'; 

@customElement("display-element")
export class DisplayElement extends TailwindElement(style) {
    @property() day:Date;

  constructor() {
    super();
  }
  private openAddModal(e:CustomEvent) {
    let date = e.detail.date;
    console.log(date);
  }
  
  clickDate(index: number, currentDate: Date) {
    const clickedDate = new CustomEvent('clickedDate', {
      detail: {
        date: currentDate
      }
    })
    this.dispatchEvent(clickedDate);
  }



  render() {
    return html`
      <div id="display-box">
        <h3>Tätigkeits-Übersicht</h3>  
        <p id="test">${this.day}</p>
      </div>
    `;
  }

}
