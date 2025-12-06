/**
 * SUBJECTS.JS - Base de Datos de Materias UMSA
 * ============================================
 * 
 * PROPÓSITO:
 * - Almacenar información real de la carrera de Informática UMSA
 * - Estructura jerárquica (raíces → tronco → ramas)
 * - Cada materia tiene código, descripción, requisitos, etc.
 * 
 * ESTRUCTURA DE DATOS:
 * {
 *   id: "INF-XXX",           // Código único de materia
 *   name: "Nombre",          // Nombre de la materia
 *   area: "fundamentos",     // Área del conocimiento
 *   semester: 1,             // Semestre recomendado
 *   credits: 4,              // Créditos académicos
 *   hours: 6,                // Horas por semana
 *   prerequisites: [],       // Materias que se necesitan antes
 *   description: "...",      // Descripción corta
 *   topics: []               // Temas que se ven
 * }
 */

// ============================================
// METADATA DE LA CARRERA
// ============================================
export const CAREER_INFO = {
  name: "Carrera de Informática",
  university: "Universidad Mayor de San Andrés",
  faculty: "Facultad de Ciencias Puras y Naturales",
  location: "La Paz, Bolivia",
  duration: "10 semestres (5 años)",
  totalSubjects: 35,
  totalCredits: 240,
  degree: "Licenciado/a en Informática",
  
  // Áreas de especialización disponibles
  specializations: [
    "Desarrollo de Software",
    "Inteligencia Artificial",
    "Redes y Seguridad",
    "Ciencia de Datos",
    "Sistemas Embebidos"
  ],
  
  // Perfil del egresado
  profile: [
    "Desarrollador de aplicaciones web y móviles",
    "Especialista en inteligencia artificial y machine learning",
    "Administrador de redes y seguridad informática",
    "Científico de datos y analista",
    "Arquitecto de software"
  ]
};

// ============================================
// DEFINICIÓN DE ÁREAS DEL CONOCIMIENTO
// ============================================
export const KNOWLEDGE_AREAS = {
  fundamentos: {
    name: "Fundamentos",
    color: "cyan",
    description: "Bases matemáticas, lógicas y de programación que sostienen toda la carrera",
    icon: "📚"
  },
  web: {
    name: "Desarrollo Web/Móvil",
    color: "blue",
    description: "Creación de aplicaciones web, móviles y APIs modernas",
    icon: "🌐"
  },
  ia: {
    name: "Inteligencia Artificial",
    color: "purple",
    description: "Machine Learning, Deep Learning y sistemas inteligentes",
    icon: "🤖"
  },
  redes: {
    name: "Redes y Seguridad",
    color: "green",
    description: "Infraestructura de red, ciberseguridad y cloud computing",
    icon: "🔒"
  },
  sistemas: {
    name: "Sistemas y Hardware",
    color: "red",
    description: "Arquitectura de computadoras, sistemas operativos y embebidos",
    icon: "⚙️"
  },
  datos: {
    name: "Bases de Datos",
    color: "orange",
    description: "Modelado, administración y análisis de datos",
    icon: "💾"
  },
  gamedev: {
    name: "Game Dev & XR",
    color: "pink",
    description: "Desarrollo de videojuegos, realidad virtual y aumentada",
    icon: "🎮"
  }
};

// ============================================
// MATERIAS DE LA CARRERA
// ============================================

/**
 * RAÍCES - Fundamentos (Semestres 1-2)
 * Materias base que todo estudiante debe dominar
 */
export const ROOTS = [
  {
    id: "INF-111",
    name: "Matemática Discreta",
    area: "fundamentos",
    semester: 1,
    credits: 4,
    hours: 6,
    prerequisites: [],
    description: "Base matemática para la computación. Teoría de conjuntos, lógica proposicional, grafos y combinatoria.",
    topics: [
      "Lógica proposicional y predicados",
      "Teoría de conjuntos",
      "Relaciones y funciones",
      "Grafos y árboles",
      "Combinatoria y probabilidad"
    ],
    professor: "Ing. María López"
  },
  {
    id: "INF-110",
    name: "Programación I",
    area: "fundamentos",
    semester: 1,
    credits: 4,
    hours: 8,
    prerequisites: [],
    description: "Introducción a la programación. Algoritmos básicos, estructuras de control y tipos de datos fundamentales.",
    topics: [
      "Conceptos de algoritmos",
      "Variables y tipos de datos",
      "Estructuras de control (if, while, for)",
      "Funciones y procedimientos",
      "Arreglos básicos"
    ],
    professor: "Ing. Carlos Mendoza"
  },
  {
    id: "INF-112",
    name: "Lógica Matemática",
    area: "fundamentos",
    semester: 2,
    credits: 3,
    hours: 4,
    prerequisites: ["INF-111"],
    description: "Fundamentos lógicos de la computación. Proposiciones, predicados y métodos de demostración.",
    topics: [
      "Cálculo proposicional",
      "Cálculo de predicados",
      "Métodos de demostración",
      "Lógica de primer orden",
      "Inducción matemática"
    ],
    professor: "Dr. Roberto Paz"
  }
];

/**
 * TRONCO - Núcleo Obligatorio (Semestres 3-5)
 * Materias centrales que todos deben cursar
 */
export const TRUNK = [
  {
    id: "INF-210",
    name: "Estructuras de Datos",
    area: "fundamentos",
    semester: 3,
    credits: 4,
    hours: 8,
    prerequisites: ["INF-110"],
    description: "Estructuras de datos fundamentales: listas, pilas, colas, árboles, grafos y tablas hash.",
    topics: [
      "Listas enlazadas",
      "Pilas y colas",
      "Árboles binarios y AVL",
      "Grafos y recorridos",
      "Tablas hash"
    ],
    professor: "Ing. Ana Torres"
  },
  {
    id: "INF-220",
    name: "Bases de Datos I",
    area: "datos",
    semester: 3,
    credits: 4,
    hours: 6,
    prerequisites: ["INF-110"],
    description: "Fundamentos de bases de datos relacionales. Modelo ER, SQL y normalización.",
    topics: [
      "Modelo Entidad-Relación",
      "Álgebra relacional",
      "SQL avanzado",
      "Normalización (1NF-3NF)",
      "Transacciones y ACID"
    ],
    professor: "Ing. Pedro Vargas"
  },
  {
    id: "INF-310",
    name: "Sistemas Operativos",
    area: "sistemas",
    semester: 4,
    credits: 4,
    hours: 6,
    prerequisites: ["INF-210"],
    description: "Conceptos de sistemas operativos: procesos, memoria, archivos y concurrencia.",
    topics: [
      "Gestión de procesos",
      "Gestión de memoria",
      "Sistemas de archivos",
      "Concurrencia y sincronización",
      "Planificación de CPU"
    ],
    professor: "Dr. Luis Mamani"
  },
  {
    id: "INF-320",
    name: "Redes de Computadoras",
    area: "redes",
    semester: 4,
    credits: 4,
    hours: 6,
    prerequisites: ["INF-110"],
    description: "Fundamentos de redes. Modelo OSI, TCP/IP y protocolos de red.",
    topics: [
      "Modelo OSI y TCP/IP",
      "Direccionamiento IP",
      "Routing y switching",
      "Protocolos (HTTP, DNS, FTP)",
      "Seguridad en redes"
    ],
    professor: "Ing. Carmen Quispe"
  },
  {
    id: "INF-330",
    name: "Ingeniería de Software I",
    area: "fundamentos",
    semester: 5,
    credits: 4,
    hours: 6,
    prerequisites: ["INF-210"],
    description: "Metodologías de desarrollo de software. Análisis, diseño y gestión de proyectos.",
    topics: [
      "Ciclo de vida del software",
      "Metodologías ágiles (Scrum)",
      "UML y diagramas",
      "Patrones de diseño",
      "Gestión de proyectos"
    ],
    professor: "Ing. Jorge Huanca"
  }
];

/**
 * RAMAS - Especialidades (Semestres 5-9)
 * Materias de áreas específicas que el estudiante puede elegir
 */
export const BRANCHES = {
  // Rama de Desarrollo Web/Móvil
  web: [
    {
      id: "INF-410",
      name: "Desarrollo Web",
      area: "web",
      semester: 5,
      credits: 4,
      hours: 8,
      prerequisites: ["INF-220"],
      description: "Desarrollo de aplicaciones web modernas con HTML, CSS, JavaScript y frameworks.",
      topics: [
        "HTML5 y CSS3 avanzado",
        "JavaScript ES6+",
        "React o Vue.js",
        "Responsive design",
        "API REST"
      ],
      professor: "Ing. Sandra Flores"
    },
    {
      id: "INF-411",
      name: "Backend Avanzado",
      area: "web",
      semester: 6,
      credits: 4,
      hours: 6,
      prerequisites: ["INF-410"],
      description: "Desarrollo de APIs REST, autenticación, autorización y despliegue en cloud.",
      topics: [
        "Node.js y Express",
        "Autenticación JWT",
        "WebSockets",
        "Docker y contenedores",
        "Despliegue en AWS/Azure"
      ],
      professor: "Ing. Diego Rojas"
    },
    {
      id: "INF-412",
      name: "Desarrollo Móvil",
      area: "web",
      semester: 7,
      credits: 3,
      hours: 6,
      prerequisites: ["INF-410"],
      description: "Desarrollo de aplicaciones móviles con Flutter o React Native.",
      topics: [
        "Flutter/React Native",
        "UI/UX móvil",
        "Almacenamiento local",
        "Push notifications",
        "Publicación en stores"
      ],
      professor: "Ing. Lucía Poma"
    }
  ],

  // Rama de Inteligencia Artificial
  ia: [
    {
      id: "INF-510",
      name: "Inteligencia Artificial",
      area: "ia",
      semester: 6,
      credits: 4,
      hours: 6,
      prerequisites: ["INF-210", "INF-111"],
      description: "Fundamentos de IA: búsqueda, algoritmos genéticos y sistemas expertos.",
      topics: [
        "Búsqueda en espacios de estados",
        "Algoritmos genéticos",
        "Sistemas expertos",
        "Lógica difusa",
        "Agentes inteligentes"
      ],
      professor: "Dr. Pablo Condori"
    },
    {
      id: "INF-511",
      name: "Machine Learning",
      area: "ia",
      semester: 7,
      credits: 4,
      hours: 6,
      prerequisites: ["INF-510"],
      description: "Aprendizaje automático: regresión, clasificación, clustering y árboles de decisión.",
      topics: [
        "Regresión lineal y logística",
        "Árboles de decisión",
        "SVM y KNN",
        "K-means clustering",
        "Evaluación de modelos"
      ],
      professor: "Dr. Fernando Choque"
    },
    {
      id: "INF-512",
      name: "Deep Learning",
      area: "ia",
      semester: 8,
      credits: 4,
      hours: 6,
      prerequisites: ["INF-511"],
      description: "Redes neuronales profundas: CNN, RNN, transformers y aplicaciones modernas.",
      topics: [
        "Redes neuronales densas",
        "CNN para visión computacional",
        "RNN y LSTM",
        "Transformers y atención",
        "Transfer learning"
      ],
      professor: "Dr. Ricardo Nina"
    }
  ],

  // Rama de Redes y Seguridad
  redes: [
    {
      id: "INF-610",
      name: "Administración de Redes",
      area: "redes",
      semester: 5,
      credits: 4,
      hours: 6,
      prerequisites: ["INF-320"],
      description: "Configuración y administración de infraestructura de red empresarial.",
      topics: [
        "Configuración de routers Cisco",
        "VLANs y subnetting",
        "Routing avanzado (OSPF, BGP)",
        "QoS y gestión de tráfico",
        "Monitoreo de red"
      ],
      professor: "Ing. Víctor Apaza"
    },
    {
      id: "INF-611",
      name: "Seguridad Informática",
      area: "redes",
      semester: 6,
      credits: 4,
      hours: 6,
      prerequisites: ["INF-320"],
      description: "Ciberseguridad: criptografía, ethical hacking y seguridad de sistemas.",
      topics: [
        "Criptografía simétrica y asimétrica",
        "Ethical hacking",
        "Pentesting",
        "Firewalls e IDS/IPS",
        "Análisis de vulnerabilidades"
      ],
      professor: "Ing. Mónica Callisaya"
    },
    {
      id: "INF-612",
      name: "Cloud Computing",
      area: "redes",
      semester: 7,
      credits: 3,
      hours: 4,
      prerequisites: ["INF-610"],
      description: "Computación en la nube: AWS, Azure, contenedores y orquestación.",
      topics: [
        "Servicios de AWS/Azure",
        "Docker y contenedores",
        "Kubernetes",
        "Serverless computing",
        "DevOps y CI/CD"
      ],
      professor: "Ing. Alberto Pari"
    }
  ],

  // Rama de Sistemas y Hardware
  sistemas: [
    {
      id: "INF-710",
      name: "Arquitectura de Computadoras",
      area: "sistemas",
      semester: 5,
      credits: 4,
      hours: 6,
      prerequisites: ["INF-310"],
      description: "Diseño de CPUs, memoria, pipeline y arquitecturas modernas.",
      topics: [
        "Arquitectura von Neumann",
        "Pipeline y paralelismo",
        "Jerarquía de memoria",
        "Cache y memoria virtual",
        "Arquitecturas RISC vs CISC"
      ],
      professor: "Dr. Jaime Ticona"
    },
    {
      id: "INF-711",
      name: "Sistemas Embebidos",
      area: "sistemas",
      semester: 7,
      credits: 3,
      hours: 6,
      prerequisites: ["INF-710"],
      description: "Programación de microcontroladores y desarrollo de sistemas IoT.",
      topics: [
        "Arduino y microcontroladores",
        "Raspberry Pi",
        "Sensores y actuadores",
        "Comunicación serial",
        "Proyectos IoT"
      ],
      professor: "Ing. Raúl Colque"
    }
  ],

  // Rama de Bases de Datos Avanzadas
  datos: [
    {
      id: "INF-810",
      name: "Bases de Datos Avanzadas",
      area: "datos",
      semester: 6,
      credits: 3,
      hours: 4,
      prerequisites: ["INF-220"],
      description: "NoSQL, Big Data, data warehousing y optimización de consultas.",
      topics: [
        "Bases de datos NoSQL (MongoDB)",
        "Data warehousing",
        "Big Data con Hadoop",
        "Optimización de queries",
        "Bases de datos distribuidas"
      ],
      professor: "Ing. Elena Mamani"
    }
  ]
};

// ============================================
// FUNCIONES HELPER
// ============================================

/**
 * Obtener todas las materias en un array plano
 * @returns {Array} Array con todas las materias
 */
export function getAllSubjects() {
  const all = [...ROOTS, ...TRUNK];
  
  // Agregar todas las ramas
  Object.values(BRANCHES).forEach(branch => {
    all.push(...branch);
  });
  
  return all;
}

/**
 * Obtener materia por ID
 * @param {string} id - Código de la materia (ej: "INF-111")
 * @returns {Object|null} Objeto de materia o null
 */
export function getSubjectById(id) {
  return getAllSubjects().find(subject => subject.id === id);
}

/**
 * Obtener materias por área
 * @param {string} area - Nombre del área
 * @returns {Array} Array de materias del área
 */
export function getSubjectsByArea(area) {
  return getAllSubjects().filter(subject => subject.area === area);
}

/**
 * Obtener materias por semestre
 * @param {number} semester - Número de semestre
 * @returns {Array} Array de materias del semestre
 */
export function getSubjectsBySemester(semester) {
  return getAllSubjects().filter(subject => subject.semester === semester);
}

/**
 * Verificar si una materia tiene todos los prerequisitos
 * @param {string} subjectId - ID de la materia
 * @param {Array} completedIds - IDs de materias completadas
 * @returns {boolean} true si puede cursarla
 */
export function canTakeSubject(subjectId, completedIds = []) {
  const subject = getSubjectById(subjectId);
  if (!subject) return false;
  
  return subject.prerequisites.every(prereq => 
    completedIds.includes(prereq)
  );
}

/**
 * Obtener estadísticas de la carrera
 * @returns {Object} Estadísticas
 */
export function getCareerStats() {
  const allSubjects = getAllSubjects();
  
  return {
    totalSubjects: allSubjects.length,
    totalCredits: allSubjects.reduce((sum, s) => sum + s.credits, 0),
    totalHours: allSubjects.reduce((sum, s) => sum + s.hours, 0),
    byArea: Object.keys(KNOWLEDGE_AREAS).reduce((acc, area) => {
      acc[area] = getSubjectsByArea(area).length;
      return acc;
    }, {})
  };
}

// ============================================
// EXPORT DEFAULT
// ============================================
export default {
  CAREER_INFO,
  KNOWLEDGE_AREAS,
  ROOTS,
  TRUNK,
  BRANCHES,
  getAllSubjects,
  getSubjectById,
  getSubjectsByArea,
  getSubjectsBySemester,
  canTakeSubject,
  getCareerStats
};