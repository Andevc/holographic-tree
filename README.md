# Árbol del Conocimiento Informático - UMSA

Visualización 3D interactiva de la malla curricular de la Carrera de Informática de la Universidad Mayor de San Andrés, representada como un árbol holográfico donde cada nodo es una materia del plan de estudios.

## 📖 Descripción del Proyecto

Este proyecto es una aplicación web 3D que representa visualmente la estructura curricular de la carrera de Informática. Utiliza Three.js para crear un árbol holográfico donde:

- **Raíces** → Materias fundamentales (Matemática Discreta, Programación I, etc.)
- **Tronco** → Núcleo obligatorio (Estructuras de Datos, Bases de Datos, etc.)
- **Ramas** → Especialidades (Web, IA, Redes, Sistemas, Datos, GameDev)
- **Nodos** → Materias individuales con información detallada

Los usuarios pueden interactuar con el árbol mediante rotación, zoom y clicks en los nodos para explorar cada materia, sus prerequisitos, contenidos y más.

## 🚀 Instalación
```bash
# Clonar el repositorio
git clone https://github.com/Andevc/holographic-tree.git
cd holographic-tree

# Instalar dependencias
pnpm install
```

## 💻 Ejecución

### Modo desarrollo
```bash
pnpm dev
```
Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### Build para producción
```bash
pnpm build
pnpm preview
```

## 🎮 Controles

| Tecla | Acción |
|-------|--------|
| `Click + Drag` | Rotar cámara |
| `Scroll` | Zoom |
| `Click en nodo` | Ver información |
| `R` | Reset cámara |
| `P` | Auto-rotación |
| `H` | Ocultar/mostrar UI |
| `F` | Pantalla completa |

## 📦 Tecnologías

- **Three.js (v0.181.2)** - Motor de renderizado 3D
- **Vite (v7.2.6)** - Build tool y dev server
- **JavaScript ES6+ Modules** - Organización del código
- **CSS3** - Estilos y animaciones de UI

## 📂 Estructura del Proyecto
```
knowledge-tree/
├── index.html                    # Punto de entrada HTML
├── package.json                  # Dependencias y scripts
├── src/
│   ├── main.js                  # ⭐ Inicialización de la app
│   │
│   ├── config/
│   │   ├── constants.js         # ⭐ Configuración global (colores, tamaños)
│   │   └── subjects.js          # ⭐ Base de datos de materias UMSA
│   │
│   ├── core/
│   │   ├── App.js              # ⭐ Clase principal - Coordinador
│   │   ├── Scene.js            # ⭐ Configuración de escena Three.js
│   │   ├── EventBus.js         # Sistema de eventos global
│   │   └── Loader.js           # Pantalla de carga
│   │
│   ├── tree/
│   │   ├── TreeManager.js      # ⭐ Coordinador del árbol
│   │   ├── RootsBuilder.js     # Constructor de raíces
│   │   ├── TrunkBuilder.js     # Constructor del tronco
│   │   ├── BranchBuilder.js    # Constructor de ramas
│   │   └── NodeBuilder.js      # Constructor de nodos
│   │
│   ├── materials/
│   │   └── MaterialLibrary.js  # ⭐ Materiales holográficos
│   │
│   ├── particles/
│   │   ├── ParticleManager.js  # Coordinador de partículas
│   │   ├── AmbientParticles.js # Partículas ambientales
│   │   └── FlowParticles.js    # Partículas de flujo
│   │
│   ├── effects/
│   │   ├── LightingSystem.js   # Sistema de luces dinámico
│   │   └── PostProcessing.js   # Efectos post-procesamiento
│   │
│   ├── interaction/
│   │   ├── InputManager.js     # Gestión de mouse/teclado
│   │   ├── RaycasterManager.js # Detección de clicks 3D
│   │   └── CameraController.js # Control avanzado de cámara
│   │
│   ├── ui/
│   │   ├── UIManager.js        # Coordinador de UI
│   │   ├── InfoPanel.js        # Panel de información de materias
│   │   ├── ControlPanel.js     # Panel de controles
│   │   ├── StatsDisplay.js     # Display de estadísticas
│   │   └── MiniMap.js          # Mini mapa (opcional)
│   │
│   └── utils/
│       ├── Performance.js      # Monitor de rendimiento
│       ├── DebugTools.js       # Herramientas de debugging
│       └── MathHelpers.js      # Utilidades matemáticas
│
└── styles/
    ├── main.css                # ⭐ Estilos principales
    ├── panels.css              # Estilos de paneles
    └── animations.css          # Animaciones CSS
```

## 🔑 Archivos Principales

### 1. **`src/main.js`**
Punto de entrada de la aplicación. Inicializa la clase `App` y maneja el ciclo de vida.

### 2. **`src/core/App.js`**
Coordinador principal que:
- Inicializa todos los managers
- Coordina el loop de animación
- Maneja eventos globales

### 3. **`src/config/subjects.js`**
Base de datos completa de la carrera:
- Información de 35+ materias
- Prerequisitos y relaciones
- Áreas de conocimiento
- Contenidos por materia

### 4. **`src/config/constants.js`**
Configuración visual del proyecto:
- Colores por área
- Dimensiones del árbol
- Parámetros de cámara
- Configuración de efectos

### 5. **`src/tree/TreeManager.js`**
Coordina la construcción del árbol 3D usando el patrón Builder:
```javascript
TreeManager
  ├─ RootsBuilder    // Construye raíces (fundamentos)
  ├─ TrunkBuilder    // Construye tronco (núcleo)
  ├─ BranchBuilder   // Construye ramas (especialidades)
  └─ NodeBuilder     // Construye nodos (materias)
```

### 6. **`src/materials/MaterialLibrary.js`**
Define materiales holográficos usando:
- MeshPhongMaterial con alta transparencia
- Emissive intensity para brillo
- Wireframe y EdgesGeometry para efecto neón

### 7. **`src/interaction/RaycasterManager.js`**
Implementa raycasting para:
- Detectar clicks en nodos 3D
- Hover effects
- Interacción usuario-árbol

### 8. **`src/ui/UIManager.js`**
Coordina todos los elementos HTML:
- Panel de información
- Controles
- Estadísticas
- Notificaciones

## 🎨 Características Principales

### Visualización 3D
- **Árbol holográfico** con efectos neón
- **Curvas suaves CatmullRom** para ramas orgánicas
- **Materiales transparentes** con emisión de luz
- **Anillos orbitales** alrededor de nodos
- **Partículas flotantes** simulando energía

### Interactividad
- **OrbitControls** para navegación fluida
- **Raycasting** para detección precisa de clicks
- **Sistema de eventos** desacoplado (EventBus)
- **Animaciones suaves** con easing

### Arquitectura
- **Patrón Builder** para construcción modular
- **Patrón Facade** en TreeManager
- **Patrón Observer** con EventBus
- **ES6 Modules** para organización

### Rendimiento
- **BufferGeometry** para eficiencia
- **Instanced rendering** donde sea posible
- **Monitor de FPS** con ajuste dinámico
- **Culling** automático de Three.js

## 🎯 Flujo de Ejecución
```
1. main.js
   ↓
2. App.init()
   ├─ SceneManager.create()      // Crea escena, cámara, renderer
   ├─ OrbitControls.setup()      // Configura controles
   ├─ TreeManager.build()        // Construye árbol completo
   │   ├─ RootsBuilder.build()   // Raíces
   │   ├─ TrunkBuilder.build()   // Tronco
   │   └─ BranchBuilder.build()  // Ramas + nodos
   ├─ ParticleManager.init()     // Sistemas de partículas
   ├─ LightingSystem.init()      // Luces dinámicas
   ├─ InputManager.setup()       // Mouse/teclado
   └─ UIManager.init()           // Interfaz HTML
   ↓
3. App.animate() [loop]
   ├─ Update controls
   ├─ Update tree animations
   ├─ Update particles
   ├─ Update lights
   └─ Render scene
```

## 📊 Base de Datos de Materias

Las materias se organizan en tres niveles:
```javascript
ROOTS (7 materias)     // Fundamentos - Semestres 1-2
TRUNK (5 materias)     // Núcleo - Semestres 3-5
BRANCHES (25+ materias) // Especialidades - Semestres 6-10
  ├─ web: Desarrollo Web/Móvil
  ├─ ia: Inteligencia Artificial
  ├─ redes: Redes y Seguridad
  ├─ sistemas: Sistemas y Hardware
  ├─ datos: Bases de Datos
  └─ gamedev: Game Dev & XR
```

Cada materia incluye:
- Código (ID)
- Nombre
- Área de conocimiento
- Semestre
- Créditos y horas
- Prerequisites
- Descripción
- Temas del curso
- Docente

## 🛠️ Personalización

### Cambiar colores
Edita `src/config/constants.js`:
```javascript
export const COLORS = {
  areas: {
    fundamentos: 0x00ffff,  // Cambiar aquí
    web: 0x00BFFF,
    // ...
  }
};
```

### Agregar materias
Edita `src/config/subjects.js`:
```javascript
export const TRUNK = [
  {
    id: "INF-XXX",
    name: "Nueva Materia",
    area: "fundamentos",
    // ...
  }
];
```

### Ajustar dimensiones del árbol
Edita `src/config/constants.js` → `TREE_CONFIG`

## 🐛 Debugging

Presiona `D` para activar modo debug:
- Muestra ejes coordenados
- Log de estadísticas de escena
- Información de rendimiento

Presiona `Shift+S` para captura de pantalla.

## 📝 Notas Técnicas

- **No usar localStorage/sessionStorage** en artifacts (limitación de claude.ai)
- **Todas las URLs externas** deben ser de `cdnjs.cloudflare.com`
- **Estado en memoria** durante la sesión
- **Responsive design** con media queries

## 👨‍💻 Autor

Proyecto desarrollado para la Carrera de Informática - UMSA  
La Paz, Bolivia

---

**Versión:** 1.0.0  
**Licencia:** MIT