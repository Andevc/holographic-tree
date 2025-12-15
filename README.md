# Árbol del Conocimiento Informático - UMSA

Visualización 3D interactiva referente a la carrera de Informática de la Universidad Mayor de San Andrés (UMSA), presentada como un árbol holográfico con tecnologías y áreas de conocimiento.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Three.js](https://img.shields.io/badge/Three.js-r128-green.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)

---

## Descripción

Este proyecto es una representación visual innovadora del conocimiento informático, organizado en un árbol 3D donde:

- **Raíces**: Representan los fundamentos de la computación
- **Tronco**: El camino principal del aprendizaje
- **Clusters (Ramas)**: Áreas especializadas con tecnologías satélites orbitando alrededor

Cada nodo es interactivo y proporciona información detallada sobre la tecnología o concepto que representa.

---

## Características

### Visualización 3D
- **Motor gráfico**: Three.js con WebGL
- **Efectos holográficos**: Materiales transparentes, wireframes y bordes brillantes
- **Post-procesamiento**: Bloom effect para mayor brillo
- **Partículas ambientales**: 700+ partículas flotantes y de flujo

### Interactividad
- **Controles de cámara**: OrbitControls con zoom, rotación y pan
- **Click en nodos**: Muestra información detallada
- **Hover effects**: Resaltado visual al pasar el mouse
- **Teclado**: Atajos para navegación rápida

### Áreas de Conocimiento
21 clusters organizados en 5 niveles de altura:

#### Nivel 1 (Y=13.5)
- 🌐 **Desarrollo Web**: React, Node.js, TypeScript, Next.js
- 🤖 **Inteligencia Artificial**: ML, Deep Learning, NLP, Computer Vision
- 🔒 **Redes y Seguridad**: Criptografía, VPN, Pentesting
- 💾 **Bases de Datos**: SQL, NoSQL, MongoDB, PostgreSQL
- ⚙️ **Cloud Computing**: AWS, Docker, Kubernetes, CI/CD

#### Nivel 2 (Y=16)
- 🎮 **Game Development**: Unity, Unreal Engine, Godot
- 📱 **Desarrollo Móvil**: React Native, Flutter, Swift, Kotlin
- 🚀 **DevOps**: Git, Jenkins, Ansible, Monitoring
- 📊 **Data Science**: Python, Pandas, Jupyter, Spark
- 🪙 **Blockchain & Web3**: Solidity, DeFi, NFTs

#### Nivel 3 (Y=18.5)
- 📡 **Internet of Things**: Arduino, Raspberry Pi, MQTT
- 🎨 **UX/UI Design**: Figma, Design Systems, Prototyping
- ✅ **Testing & QA**: Jest, Selenium, TDD
- 🏗️ **Arquitectura de Software**: Microservicios, DDD, SOLID
- 💻 **Backend Development**: Java, Python, Go, Spring Boot

#### Nivel 4 (Y=21)
- 🐧 **Sistemas Operativos**: Linux, Bash, Procesos, Memoria
- ⚡ **Performance & Optimization**: Caching, CDN, Load Balancing
- 🔌 **APIs & Integraciones**: REST, GraphQL, gRPC, WebSockets
- ⚛️ **Computación Cuántica**: Qubits, Qiskit, Algoritmos Q
- 🤖 **Robótica**: ROS, SLAM, Cinemática

---

## Instalación

### Prerrequisitos
- **Node.js** v16 o superior
- **pnpm** (recomendado) o npm

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/arbol-conocimiento-umsa.git
cd arbol-conocimiento-umsa
```

2. **Instalar dependencias**
```bash
pnpm install
# o
npm install
```

3. **Iniciar servidor de desarrollo**
```bash
pnpm dev
# o
npm run dev
```

4. **Abrir en navegador**
```
http://localhost:5173
```

### Build para producción
```bash
pnpm build
pnpm preview
```

---

## Controles

### Mouse
- **Click + Drag**: Rotar cámara
- **Scroll**: Zoom in/out
- **Click en nodo**: Mostrar información detallada

### Teclado
| Tecla | Acción |
|-------|--------|
| `R` | Reset cámara a posición inicial |
| `P` | Toggle auto-rotación |
| `H` | Ocultar/mostrar UI |
| `F` | Pantalla completa |
| `B` | Toggle efecto Bloom |
| `+/-` | Ajustar intensidad del Bloom |
| `1` | Vista frontal |
| `2` | Vista lateral |
| `3` | Vista superior |
| `ESC` | Cerrar panel de información |
| `Shift+S` | Screenshot |

### Agregar nuevos clusters

En `src/config/subjects.js`:

```javascript
export const BRANCHES = {
  // ... clusters existentes
  
  miNuevoCluster: {
    name: 'Mi Nueva Área',
    area: 'nuevaArea',  // Agregar color en constants.js
    position: { x: 0, y: 23.5, z: -5 },
    positionBranch: { x: 0, y: 20, z: 0 },
    satellites: [
      { 
        name: 'Tecnología 1', 
        description: 'Descripción...',
        id: 'SAT-NEW-001',
        area: 'nuevaArea'
      }
    ]
  }
};
```



- [Documentación Three.js](https://threejs.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [WebGL Fundamentals](https://webglfundamentals.org/)

---

**⭐ Si te gusta este proyecto, dale una estrella en GitHub!**