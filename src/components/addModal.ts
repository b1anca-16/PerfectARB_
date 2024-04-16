import { LitElement, css, html, unsafeCSS} from "lit";
import { map } from 'lit/directives/map.js';
import { customElement, query, state, property } from "lit/decorators.js";
import { TailwindElement } from "../shared/tailwind.element";
import style from './display.component.scss?inline'; 

class AddModal extends LitElement {
  private modalVisible = false;

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has('modalVisible')) {
      this.toggleModal();
    }
  }

  private toggleModal() {
    const modal = this.shadowRoot?.querySelector('.modal') as HTMLElement;
    if (this.modalVisible) {
      modal.style.display = 'block';
    } else {
      modal.style.display = 'none';
    }
  }

  openAddModal() {
    this.modalVisible = true;
  }

  private closeModal() {
    this.modalVisible = false;
  }

  render() {
    return html`
      <button @click="${this.openAddModal}">Open Modal</button>
      <div class="modal">
        <div class="modal-content">
          <span class="close" @click="${this.closeModal}">&times;</span>
          <slot></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('add-modal', AddModal);