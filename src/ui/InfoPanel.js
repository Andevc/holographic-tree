import EventBus, { EVENTS } from '../core/EventBus.js';
export class InfoPanel {
  constructor() {
    this.element = document.getElementById('info-panel');
    this.content = document.getElementById('panel-content');
    this.closeBtn = document.getElementById('close-panel');
    
    this.setupEvents();
  }

  setupEvents() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.hide());
    }
  }

  show(data) {
    if (!this.element || !data) return;
    
    this.updateContent(data);
    this.element.classList.remove('hidden');
  }

  hide() {
    if (this.element) {
      this.element.classList.add('hidden');
    }
  }

  updateContent(subject) {
    if (!this.content) return;
    
    const html = `
      <div class="fade-in">
        <h2>${subject.name}</h2>
        <div class="subject-meta">
          <span class="badge">${subject.id}</span>
          <span class="badge">Semestre ${subject.semester}</span>
          <span class="badge">${subject.credits} créditos</span>
        </div>
        
        <p>${subject.description}</p>
        
        ${subject.prerequisites?.length > 0 ? `
          <h3>📚 Pre-requisitos</h3>
          <ul>
            ${subject.prerequisites.map(p => `<li>${p}</li>`).join('')}
          </ul>
        ` : ''}
        
        ${subject.topics?.length > 0 ? `
          <h3>📖 Temas</h3>
          <ul>
            ${subject.topics.map(t => `<li>${t}</li>`).join('')}
          </ul>
        ` : ''}
        
        <h3>👨‍🏫 Información adicional</h3>
        <p><strong>Docente:</strong> ${subject.professor || 'Por asignar'}</p>
        <p><strong>Carga horaria:</strong> ${subject.hours} horas/semana</p>
      </div>
    `;
    
    this.content.innerHTML = html;
  }
}