export const CAREER_INFO = {};
export const KNOWLEDGE_AREAS = {};
export const ROOTS = [];
export const TRUNK = [];

// ============================================
// BRANCHES - NUEVO SISTEMA DE CLUSTERS
// ============================================
export const BRANCHES = {
  // ========== NIVEL 1: Y=10 (positionBranch), Y=13.5 (position), Z=7 ==========
  
  // CLUSTER 1: Desarrollo Web (Posición 0° - Norte)
  web: {
    name: 'Desarrollo Web',
    area: 'web',
    position: { x: 0, y: 13.5, z: -7 },
    positionBranch: { x: 0, y: 10, z: 0 },
    satellites: [
      { name: 'React', description: 'Biblioteca UI para interfaces modernas', id: 'SAT-WEB-001', area: 'web' },
      { name: 'Node.js', description: 'Backend JavaScript y APIs', id: 'SAT-WEB-002', area: 'web' },
      { name: 'HTML/CSS', description: 'Estructura y diseño web', id: 'SAT-WEB-003', area: 'web' },
      { name: 'TypeScript', description: 'JavaScript tipado y robusto', id: 'SAT-WEB-004', area: 'web' },
      { name: 'REST APIs', description: 'Servicios web RESTful', id: 'SAT-WEB-005', area: 'web' },
      { name: 'GraphQL', description: 'Query language para APIs', id: 'SAT-WEB-006', area: 'web' },
      { name: 'Next.js', description: 'Framework React fullstack', id: 'SAT-WEB-007', area: 'web' },
      { name: 'Tailwind', description: 'Framework CSS utility-first', id: 'SAT-WEB-008', area: 'web' }
    ]
  },

  // CLUSTER 2: Inteligencia Artificial (Posición 72° - Noreste)
  ia: {
    name: 'Inteligencia Artificial',
    area: 'ia',
    position: { x: 6.65, y: 13.5, z: -2.17 },
    positionBranch: { x: 0, y: 10, z: 0 },
    satellites: [
      { name: 'Machine Learning', description: 'Aprendizaje automático y modelos', id: 'SAT-IA-001', area: 'ia' },
      { name: 'Deep Learning', description: 'Redes neuronales profundas', id: 'SAT-IA-002', area: 'ia' },
      { name: 'NLP', description: 'Procesamiento lenguaje natural', id: 'SAT-IA-003', area: 'ia' },
      { name: 'Computer Vision', description: 'Visión artificial y reconocimiento', id: 'SAT-IA-004', area: 'ia' },
      { name: 'TensorFlow', description: 'Framework ML de Google', id: 'SAT-IA-005', area: 'ia' },
      { name: 'PyTorch', description: 'Framework ML dinámico', id: 'SAT-IA-006', area: 'ia' }
    ]
  },

  // CLUSTER 3: Redes y Seguridad (Posición 144° - Sureste)
  redes: {
    name: 'Redes y Seguridad',
    area: 'redes',
    position: { x: 4.11, y: 13.5, z: 5.67 },
    positionBranch: { x: 0, y: 10, z: 0 },
    satellites: [
      { name: 'Criptografía', description: 'Cifrado y protección de datos', id: 'SAT-RED-001', area: 'redes' },
      { name: 'Firewalls', description: 'Seguridad perimetral de red', id: 'SAT-RED-002', area: 'redes' },
      { name: 'VPN', description: 'Redes privadas virtuales', id: 'SAT-RED-003', area: 'redes' },
      { name: 'TCP/IP', description: 'Protocolos de red fundamentales', id: 'SAT-RED-004', area: 'redes' },
      { name: 'DNS', description: 'Sistema de nombres de dominio', id: 'SAT-RED-005', area: 'redes' },
      { name: 'SSL/TLS', description: 'Seguridad en transporte', id: 'SAT-RED-006', area: 'redes' },
      { name: 'Pentesting', description: 'Pruebas de penetración ética', id: 'SAT-RED-007', area: 'redes' }
    ]
  },

  // CLUSTER 4: Bases de Datos (Posición 216° - Suroeste)
  datos: {
    name: 'Bases de Datos',
    area: 'datos',
    position: { x: -4.11, y: 13.5, z: 5.67 },
    positionBranch: { x: 0, y: 10, z: 0 },
    satellites: [
      { name: 'SQL', description: 'Lenguaje consultas relacionales', id: 'SAT-DAT-001', area: 'datos' },
      { name: 'NoSQL', description: 'Bases de datos no relacionales', id: 'SAT-DAT-002', area: 'datos' },
      { name: 'MongoDB', description: 'Base de datos documental', id: 'SAT-DAT-003', area: 'datos' },
      { name: 'PostgreSQL', description: 'RDBMS open source avanzado', id: 'SAT-DAT-004', area: 'datos' },
      { name: 'Redis', description: 'Cache y base datos en memoria', id: 'SAT-DAT-005', area: 'datos' },
      { name: 'Data Mining', description: 'Minería y análisis de datos', id: 'SAT-DAT-006', area: 'datos' }
    ]
  },

  // CLUSTER 5: Cloud Computing (Posición 288° - Noroeste)
  sistemas: {
    name: 'Cloud Computing',
    area: 'sistemas',
    position: { x: -6.65, y: 13.5, z: -2.17 },
    positionBranch: { x: 0, y: 10, z: 0 },
    satellites: [
      { name: 'AWS', description: 'Amazon Web Services', id: 'SAT-SIS-001', area: 'sistemas' },
      { name: 'Docker', description: 'Contenedorización de apps', id: 'SAT-SIS-002', area: 'sistemas' },
      { name: 'Kubernetes', description: 'Orquestación de contenedores', id: 'SAT-SIS-003', area: 'sistemas' },
      { name: 'CI/CD', description: 'Integración y despliegue continuo', id: 'SAT-SIS-004', area: 'sistemas' },
      { name: 'Terraform', description: 'Infraestructura como código', id: 'SAT-SIS-005', area: 'sistemas' },
      { name: 'Serverless', description: 'Computación sin servidores', id: 'SAT-SIS-006', area: 'sistemas' }
    ]
  },

  // ========== NIVEL 2: Y=12.5 (positionBranch), Y=16 (position), Z=6.5 ==========
  
  // CLUSTER 6: Game Development (Posición 36° - Rotado respecto nivel anterior)
  gamedev: {
    name: 'Game Development',
    area: 'gamedev',
    position: { x: 4.7, y: 16, z: -4.7 },
    positionBranch: { x: 0, y: 12.5, z: 0 },
    satellites: [
      { name: 'Unity', description: 'Motor de juegos multiplataforma', id: 'SAT-GAME-001', area: 'gamedev' },
      { name: 'Unreal Engine', description: 'Motor gráficos AAA', id: 'SAT-GAME-002', area: 'gamedev' },
      { name: 'C#', description: 'Lenguaje principal Unity', id: 'SAT-GAME-003', area: 'gamedev' },
      { name: 'C++', description: 'Programación alto rendimiento', id: 'SAT-GAME-004', area: 'gamedev' },
      { name: 'Game Design', description: 'Diseño mecánicas y jugabilidad', id: 'SAT-GAME-005', area: 'gamedev' },
      { name: '3D Modeling', description: 'Modelado assets 3D', id: 'SAT-GAME-006', area: 'gamedev' },
      { name: 'Physics', description: 'Sistemas físicas y colisiones', id: 'SAT-GAME-007', area: 'gamedev' },
      { name: 'Shaders', description: 'Programación gráfica GPU', id: 'SAT-GAME-008', area: 'gamedev' },
      { name: 'Godot', description: 'Motor open source ligero', id: 'SAT-GAME-009', area: 'gamedev' },
      { name: 'AI Behavior', description: 'IA para NPCs y enemigos', id: 'SAT-GAME-010', area: 'gamedev' }
    ]
  },

  // CLUSTER 7: Mobile Development
  mobile: {
    name: 'Desarrollo Móvil',
    area: 'mobile',
    position: { x: 6.5, y: 16, z: 2 },
    positionBranch: { x: 0, y: 12.5, z: 0 },
    satellites: [
      { name: 'React Native', description: 'Apps móviles con React', id: 'SAT-MOB-001', area: 'mobile' },
      { name: 'Flutter', description: 'Framework UI multiplataforma', id: 'SAT-MOB-002', area: 'mobile' },
      { name: 'Swift', description: 'Desarrollo iOS nativo', id: 'SAT-MOB-003', area: 'mobile' },
      { name: 'Kotlin', description: 'Desarrollo Android moderno', id: 'SAT-MOB-004', area: 'mobile' },
      { name: 'PWA', description: 'Progressive Web Apps', id: 'SAT-MOB-005', area: 'mobile' },
      { name: 'Firebase', description: 'Backend móvil de Google', id: 'SAT-MOB-006', area: 'mobile' }
    ]
  },

  // CLUSTER 8: DevOps
  devops: {
    name: 'DevOps',
    area: 'devops',
    position: { x: 0, y: 16, z: 6.5 },
    positionBranch: { x: 0, y: 12.5, z: 0 },
    satellites: [
      { name: 'Git', description: 'Control de versiones distribuido', id: 'SAT-DEV-001', area: 'devops' },
      { name: 'Jenkins', description: 'Automatización CI/CD', id: 'SAT-DEV-002', area: 'devops' },
      { name: 'Ansible', description: 'Automatización IT', id: 'SAT-DEV-003', area: 'devops' },
      { name: 'Monitoring', description: 'Observabilidad y métricas', id: 'SAT-DEV-004', area: 'devops' },
      { name: 'GitOps', description: 'Operaciones declarativas con Git', id: 'SAT-DEV-005', area: 'devops' },
      { name: 'Nginx', description: 'Servidor web y proxy', id: 'SAT-DEV-006', area: 'devops' }
    ]
  },

  // CLUSTER 9: Data Science
  datascience: {
    name: 'Data Science',
    area: 'datascience',
    position: { x: -6.5, y: 16, z: 2 },
    positionBranch: { x: 0, y: 12.5, z: 0 },
    satellites: [
      { name: 'Python', description: 'Lenguaje análisis de datos', id: 'SAT-DS-001', area: 'datascience' },
      { name: 'Pandas', description: 'Manipulación de datos', id: 'SAT-DS-002', area: 'datascience' },
      { name: 'Jupyter', description: 'Notebooks interactivos', id: 'SAT-DS-003', area: 'datascience' },
      { name: 'Data Viz', description: 'Visualización de datos', id: 'SAT-DS-004', area: 'datascience' },
      { name: 'Estadística', description: 'Análisis estadístico avanzado', id: 'SAT-DS-005', area: 'datascience' },
      { name: 'Big Data', description: 'Procesamiento datos masivos', id: 'SAT-DS-006', area: 'datascience' },
      { name: 'Spark', description: 'Motor procesamiento distribuido', id: 'SAT-DS-007', area: 'datascience' }
    ]
  },

  // CLUSTER 10: Blockchain
  blockchain: {
    name: 'Blockchain & Web3',
    area: 'blockchain',
    position: { x: -4.7, y: 16, z: -4.7 },
    positionBranch: { x: 0, y: 12.5, z: 0 },
    satellites: [
      { name: 'Solidity', description: 'Smart contracts Ethereum', id: 'SAT-BLK-001', area: 'blockchain' },
      { name: 'Web3.js', description: 'Interacción con blockchain', id: 'SAT-BLK-002', area: 'blockchain' },
      { name: 'DeFi', description: 'Finanzas descentralizadas', id: 'SAT-BLK-003', area: 'blockchain' },
      { name: 'NFTs', description: 'Tokens no fungibles', id: 'SAT-BLK-004', area: 'blockchain' },
      { name: 'Consensus', description: 'Algoritmos de consenso', id: 'SAT-BLK-005', area: 'blockchain' },
      { name: 'IPFS', description: 'Almacenamiento distribuido', id: 'SAT-BLK-006', area: 'blockchain' }
    ]
  },

  // ========== NIVEL 3: Y=15 (positionBranch), Y=18.5 (position), Z=6 ==========
  
  // CLUSTER 11: IoT
  iot: {
    name: 'Internet of Things',
    area: 'iot',
    position: { x: 0, y: 18.5, z: -6 },
    positionBranch: { x: 0, y: 15, z: 0 },
    satellites: [
      { name: 'Arduino', description: 'Microcontroladores open source', id: 'SAT-IOT-001', area: 'iot' },
      { name: 'Raspberry Pi', description: 'Computadora miniatura', id: 'SAT-IOT-002', area: 'iot' },
      { name: 'MQTT', description: 'Protocolo IoT ligero', id: 'SAT-IOT-003', area: 'iot' },
      { name: 'Sensores', description: 'Hardware de captura datos', id: 'SAT-IOT-004', area: 'iot' },
      { name: 'Edge Computing', description: 'Procesamiento en el borde', id: 'SAT-IOT-005', area: 'iot' },
      { name: 'LoRaWAN', description: 'Red área amplia baja potencia', id: 'SAT-IOT-006', area: 'iot' }
    ]
  },

  // CLUSTER 12: UX/UI Design
  design: {
    name: 'UX/UI Design',
    area: 'design',
    position: { x: 5.71, y: 18.5, z: -1.86 },
    positionBranch: { x: 0, y: 15, z: 0 },
    satellites: [
      { name: 'Figma', description: 'Diseño colaborativo UI', id: 'SAT-DES-001', area: 'design' },
      { name: 'Design Systems', description: 'Sistemas de diseño escalables', id: 'SAT-DES-002', area: 'design' },
      { name: 'Prototyping', description: 'Prototipos interactivos', id: 'SAT-DES-003', area: 'design' },
      { name: 'User Research', description: 'Investigación de usuarios', id: 'SAT-DES-004', area: 'design' },
      { name: 'Accessibility', description: 'Diseño accesible inclusivo', id: 'SAT-DES-005', area: 'design' },
      { name: 'Animation', description: 'Microinteracciones y motion', id: 'SAT-DES-006', area: 'design' }
    ]
  },

  // CLUSTER 13: Testing & QA
  testing: {
    name: 'Testing & QA',
    area: 'testing',
    position: { x: 3.53, y: 18.5, z: 4.86 },
    positionBranch: { x: 0, y: 15, z: 0 },
    satellites: [
      { name: 'Jest', description: 'Testing framework JavaScript', id: 'SAT-TST-001', area: 'testing' },
      { name: 'Selenium', description: 'Automatización tests web', id: 'SAT-TST-002', area: 'testing' },
      { name: 'Unit Testing', description: 'Pruebas unitarias', id: 'SAT-TST-003', area: 'testing' },
      { name: 'E2E Testing', description: 'Pruebas end-to-end', id: 'SAT-TST-004', area: 'testing' },
      { name: 'TDD', description: 'Desarrollo guiado por tests', id: 'SAT-TST-005', area: 'testing' },
      { name: 'Performance', description: 'Testing de rendimiento', id: 'SAT-TST-006', area: 'testing' }
    ]
  },

  // CLUSTER 14: Arquitectura de Software
  architecture: {
    name: 'Arquitectura de Software',
    area: 'architecture',
    position: { x: -3.53, y: 18.5, z: 4.86 },
    positionBranch: { x: 0, y: 15, z: 0 },
    satellites: [
      { name: 'Microservicios', description: 'Arquitectura distribuida modular', id: 'SAT-ARCH-001', area: 'architecture' },
      { name: 'Design Patterns', description: 'Patrones de diseño clásicos', id: 'SAT-ARCH-002', area: 'architecture' },
      { name: 'DDD', description: 'Domain-Driven Design', id: 'SAT-ARCH-003', area: 'architecture' },
      { name: 'Clean Code', description: 'Principios código limpio', id: 'SAT-ARCH-004', area: 'architecture' },
      { name: 'SOLID', description: 'Principios orientación objetos', id: 'SAT-ARCH-005', area: 'architecture' },
      { name: 'Event-Driven', description: 'Arquitectura basada en eventos', id: 'SAT-ARCH-006', area: 'architecture' },
      { name: 'Hexagonal', description: 'Arquitectura de puertos y adaptadores', id: 'SAT-ARCH-007', area: 'architecture' }
    ]
  },

  // CLUSTER 15: Backend Development
  backend: {
    name: 'Backend Development',
    area: 'backend',
    position: { x: -5.71, y: 18.5, z: -1.86 },
    positionBranch: { x: 0, y: 15, z: 0 },
    satellites: [
      { name: 'Java', description: 'Lenguaje enterprise robusto', id: 'SAT-BACK-001', area: 'backend' },
      { name: 'Python', description: 'Lenguaje versátil y poderoso', id: 'SAT-BACK-002', area: 'backend' },
      { name: 'Go', description: 'Lenguaje concurrente eficiente', id: 'SAT-BACK-003', area: 'backend' },
      { name: 'Spring Boot', description: 'Framework Java empresarial', id: 'SAT-BACK-004', area: 'backend' },
      { name: 'Django', description: 'Framework Python fullstack', id: 'SAT-BACK-005', area: 'backend' },
      { name: 'FastAPI', description: 'APIs Python modernas y rápidas', id: 'SAT-BACK-006', area: 'backend' },
      { name: 'Express', description: 'Framework Node.js minimalista', id: 'SAT-BACK-007', area: 'backend' }
    ]
  },

  // ========== NIVEL 4: Y=17.5 (positionBranch), Y=21 (position), Z=5.5 ==========
  
  // CLUSTER 16: Sistemas Operativos
  os: {
    name: 'Sistemas Operativos',
    area: 'os',
    position: { x: 3.9, y: 21, z: -3.9 },
    positionBranch: { x: 0, y: 17.5, z: 0 },
    satellites: [
      { name: 'Linux', description: 'Sistema operativo open source', id: 'SAT-OS-001', area: 'os' },
      { name: 'Bash/Shell', description: 'Scripting y automatización', id: 'SAT-OS-002', area: 'os' },
      { name: 'Procesos', description: 'Gestión de procesos y threads', id: 'SAT-OS-003', area: 'os' },
      { name: 'Memoria', description: 'Gestión de memoria virtual', id: 'SAT-OS-004', area: 'os' },
      { name: 'File Systems', description: 'Sistemas de archivos', id: 'SAT-OS-005', area: 'os' },
      { name: 'Scheduling', description: 'Algoritmos de planificación', id: 'SAT-OS-006', area: 'os' }
    ]
  },

  // CLUSTER 17: Performance & Optimization
  performance: {
    name: 'Performance & Optimization',
    area: 'performance',
    position: { x: 5.5, y: 21, z: 1.7 },
    positionBranch: { x: 0, y: 17.5, z: 0 },
    satellites: [
      { name: 'Caching', description: 'Estrategias de caché', id: 'SAT-PERF-001', area: 'performance' },
      { name: 'Load Balancing', description: 'Balanceo de carga', id: 'SAT-PERF-002', area: 'performance' },
      { name: 'CDN', description: 'Content Delivery Networks', id: 'SAT-PERF-003', area: 'performance' },
      { name: 'Compression', description: 'Compresión de datos', id: 'SAT-PERF-004', area: 'performance' },
      { name: 'Profiling', description: 'Análisis de rendimiento', id: 'SAT-PERF-005', area: 'performance' },
      { name: 'Lazy Loading', description: 'Carga diferida de recursos', id: 'SAT-PERF-006', area: 'performance' },
      { name: 'Indexing', description: 'Optimización de índices', id: 'SAT-PERF-007', area: 'performance' }
    ]
  },

  // CLUSTER 18: APIs & Integraciones
  apis: {
    name: 'APIs & Integraciones',
    area: 'apis',
    position: { x: 0, y: 21, z: 5.5 },
    positionBranch: { x: 0, y: 17.5, z: 0 },
    satellites: [
      { name: 'REST', description: 'APIs RESTful estándar', id: 'SAT-API-001', area: 'apis' },
      { name: 'GraphQL', description: 'Query language flexible', id: 'SAT-API-002', area: 'apis' },
      { name: 'gRPC', description: 'RPC de alto rendimiento', id: 'SAT-API-003', area: 'apis' },
      { name: 'WebSockets', description: 'Comunicación bidireccional', id: 'SAT-API-004', area: 'apis' },
      { name: 'OAuth', description: 'Autenticación y autorización', id: 'SAT-API-005', area: 'apis' },
      { name: 'Webhooks', description: 'Callbacks HTTP automatizados', id: 'SAT-API-006', area: 'apis' },
      { name: 'API Gateway', description: 'Gateway de microservicios', id: 'SAT-API-007', area: 'apis' }
    ]
  },

  // CLUSTER 19: Computación Cuántica
  quantum: {
    name: 'Computación Cuántica',
    area: 'quantum',
    position: { x: -5.5, y: 21, z: 1.7 },
    positionBranch: { x: 0, y: 17.5, z: 0 },
    satellites: [
      { name: 'Qubits', description: 'Bits cuánticos fundamentales', id: 'SAT-QUAN-001', area: 'quantum' },
      { name: 'Superposición', description: 'Estados cuánticos superpuestos', id: 'SAT-QUAN-002', area: 'quantum' },
      { name: 'Entrelazamiento', description: 'Correlación cuántica', id: 'SAT-QUAN-003', area: 'quantum' },
      { name: 'Qiskit', description: 'Framework IBM para quantum', id: 'SAT-QUAN-004', area: 'quantum' },
      { name: 'Algoritmos Q', description: 'Algoritmos cuánticos', id: 'SAT-QUAN-005', area: 'quantum' },
      { name: 'Criptografía Q', description: 'Seguridad cuántica', id: 'SAT-QUAN-006', area: 'quantum' }
    ]
  },

  // CLUSTER 20: Robótica
  robotics: {
    name: 'Robótica',
    area: 'robotics',
    position: { x: -3.9, y: 21, z: -3.9 },
    positionBranch: { x: 0, y: 17.5, z: 0 },
    satellites: [
      { name: 'ROS', description: 'Robot Operating System', id: 'SAT-ROB-001', area: 'robotics' },
      { name: 'Cinemática', description: 'Movimiento y control', id: 'SAT-ROB-002', area: 'robotics' },
      { name: 'SLAM', description: 'Localización y mapeo simultáneo', id: 'SAT-ROB-003', area: 'robotics' },
      { name: 'Control', description: 'Sistemas de control robótico', id: 'SAT-ROB-004', area: 'robotics' },
      { name: 'Actuadores', description: 'Motores y servos', id: 'SAT-ROB-005', area: 'robotics' },
      { name: 'Path Planning', description: 'Planificación de rutas', id: 'SAT-ROB-006', area: 'robotics' }
    ]
  },

  // ========== NIVEL 5: Y=20 (positionBranch), Y=23.5 (position), Z=5 ==========
  
  // CLUSTER 21: AR/VR
  /* arvr: {
    name: 'Realidad Aumentada/Virtual',
    area: 'arvr',
    position: { x: 0, y: 23.5, z: -5 },
    positionBranch: { x: 0, y: 20, z: 0 },
    satellites: [
      { name: 'Unity XR', description: 'Desarrollo XR en Unity', id: 'SAT-XR-001', area: 'arvr' },
      { name: 'WebXR', description: 'XR en navegadores web', id: 'SAT-XR-002', area: 'arvr' },
      { name: 'ARKit', description: 'AR para iOS', id: 'SAT-XR-003', area: 'arvr' },
      { name: 'ARCore', description: 'AR para Android', id: 'SAT-XR-004', area: 'arvr' },
      { name: 'Spatial Audio', description: 'Audio espacial 3D', id: 'SAT-XR-005', area: 'arvr' },
      { name: 'Hand Tracking', description: 'Seguimiento de manos', id: 'SAT-XR-006', area: 'arvr' },
      { name: 'Occlusion', description: 'Oclusión realista', id: 'SAT-XR-007', area: 'arvr' }
    ]
  } */
};


// ============================================
// FUNCIONES HELPER (actualizadas)
// ============================================

/**
 * Obtener todas las materias en un array plano
 */
export function getAllSubjects() {
  const all = [...ROOTS, ...TRUNK];

  // Agregar satélites de clusters
  Object.values(BRANCHES).forEach(cluster => {
    all.push(...cluster.satellites);
  });

  return all;
}

/**
 * Obtener materia por ID
 */
export function getSubjectById(id) {
  return getAllSubjects().find(subject => subject.id === id);
}

/**
 * Obtener materias por área
 */
export function getSubjectsByArea(area) {
  return getAllSubjects().filter(subject => subject.area === area);
}

/**
 * Obtener cluster por área
 */
export function getClusterByArea(area) {
  return BRANCHES[area] || null;
}

/**
 * Obtener todos los clusters
 */
export function getAllClusters() {
  return Object.values(BRANCHES);
}

/**
 * Obtener estadísticas
 */
export function getCareerStats() {
  const allSubjects = getAllSubjects();

  return {
    totalSubjects: allSubjects.length,
    totalClusters: Object.keys(BRANCHES).length,
    totalSatellites: Object.values(BRANCHES).reduce(
      (sum, cluster) => sum + cluster.satellites.length,
      0
    ),
    byArea: Object.keys(KNOWLEDGE_AREAS).reduce((acc, area) => {
      acc[area] = getSubjectsByArea(area).length;
      return acc;
    }, {})
  };
}

export default {
  CAREER_INFO,
  KNOWLEDGE_AREAS,
  ROOTS,
  TRUNK,
  BRANCHES,
  getAllSubjects,
  getSubjectById,
  getSubjectsByArea,
  getClusterByArea,
  getAllClusters,
  getCareerStats
};