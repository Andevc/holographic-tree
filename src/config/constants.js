// ============================================
// COLORES DEL PROYECTO
// ============================================
export const COLORS = {
  // Color de fondo de la escena
  background: 0x0a0a15,  // Azul oscuro casi negro
  
  // Color del grid del suelo
  grid: {
    primary: 0x00ffff,   // Cian brillante
    secondary: 0x1b3848  // Azul oscuro
  },
  

  // Colores por área del conocimiento
  // Cada área tiene su color único para identificación visual
  areas: {
    fundamentos: 0x00ffff,  // Cian - Base del conocimiento
    web: 0x00BFFF,          // Azul cielo - Desarrollo web
    ia: 0x9D00FF,           // Morado - Inteligencia artificial
    redes: 0x00FF88,        // Verde - Redes y conectividad
    sistemas: 0xFF3366,     // Rojo - Sistemas y hardware
    datos: 0xFFB800,        // Naranja - Bases de datos
    gamedev: 0xFF00FF       // Rosa - Desarrollo de videojuegos
  },
  
  // Colores para efectos especiales
  effects: {
    glow: 0x00ffff,
    highlight: 0xffffff,
    selection: 0xffff00
  }
};

// ============================================
// CONFIGURACIÓN DEL ÁRBOL
// ============================================
export const TREE_CONFIG = {
  // RAÍCES - Base del árbol (fundamentos de la carrera)
  roots: {
    count: 4,              // Número de raíces (3 materias base)
    radius: 5,             // Distancia del centro (radio del círculo)
    radiusTop: 0.5,
    radiusBottom: 0,
    size: 1,             // Radio de la base del cono
    height: 1.5,           // Altura del cono invertido
    segments: 16,          // Número de segmentos (más = más suave)
    yPosition: 0       // Posición vertical (enterradas)
  },
  
  // TRONCO - Núcleo central del árbol
  trunk: {
    radiusTop: 0.2,        // Ya no se usa (ahora es TubeGeometry)
    radiusBottom: 1.0,     // Ya no se usa
    height: 7,             // Altura total del tronco (se mantiene)
    segments: 10,
    heightSegments: 5,
    yPosition: 7,          // Altura donde empiezan las ramas
    
    // ✨ NUEVAS configuraciones para tronco curvo
    tubeRadius: 1,       // Grosor del tubo (antes era radiusBottom)
    startY: 2,             // Donde termina el tronco (donde están las raíces)
    curveIntensity: 0.3,   // Qué tan curvado está (0 = recto, 1 = muy curvo)
    
    rings: {
      count: 12,           // Número de anillos (antes era 6)
      spacing: 1.5,
      thickness: 0.025,    // Grosor del torus
      startY: 7
    }
  },
  // RAMAS - Especialidades que salen del tronco
  branches: {
    count: 5,              // Número de ramas principales
    tubeRadius: 0.05,      // Grosor de la rama (tubo)
    segments: 40,          // Segmentos del tubo (suavidad de la curva)
    radialSegments: 12,    // Segmentos radiales del tubo (redondez)
    length: 5,             // Longitud base de la rama
    curvature: 1,          // Altura del punto medio de la curva
    startY: 7,             // Altura donde empiezan las ramas
    spread: 0.9            // Variación de altura entre ramas
  },
  
  // NODOS - Esferas que representan materias
  nodes: {
    radius: 0.25,          // Radio de la esfera
    segments: 24,          // Segmentos (más = más suave)
    
    // Anillos decorativos alrededor de los nodos
    rings: {
      inner: {
        min: 0.4,          // Radio interno del anillo
        max: 0.5,          // Radio externo del anillo
        opacity: 0.4       // Transparencia
      },
      outer: {
        min: 0.52,
        max: 0.6,
        opacity: 0.2
      }
    }
  },
  
  // DISTRIBUCIÓN de nodos en el tronco
  trunkNodes: {
    radius: 1.2,           // Distancia del centro del tronco
    startY: 1,             // Altura inicial
    spacing: 1             // Espacio vertical entre nodos
  }
};

// ============================================
// CONFIGURACIÓN DE CÁMARA
// ============================================
export const CAMERA_CONFIG = {
  // Parámetros de perspectiva
  fov: 90,                 // Field of view (ángulo de visión)
  near: 0.1,               // Plano cercano de recorte
  far: 3500,               // Plano lejano de recorte
  
  // Posición inicial de la cámara
  position: {
    x: 5,
    y: 4,
    z: 10
  },
  
  // Objetivo al que mira la cámara
  target: {
    x: 0,
    y: 10,
    z: 0
  },
  
  // Límites de zoom (con OrbitControls)
  minDistance: 3,          // No acercarse más de 5 unidades
  maxDistance: 25,         // No alejarse más de 25 unidades
  
  // Límites de rotación vertical
  minPolarAngle: Math.PI*0.2 ,
  maxPolarAngle: Math.PI*0.9 
};

// ============================================
// CONFIGURACIÓN DE LUCES
// ============================================
export const LIGHTS_CONFIG = {
  // Luz ambiental - ilumina todo suavemente
  ambient: {
    color: 0xffffff,
    intensity: 0.3
  },
  
  // Luz direccional - simula el sol
  directional: {
    color: 0xffffff,
    intensity: 0.5,
    position: { x: 5, y: 10, z: 5 },
    castShadow: true,
    shadow: {
      camera: { near: 0.1, far: 50, size: 15 },
      mapSize: 2048
    }
  },
  
  // Luces de punto - acentos de color
  point: [
    {
      color: 0x00ffff,
      intensity: 1,
      distance: 20,
      position: { x: -5, y: 5, z: 5 }
    },
    {
      color: 0xff00ff,
      intensity: 0.8,
      distance: 20,
      position: { x: 5, y: 5, z: -5 }
    }
  ],
  
  // Luz hemisférica - simula cielo y suelo
  hemisphere: {
    skyColor: 0x0066ff,
    groundColor: 0x002244,
    intensity: 0.4
  }
};

// ============================================
// CONFIGURACIÓN DE PARTÍCULAS
// ============================================
export const PARTICLES_CONFIG = {
  // Partículas ambientales - distribuidas por toda la escena
  ambient: {
    count: 500,            // Número de partículas
    size: 0.1,             // Tamaño de cada partícula
    opacity: 0.5,          // Transparencia
    spread: {              // Área de distribución
      radius: { min: 3, max: 50 },
      height: { min: -3, max: 12 }
    },
    velocity: {            // Velocidad de movimiento
      x: 0.002,
      y: 0.005,
      z: 0.002
    }
  },
  
  // Partículas que fluyen - suben desde las raíces
  flowing: {
    count: 2,
    size: 0.05,
    opacity: 0.8,
    speed: 0.0009,          // Velocidad de ascenso
    startY: 3,            // Altura inicial
    endY: 20,               // Altura final
    radius: 1.2            // Radio de distribución
  },
  
  // Partículas flotantes - cerca del árbol
  floating: {
    count: 300,
    size: 0.08,
    opacity: 1,
    spread: {
      radius: { min: 1, max: 1.3 },
      height: { min: 0, max: 2 }
    },
    rotationSpeed: 0.0005  // Velocidad de rotación del grupo
  }
};

// ============================================
// CONFIGURACIÓN DE MATERIALES
// ============================================
export const MATERIALS_CONFIG = {
  hologram: {
    wireframe: false,  // Cambiado a false
    transparent: true,
    opacity: 0.5,  // Antes: 0.7 → Ahora: 0.5
    shininess: 100,  // NUEVO
    emissiveIntensity: 0.6
  },
  
  node: {
    wireframe: false,
    transparent: true,
    opacity: 0.7,  // Antes: 0.9 → Ahora: 0.7
    shininess: 100,  // NUEVO
    emissiveIntensity: 0.8
  },
  
  tube: {
    wireframe: false,
    transparent: true,
    opacity: 0.4,  // Antes: 0.8 → Ahora: 0.4
    shininess: 100,  // NUEVO
    emissiveIntensity: 0.5
  }
};

// ============================================
// CONFIGURACIÓN DE EFECTOS VISUALES
// ============================================
export const EFFECTS_CONFIG = {
  // Configuración de Bloom (efecto de brillo)
  bloom: {
    threshold: 0.7,        // Objetos más brillantes que esto brillarán
    strength: 1.5,         // Intensidad del brillo
    radius: 0.8,           // Radio del efecto
    exposure: 1            // Exposición general
  },
  
  // Niebla atmosférica
  fog: {
    color: 0x131313,       // Mismo color que el fondo
    near: 15,              // Distancia donde empieza
    far: 150                // Distancia donde es opaca
  }
};

// ============================================
// CONFIGURACIÓN DE ANIMACIONES
// ============================================
export const ANIMATION_CONFIG = {
  // Velocidades de animación
  node: {
    pulseSpeed: 2,         // Velocidad del pulso (escala)
    pulseAmount: 0.1,      // Cantidad de cambio de escala
    floatSpeed: 1,         // Velocidad de flotación
    floatAmount: 0.05      // Cantidad de movimiento vertical
  },
  
  lights: {
    pulseSpeed: 0.5,       // Velocidad del pulso de luces
    pulseAmount: 0.3       // Cantidad de cambio de intensidad
  },
  
  baseRing: {
    pulseSpeed: 2,         // Velocidad del pulso del anillo base
    scaleAmount: 0.02,     // Cantidad de cambio de escala
    opacityBase: 0.4,      // Opacidad base
    opacityAmount: 0.2     // Variación de opacidad
  }
};

// ============================================
// CONFIGURACIÓN DE RENDIMIENTO
// ============================================
export const PERFORMANCE_CONFIG = {
  // FPS objetivo
  targetFPS: 60,
  
  // Límite bajo de FPS para reducir calidad
  minFPS: 30,
  
  // Calidad reducida (cuando FPS < 30)
  lowQuality: {
    particleCount: 300,    // Reducir partículas
    shadowMapSize: 1024,   // Reducir calidad de sombras
    antialiasing: false    // Desactivar antialiasing
  },
  
  // Calidad normal
  normalQuality: {
    particleCount: 1000,
    shadowMapSize: 2048,
    antialiasing: true
  }
};

// ============================================
// CONFIGURACIÓN DE UI
// ============================================
export const UI_CONFIG = {
  // Transiciones
  transitions: {
    panelDuration: 300,    // ms para abrir/cerrar paneles
    fadeInDuration: 200,   // ms para fade in
    fadeOutDuration: 150   // ms para fade out
  },
  
  // Tamaños
  sizes: {
    infoPanelWidth: 400,   // px
    controlPanelWidth: 200,
    miniMapSize: 150
  }
};

// ============================================
// EXPORTS ÚTILES
// ============================================

/**
 * Obtener color por área
 * @param {string} area - Nombre del área
 * @returns {number} Color en hexadecimal
 */
export function getColorByArea(area) {
  return COLORS.areas[area] || COLORS.areas.fundamentos;
}

/**
 * Convertir hex a RGB normalizado (para shaders)
 * @param {number} hex - Color en hexadecimal
 * @returns {object} {r, g, b} normalizado 0-1
 */
export function hexToRGB(hex) {
  return {
    r: ((hex >> 16) & 255) / 255,
    g: ((hex >> 8) & 255) / 255,
    b: (hex & 255) / 255
  };
}