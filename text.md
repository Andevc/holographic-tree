Guía de Implementación: Árbol Holográfico 3D en tu Proyecto
📋 RESUMEN DE CAMBIOS NECESARIOS
Necesitas crear un sistema de múltiples ramas holográficas similar al artifact que creé, pero adaptado a la estructura de tu proyecto UMSA.

🎯 ARCHIVOS A MODIFICAR (en orden de prioridad)
1️⃣ CONFIGURACIÓN BASE
src/config/constants.js
Qué modificar:

Actualizar TREE_CONFIG para soportar múltiples ramas con curvas
Agregar configuración para 7 áreas (Base de Datos, Web, IA, Ciberseguridad, Cloud, DevOps, Redes)
Cambiar colores para que sean más holográficos (cian, naranja, magenta, verde, amarillo, rojo)

javascript// AÑADIR/MODIFICAR:
branches: {
  count: 7,  // Ahora son 7 ramas
  curvePoints: 5,  // 5 puntos = 3 curvas por rama
  tubeRadius: 0.12,
  segments: 100,  // Más segmentos para curvas suaves
  // ... configuración de posiciones para cada rama
}

trunk: {
  // Hacer que sea más grande y con curvatura
  curvePoints: [...],  // Puntos para la curva en S
  clickable: true  // Nuevo: permitir click en el tronco
}

2️⃣ DATOS DE MATERIAS
src/config/subjects.js
Qué modificar:

Reorganizar las materias en las 7 áreas nuevas
Agregar materias de las nuevas áreas (Ciberseguridad, Cloud, DevOps, Redes)

javascript// AÑADIR nuevas áreas a KNOWLEDGE_AREAS:
ciberseguridad: { name: "Ciberseguridad", color: "red", ... }
cloud: { name: "Cloud Computing", color: "green", ... }
devops: { name: "DevOps", color: "yellow", ... }
redes: { name: "Redes", color: "cyan-green", ... }

// ACTUALIZAR BRANCHES con las 7 áreas
export const BRANCHES = {
  basedatos: [...],  // Base de datos
  web: [...],        // Desarrollo web
  ia: [...],         // IA
  ciberseguridad: [...],  // NUEVA
  cloud: [...],      // NUEVA
  devops: [...],     // NUEVA
  redes: [...]       // NUEVA
};

3️⃣ CONSTRUCTORES DEL ÁRBOL
src/tree/TrunkBuilder.js
Cambios principales:

Reemplazar cilindro recto por tubería curva (TubeGeometry con CatmullRomCurve3)
Hacer el tronco más grande que las ramas
Agregar userData clickeable con información de "Informática"

javascript// REEMPLAZAR createTrunk() por:
createCurvedTrunk() {
  // Crear curva en S con CubicBezierCurve3
  const trunkCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0, -8, 0),    // Inicio
    new THREE.Vector3(-0.3, -6, 0.2), // Control 1
    new THREE.Vector3(0.3, -4, -0.2), // Control 2
    new THREE.Vector3(0, -3, 0)     // Fin
  );
  
  // Crear tubería (no cilindro)
  const tubeGeometry = new THREE.TubeGeometry(trunkCurve, 32, 0.5, 16, false);
  
  // Agregar userData para click
  trunk.userData = {
    type: 'trunk',
    subjectData: {
      name: "Informática",
      description: "Campo de estudio que abarca..."
    }
  };
  
  // ... anillos siguiendo la curva
}

src/tree/BranchBuilder.js
Cambios principales:

Cambiar de curvas QuadraticBezierCurve3 a CatmullRomCurve3 (para 3 curvas)
Agregar configuración para 7 ramas en posiciones 3D diferentes
Hacer que todas las ramas partan del punto (0, -3, 0)

javascriptbuildBranches() {
  // NUEVA CONFIGURACIÓN: 7 ramas con 5 puntos cada una
  const branchConfigs = [
    { 
      area: 'basedatos',
      points: [
        new THREE.Vector3(0, -3, 0),      // Inicio (desde tronco)
        new THREE.Vector3(-0.8, -1.5, 0.3),
        new THREE.Vector3(0.5, 0, -0.2),
        new THREE.Vector3(-0.3, 1.5, 0.4),
        new THREE.Vector3(0, 3, 0)        // Fin
      ],
      color: 0x00ffff,
      radius: 0.15
    },
    { 
      area: 'web',
      points: [/* 5 puntos diferentes */],
      color: 0xff6600,
      radius: 0.12
    },
    // ... 5 ramas más con diferentes trayectorias
  ];
  
  branchConfigs.forEach(config => {
    // Crear curva CatmullRom (pasa por todos los puntos)
    const curve = new THREE.CatmullRomCurve3(config.points);
    curve.tension = 0.5;
    
    const tubeGeometry = new THREE.TubeGeometry(curve, 100, config.radius, 16, false);
    // ... resto del código
  });
}

4️⃣ INTERACCIÓN
src/interaction/RaycasterManager.js
Qué modificar:

Agregar detección de click en el tronco
Manejar el click del tronco de forma especial

javascriptcheckClick(mouseX, mouseY) {
  // ... código existente ...
  
  const intersects = this.raycaster.intersectObjects(this.nodes, false);
  
  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    
    // NUEVA LÓGICA: detectar si es tronco
    if (clickedObject.userData.type === 'trunk') {
      EventBus.emit(EVENTS.TRUNK_CLICKED, {
        data: clickedObject.userData.subjectData
      });
    } else {
      // Click normal en nodo
      EventBus.emit(EVENTS.NODE_CLICKED, {
        node: clickedObject,
        data: clickedObject.userData.subjectData
      });
    }
  }
}

src/tree/TreeManager.js
Qué modificar:

Agregar el tronco a los objetos interactivos
Pasar referencia del tronco al InputManager

javascriptbuild() {
  // ... código existente ...
  
  // MODIFICAR buildTrunk para que retorne el mesh del tronco
  const { nodes: trunkNodes, trunk: trunkMesh } = this.trunkBuilder.build();
  
  // Guardar referencia al tronco
  this.trunk = trunkMesh;
  
  // IMPORTANTE: Agregar tronco a objetos clickeables
  this.allNodes.push(trunkMesh);  // Ahora el tronco también es clickeable
}

getNodes() {
  // Retornar nodos + tronco para interacción
  return [...this.allNodes, this.trunk].filter(Boolean);
}

5️⃣ INTERFAZ DE USUARIO
src/ui/InfoPanel.js
Qué modificar:

Agregar caso especial para cuando se hace click en el tronco

javascriptsetupEvents() {
  // ... código existente ...
  
  // NUEVO: Escuchar click en tronco
  EventBus.on(EVENTS.TRUNK_CLICKED, (data) => {
    this.showTrunkInfo(data.data);
  });
}

showTrunkInfo(data) {
  // Mostrar info especial del tronco (Informática general)
  const html = `
    <div class="fade-in">
      <h2>🌳 ${data.name}</h2>
      <p>${data.description}</p>
      <p style="font-size: 12px; margin-top: 10px;">
        Haz clic en las ramas para explorar cada área
      </p>
    </div>
  `;
  this.content.innerHTML = html;
  this.element.classList.remove('hidden');
}

src/core/EventBus.js
Qué modificar:

Agregar evento para el tronco

javascriptexport const EVENTS = {
  // ... eventos existentes ...
  
  // NUEVO: Evento para click en tronco
  TRUNK_CLICKED: 'trunk:clicked',
};

6️⃣ CÁMARA Y POSICIONAMIENTO
src/core/Scene.js
Qué modificar:

Ajustar posición inicial de la cámara para ver todo el árbol con 7 ramas

javascriptcreateCamera() {
  // MODIFICAR posición de cámara para vista más alejada
  this.camera.position.set(
    0,   // x: centrado
    0,   // y: a la altura media
    22   // z: más alejado (era 12, ahora 22)
  );
  
  this.camera.lookAt(0, 2, 0);
}

📝 ORDEN RECOMENDADO DE IMPLEMENTACIÓN

Fase 1: Configuración (1 hora)

constants.js: Agregar configuración de 7 ramas
subjects.js: Reorganizar materias en 7 áreas


Fase 2: Tronco curvo (1-2 horas)

TrunkBuilder.js: Implementar tronco con curva
Probar que se vea bien


Fase 3: Ramas múltiples (2-3 horas)

BranchBuilder.js: Implementar 7 ramas con CatmullRomCurve3
Ajustar posiciones para evitar colisiones


Fase 4: Interactividad (1 hora)

TreeManager.js: Agregar tronco a clickeables
RaycasterManager.js: Detectar click en tronco
EventBus.js: Nuevo evento


Fase 5: UI (30 min)

InfoPanel.js: Mostrar info del tronco
Probar todo el flujo


Fase 6: Ajustes visuales (1 hora)

Scene.js: Ajustar cámara
Colores y materiales finales
Testing




🎨 TIPS IMPORTANTES

NO modifiques main.js, App.js ni Scene.js más allá de ajustes de cámara
Los archivos de partículas (ParticleManager.js, etc.) pueden quedar igual
RootsBuilder.js solo necesita cambios menores en colores
Prueba cada fase antes de pasar a la siguiente

¿Por cuál archivo quieres que comience con el código específico?Claude es IA y puede cometer errores. Por favor, verifica nuevamente las respuestas.