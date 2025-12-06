import EventBus, { EVENTS } from '../core/EventBus.js';
export class ControlPanel {
  constructor() {
    this.element = document.getElementById('controls-panel');
  }

  show() {
    if (this.element) {
      this.element.classList.remove('hidden');
    }
  }

  hide() {
    if (this.element) {
      this.element.classList.add('hidden');
    }
  }

  toggle() {
    if (this.element) {
      this.element.classList.toggle('hidden');
    }
  }
}