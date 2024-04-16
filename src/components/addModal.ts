import { LitElement, css, html, unsafeCSS} from "lit";
import { map } from 'lit/directives/map.js';
import { customElement, query, state, property } from "lit/decorators.js";
import { TailwindElement } from "../shared/tailwind.element";
import style from './display.component.scss?inline'; 

@customElement("addModal-element")
export class AddModalElement extends TailwindElement(style) {
 

  @property({ type: Boolean }) isOpen = false;

  constructor() {
    super();
  }

  render() {
    if (!this.isOpen) return null;

    return html`
      <div class="modal-overlay" @click=${this.closeModal}>
        <div class="modal-content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  open() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }

}
