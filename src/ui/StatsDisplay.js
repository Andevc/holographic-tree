import EventBus, { EVENTS } from '../core/EventBus.js';
export class StatsDisplay {
  constructor() {
    this.exploredCount = document.getElementById('explored-count');
    this.explored = new Set();
  }

  addExplored(subjectId) {
    this.explored.add(subjectId);
    this.update();
  }

  update() {
    if (this.exploredCount) {
      this.exploredCount.textContent = this.explored.size;
    }
  }

  getCount() {
    return this.explored.size;
  }

  reset() {
    this.explored.clear();
    this.update();
  }
}