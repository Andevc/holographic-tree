// ============================================
// COLORES DEL PROYECTO
// ============================================
export const COLORS = {
  background: 0x0a0a15,

  grid: {
    primary: 0x00ffff,
    secondary: 0x1b3848
  },

  areas: {
    fundamentos: 0x00ffff,
    web: 0x00BFFF,
    ia: 0x9D00FF,
    redes: 0x00FF88,
    sistemas: 0xFF3366,
    datos: 0xFFB800,
    gamedev: 0xFF00FF,
    mobile: 0x00D9FF,
    devops: 0xFF6B35,
    datascience: 0x4ECDC4,
    blockchain: 0xFFD93D,
    iot: 0xFF1744,
    design: 0xE91E63,
    testing: 0x76FF03,
    architecture: 0x7B68EE,    // Púrpura medio
    backend: 0x20B2AA,         // Turquesa claro
    os: 0xFF8C00,              // Naranja oscuro
    performance: 0x32CD32,     // Verde lima
    apis: 0x1E90FF,            // Azul Dodger
    quantum: 0xDA70D6,         // Orquídea
    robotics: 0xFF4500,        // Rojo-naranja
    arvr: 0x00CED1             // Turquesa oscuro
  },

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
  roots: {
    count: 8,
    radius: 5,
    radiusTop: 0.5,
    radiusBottom: 0,
    size: 1,
    height: 1.5,
    segments: 16,
    yPosition: 1
  },

  trunk: {

    height: 21,
    yPosition: 8,
    startY: 4,
    radiusTop: 0.01,
    radiusBottom: 1,
  
    particles: {
      count: 100,
      size: 0.005,
      opacity: 0.6
    },
  },

  clusters: {
    central: {
      radius: 0.4,
      segments: 32,
      opacity: 0.7,
      emissiveIntensity: 1.2,
      rings: [
        { radius: 1.4, opacity: 0.4 },
        { radius: 1.7, opacity: 0.3 },
        { radius: 2.0, opacity: 0.2 },
        { radius: 2.3, opacity: 0.1 }
      ]
    },
    satellite: {
      radius: 0.2,
      segments: 16,
      opacity: 0.6,
      emissiveIntensity: 0.8,
      ring: {
        innerRadius: 0.25,
        outerRadius: 0.35,
        opacity: 0.5
      }
    },
    orbit: {
      radius: 2, 
      floatSpeed: 0.5,
      floatAmount: 0.1
    },
    connections: {
      opacity: 0.5,
      curveHeight: 0.5
    },
    labels: {
      central: {
        yOffset: 0.8,
        width: 512,
        height: 128,
        fontSize: 48,
        scale: 2.5
      },
      satellite: {
        yOffset: 0.4,
        width: 256,
        height: 64,
        fontSize: 32,
        scale: 1.5
      }
    }
  },

  // Configuración antigua de branches (por si acaso)
  branches: {
    count: 5,
    startRadius: 0.2,
    endRadius: 0.0001,
    segments: 90,
    radialSegments: 16,
    length: 5,
    startY: 7,
    spread: 0.9,
    tension: 0.5,
    controlPoints: 5,

    rings: {
      count: 15,
      spacing: 2,
      baseRadius: 0.25,
      tipRadius: 0.1,
      thickness: 0.015,
      opacity: 0.3
    },

    particles: {
      count: 100,
      size: 0.025,
      opacity: 0.7
    }
  },

  nodes: {
    radius: 0.25,
    segments: 24,
    rings: {
      inner: {
        min: 0.4,
        max: 0.5,
        opacity: 0.4
      },
      outer: {
        min: 0.52,
        max: 0.6,
        opacity: 0.2
      }
    }
  },

  trunkNodes: {
    radius: 1.2,
    startY: 1,
    spacing: 1
  }
};

// ============================================
// CONFIGURACIÓN DE CÁMARA
// ============================================
export const CAMERA_CONFIG = {
  fov: 90,
  near: 0.1,
  far: 3500,

  position: {
    x: 5,
    y: 8,
    z: 12
  },

  target: {
    x: 0,
    y: 10,
    z: 0
  },

  minDistance: 1,
  maxDistance: 25,

  minPolarAngle: Math.PI * 0.2,
  maxPolarAngle: Math.PI * 0.9
};

// ============================================
// CONFIGURACIÓN DE LUCES
// ============================================
export const LIGHTS_CONFIG = {
  ambient: {
    color: 0xffffff,
    intensity: 0.3
  },

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
  ambient: {
    count: 500,
    size: 0.1,
    opacity: 0.5,
    spread: {
      radius: { min: 3, max: 50 },
      height: { min: -3, max: 12 }
    },
    velocity: {
      x: 0.002,
      y: 0.005,
      z: 0.002
    }
  },

  flowing: {
    count: 200,
    size: 0.05,
    opacity: 1,
    speed: 0.001,
    startY: 3,
    endY: 23,
    radius: 8
  },

  floating: {
    count: 1500,
    size: 0.08,
    opacity: 1,
    spread: {
      radius: { min: 1, max: 1.3 },
      height: { min: 0, max: 2 }
    },
    rotationSpeed: 0.0005
  }
};

// ============================================
// CONFIGURACIÓN DE MATERIALES
// ============================================
export const MATERIALS_CONFIG = {
  hologram: {
    wireframe: false,
    transparent: true,
    opacity: 0.5,
    shininess: 100,
    emissiveIntensity: 2
  },

  node: {
    wireframe: false,
    transparent: true,
    opacity: 0.7,
    shininess: 100,
    emissiveIntensity: 0.8
  },

  tube: {
    wireframe: false,
    transparent: true,
    opacity: 0.4,
    shininess: 100,
    emissiveIntensity: 0.5
  }
};

// ============================================
// CONFIGURACIÓN DE EFECTOS VISUALES
// ============================================
export const EFFECTS_CONFIG = {
  bloom: {
    threshold: 0.7,
    strength: 1.5,
    radius: 0.8,
    exposure: 1
  },

  fog: {
    color: 0x131313,
    near: 15,
    far: 150
  }
};

// ============================================
// CONFIGURACIÓN DE ANIMACIONES
// ============================================
export const ANIMATION_CONFIG = {
  node: {
    pulseSpeed: 2,
    pulseAmount: 0.1,
    floatSpeed: 1,
    floatAmount: 0.05
  },

  lights: {
    pulseSpeed: 0.5,
    pulseAmount: 0.3
  },

  baseRing: {
    pulseSpeed: 2,
    scaleAmount: 0.02,
    opacityBase: 0.4,
    opacityAmount: 0.2
  }
};

// ============================================
// EXPORTS ÚTILES
// ============================================
export function getColorByArea(area) {
  return COLORS.areas[area] || COLORS.areas.fundamentos;
}

export function hexToRGB(hex) {
  return {
    r: ((hex >> 16) & 255) / 255,
    g: ((hex >> 8) & 255) / 255,
    b: (hex & 255) / 255
  };
}