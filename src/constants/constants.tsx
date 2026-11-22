import type { Project, TimelineItem, Certification } from "../types/types";

export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "AgriTrend-DSS",
    description:
      "Sistem Pendukung Keputusan berbasis Machine Learning dan Generative AI untuk petani lokal.",
    longDescription:
      "Agri-Trend DSS: Sistem Pendukung Keputusan berbasis Machine Learning dan Generative AI untuk prediksi hasil panen dan wawasan pasar petani lokal. Proyek ini merupakan Capstone Project di mana saya bertindak sebagai Backend & DevOps Lead.",
    tags: [
      "Python",
      "FastAPI",
      "Generative AI",
      "React",
      "Machine Learning",
      "Jupyter Notebook",
    ],
    image: "/images/pjk_agritrend-dss.webp",
    featured: true,
    category: "Pijak x IBM SkillsBuild 2026",
    github: "https://github.com/sobahusn/AgriTrend-DSS",
    date: "Feb 2026 - Jul 2026",
  },
  {
    id: "2",
    title: "Workflow-CI",
    description:
      "Automated Continuous Integration workflows for MLOps and Machine Learning pipelines.",
    longDescription:
      "Proyek berfokus pada implementasi CI (Continuous Integration) dan MLOps menggunakan MLflow. Otomatisasi eksperimen model dan pipeline deployment untuk menjamin skalabilitas model Machine Learning.",
    tags: ["CI", "MLOps", "MLflow", "Python"],
    image:
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=1000",
    featured: false,
    category: "DevOps",
    github: "https://github.com/sobahusn/Workflow-CI",
  },
  {
    id: "3",
    title: "Eksperimen SML",
    description:
      "Kumpulan eksperimen Supervised Machine Learning dan implementasi MLOps.",
    longDescription:
      "Repositori yang berisi berbagai eksplorasi algoritma Machine Learning terawasi (Supervised) dan integrasinya ke dalam praktik-praktik MLOps menggunakan Jupyter Notebook.",
    tags: ["Machine Learning", "MLOps", "Jupyter Notebook"],
    image:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000",
    featured: false,
    category: "AI Engineer",
    github: "https://github.com/sobahusn/Eksperimen_SML_Sobahusn",
  },
  {
    id: "4",
    title: "Plants Classification",
    description:
      "Proyek Deep Learning untuk mengklasifikasikan jenis tanaman berdasarkan citra/gambar.",
    longDescription:
      "Model Deep Learning menggunakan Jaringan Saraf Tiruan untuk melakukan klasifikasi gambar tanaman secara akurat. Dikembangkan sepenuhnya menggunakan lingkungan Jupyter Notebook.",
    tags: ["Deep Learning", "Image Classification", "Jupyter Notebook"],
    image:
      "https://images.unsplash.com/photo-1530836369250-ef71a3a5e4b1?auto=format&fit=crop&q=80&w=1000",
    featured: false,
    category: "AI Engineer",
    github: "https://github.com/sobahusn/plants-classification",
  },
  {
    id: "5",
    title: "Daily Finance Tracker",
    description:
      "Aplikasi berbasis Python untuk melacak pengeluaran dan pemasukan keuangan harian.",
    longDescription:
      "Proyek aplikasi pencatat keuangan harian yang dibangun menggunakan Python. Sangat berguna untuk tracking cashflow dan manajemen budget harian dengan mudah.",
    tags: ["Python", "CLI", "Finance"],
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1000",
    featured: false,
    category: "Archive",
    github: "https://github.com/sobahus/daily-finance-tracker_py",
  },
  {
    id: "6",
    title: "Story Map App",
    description: "Aplikasi pemetaan interaktif berbasis JavaScript.",
    longDescription:
      "Web app interaktif yang memungkinkan pengguna untuk memetakan lokasi dengan cerita. Dibangun menggunakan Vanilla JavaScript untuk interaksi yang mulus.",
    tags: ["JavaScript", "Web App", "Mapping"],
    image:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000",
    featured: false,
    category: "Archive",
    github: "https://github.com/sobahus/Story-Map-App",
  },
  {
    id: "7",
    title: "FlorAI",
    description: "Kenali dan ketahui berbagai bunga Nusantara dengan mudah.",
    longDescription:
      "FlorAI adalah aplikasi berbasis AI yang memungkinkan pengguna untuk mengidentifikasi berbagai jenis bunga Nusantara hanya dengan mengunggah gambar. Aplikasi ini memanfaatkan model Machine Learning untuk memberikan informasi detail tentang bunga tersebut.",
    tags: ["React", "Machine Learning", "Express"],
    image: "/images/cc_florai.webp",
    featured: true,
    category: "Coding Camp 2025",
    github: "https://github.com/sobahusn/Flower-Classification-Website",
    special: "Top 15 Best Capstone Project",
  },
];

export const TIMELINE: TimelineItem[] = [
  {
    id: "exp1",
    type: "experience",
    title: "Network Technician",
    organization: "PT. Ulinkcom Teknologi Indonesia",
    location: "Sidoarjo",
    date: "Feb 2026 - Feb 2026",
    description:
      "Served as a Network Technician handling local networking infrastructure and operational maintenance.",
  },
  {
    id: "exp2",
    type: "experience",
    title: "Processing",
    organization: "J&T Express",
    location: "Ngemplak, Tulangan, Sidoarjo",
    date: "Mei 2025 - Jul 2025",
    description:
      "Receive incoming goods into the warehouse, perform loading and unloading, separate goods based on destination, scan barcodes for tracking, and maintain warehouse cleanliness.",
  },
  {
    id: "exp3",
    type: "experience",
    title: "Toolman / Teacher Assistant",
    organization: "SMK WALISONGO 2 GEMPOL",
    location: "Gempol, East Java",
    date: "Jul 2022 - Mei 2025",
    description:
      "Assisted teachers in preparing laboratory equipment for practical classes, provided troubleshooting and maintenance support for school computer networks and hardware.",
  },
  {
    id: "exp4",
    type: "experience",
    title: "Network Technician / FTTH",
    organization: "PT. AUREA CYBER TELEMATIKA",
    location: "Sidoarjo, East Java",
    date: "Jul 2024 - Sep 2024",
    description:
      "Installed fiber optic internet networks at client locations, handled troubleshooting such as splicing disconnected cables, and performed daily server checks.",
  },
  {
    id: "exp5",
    type: "experience",
    title: "Computer Technician",
    organization: "Intermedia Komputer",
    location: "Sidoarjo, East Java",
    date: "Jul 2023 - Jan 2024",
    description:
      "Performed computer maintenance and replaced components such as RAM and Motherboards. Installed and configured Windows Operating Systems.",
  },
  {
    id: "edu1",
    type: "education",
    title: "Bachelor's Degree, Informatics",
    organization: "Universitas Muhammadiyah Sidoarjo (UMSIDA)",
    location: "Sidoarjo, Indonesia",
    date: "Sep 2025 - Present",
    description:
      "Undergraduate Informatics Student focusing on AI, Web Development, and Cyber Security.",
  },
  {
    id: "edu2",
    type: "education",
    title: "Computer Network Engineering",
    organization: "SMK WALISONGO 2 GEMPOL",
    location: "Gempol, East Java",
    date: "Jun 2022 - Jun 2025",
    description:
      "Vocational school graduate majoring in Computer and Network Engineering.",
  },
  {
    id: "boot1",
    type: "bootcamp",
    title: "AI Engineer Cohort",
    organization: "Pijak in collaboration with IBM SkillsBuild",
    location: "Remote",
    date: "Feb 2026 - Jul 2026",
    description:
      "Selected as an intensive participant for a 6-month AI Engineering program. Served as Backend & DevOps Lead for AgriTrend-DSS Capstone project, designing a robust REST-API using FastAPI (Python).",
  },
  {
    id: "boot2",
    type: "bootcamp",
    title: "Front-End and Back-End Developer Cohort",
    organization: "Coding Camp powered by DBS Foundation",
    location: "Remote",
    date: "Jan 2025 - Apr 2025",
    description:
      "Completed over 800 hours of intensive curriculum. Developed an end-to-end full-stack web application integrating front-end components, back-end systems, and machine learning models.",
  },
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: "c1",
    title: "Membangun Sistem Machine Learning",
    issuer: "Dicoding Indonesia",
    issueDate: "2026",
    description:
      "Comprehensive course focused on designing, deploying, and managing scalable Machine Learning systems and MLOps workflows.",
    skills: ["MLOps", "Python (Programming Language)"],
    link: "https://www.dicoding.com/certificates/JLX1VJKONZ72",
  },
  {
    id: "c2",
    title: "Belajar Fundamental Deep Learning",
    issuer: "Dicoding Indonesia",
    issueDate: "2026",
    description:
      "Core concepts of Deep Learning, covering neural network architectures, model training, and optimization techniques.",
    skills: ["Python (Programming Language)", "Deep Learning"],
    link: "https://www.dicoding.com/certificates/98XW0E789XM3",
  },
  {
    id: "c3",
    title: "Belajar Machine Learning untuk Pemula",
    issuer: "Dicoding Indonesia",
    issueDate: "2026",
    description:
      "Introductory guide to Machine Learning, covering data preprocessing, supervised and unsupervised learning algorithms.",
    skills: ["Python (Programming Language)", "Machine Learning"],
    link: "https://www.dicoding.com/certificates/L4PQ98942PO1",
  },
  {
    id: "c4",
    title: "Memulai Pemrograman dengan Python",
    issuer: "Dicoding Indonesia",
    issueDate: "2026",
    description:
      "Fundamental concepts of Python programming language, including data structures, logic flow, and basic algorithms.",
    skills: ["Python (Programming Language)"],
    link: "https://www.dicoding.com/certificates/N9ZO2G4YRPG5",
  },
  {
    id: "c5",
    title: "Belajar Dasar Git dengan GitHub",
    issuer: "Dicoding Indonesia",
    issueDate: "2026",
    description:
      "Version control fundamentals using Git and collaborative development workflows with GitHub.",
    skills: ["Git", "GitHub", "Version Control"],
    link: "https://www.dicoding.com/certificates/53XEK29OVXRN",
  },
  {
    id: "c6",
    title: "Pengenalan ke Logika Pemrograman (Programming Logic 101)",
    issuer: "Dicoding Indonesia",
    issueDate: "2026",
    description:
      "Essential logic, problem-solving techniques, and foundational principles behind software engineering.",
    skills: ["Programming Logic", "Problem Solving", "Algorithms"],
    link: "https://www.dicoding.com/certificates/72ZDK1REVPYW",
  },
  {
    id: "c7",
    title: "Memulai Dasar Pemrograman untuk Menjadi Pengembang Software",
    issuer: "Dicoding Indonesia",
    issueDate: "2026",
    description:
      "Basic introduction to software development concepts, methodologies, and technical mindsets.",
    skills: ["Software Engineering", "Computer Science Foundations"],
    link: "https://www.dicoding.com/certificates/72ZDK1DJLPYW",
  },
  {
    id: "c8",
    title: "Belajar Dasar AI",
    issuer: "Dicoding Indonesia",
    issueDate: "2026",
    description:
      "Foundational course on Artificial Intelligence concepts, applications, and ethical considerations.",
    skills: ["Artificial Intelligence (AI)"],
    link: "https://www.dicoding.com/certificates/L4PQ2DW22ZO1",
  },
  {
    id: "c9",
    title: "Belajar Dasar Visualisasi Data",
    issuer: "Dicoding Indonesia",
    issueDate: "2025",
    description:
      "Principles of data visualization to effectively communicate data-driven insights through charts and graphs.",
    skills: ["Data Visualization", "Data Analysis"],
    link: "https://www.dicoding.com/certificates/1RXYQQ6RKZVM",
  },
  {
    id: "c10",
    title: "Belajar Dasar Structured Query Language (SQL)",
    issuer: "Dicoding Indonesia",
    issueDate: "2025",
    description:
      "Relational database concepts and fundamental SQL queries for data extraction and manipulation.",
    skills: ["SQL", "Relational Databases", "Data Management"],
    link: "https://www.dicoding.com/certificates/MEPJ2QV5WP3V",
  },
  {
    id: "c11",
    title: "Belajar Dasar Data Science",
    issuer: "Dicoding Indonesia",
    issueDate: "2025",
    description:
      "Overview of Data Science methodology, data processing pipelines, and basic analytical tools.",
    skills: ["Data Science", "Data Analysis"],
    link: "https://www.dicoding.com/certificates/JMZVV4973ZN9",
  },
  {
    id: "c12",
    title: "Career Management Essentials",
    issuer: "IBM",
    issueDate: "2025",
    description:
      "Professional growth, career mapping, personal branding, and workplace communication strategies.",
    skills: ["Career Development", "Professional Skills"],
    link: "https://www.ibm.com/training/",
  },
  {
    id: "c13",
    title: "Belajar Penggunaan Generative AI",
    issuer: "Dicoding Indonesia",
    issueDate: "2025",
    description:
      "Understanding generative models, prompt design, and practical use cases for productivity and software development.",
    skills: ["Artificial Intelligence (AI)", "Generative AI"],
    link: "https://www.dicoding.com/certificates/GRX5JOK7KX0M",
  },
  {
    id: "c14",
    title: "Prompt Engineering untuk Software Developer",
    issuer: "Dicoding Indonesia",
    issueDate: "2025",
    description:
      "Techniques for crafting precise prompts for AI tools to accelerate coding, debugging, and system design.",
    skills: ["Prompt Engineering", "Generative AI", "Software Development"],
    link: "https://www.dicoding.com/certificates/KEXL20QJ0ZG2",
  },
  {
    id: "c15",
    title: "Belajar Pengembangan Web Intermediate",
    issuer: "Dicoding Indonesia",
    issueDate: "2025",
    description:
      "Intermediate web development concepts including web accessibility, performance optimization, and progressive web apps.",
    skills: ["Web Development", "JavaScript", "PWA"],
    link: "https://www.dicoding.com/certificates/2VX35W0RQPYQ",
  },
  {
    id: "c16",
    title: "Coding Camp 2025 – Certificate of Completion",
    issuer: "Coding Camp powered by DBS Foundation",
    issueDate: "2024",
    description:
      "Intensive software development program covering modern web development technologies and team capstone projects.",
    skills: ["Full-Stack Development", "Web Development", "Teamwork"],
    link: "https://www.dicoding.com/certificates/FS064D5Y0089",
  },
  {
    id: "c17",
    title: "English for Business Communication",
    issuer: "TBI - The British Institute",
    issueDate: "2025",
    description:
      "Professional English communication skills focused on business correspondence, presentations, and team discussions.",
    skills: ["Business English", "Professional Communication"],
    link: "https://www.tbi.co.id/",
  },
  {
    id: "c18",
    title: "Financial Literacy 101",
    issuer: "Dicoding Indonesia",
    issueDate: "2025",
    description:
      "Foundational financial principles, personal budgeting, investment basics, and financial decision-making.",
    skills: ["Financial Literacy", "Personal Finance"],
    link: "https://www.dicoding.com/certificates/ERZRE8K2OXYV",
  },
  {
    id: "c19",
    title: "Belajar Back-End Pemula dengan JavaScript",
    issuer: "Dicoding Indonesia",
    issueDate: "2025",
    description:
      "Building back-end applications using Node.js, RESTful API architecture, and server deployment basics.",
    skills: ["Node.js", "JavaScript", "REST API", "Back-End Development"],
    link: "https://www.dicoding.com/certificates/RVZKWM9YMZD5",
  },
  {
    id: "c20",
    title: "Belajar Fundamental Front-End Web Development",
    issuer: "Dicoding Indonesia",
    issueDate: "2025",
    description:
      "Front-end engineering best practices, custom elements, ES6 JavaScript, Webpack, and asynchronous HTTP requests.",
    skills: ["JavaScript", "Front-End Development", "ES6", "Webpack"],
    link: "https://www.dicoding.com/certificates/4EXGV3309XRL",
  },
  {
    id: "c21",
    title: "Belajar Membuat Front-End Web untuk Pemula",
    issuer: "Dicoding Indonesia",
    issueDate: "2025",
    description:
      "Creating responsive web layouts, handling DOM events, and building interactive web pages.",
    skills: ["HTML", "CSS", "JavaScript", "DOM Manipulation"],
    link: "https://www.dicoding.com/certificates/4EXGVNJ11XRL",
  },
  {
    id: "c22",
    title: "Belajar Dasar Pemrograman JavaScript",
    issuer: "Dicoding Indonesia",
    issueDate: "2025",
    description:
      "Fundamentals of modern JavaScript programming language including data types, functional programming, and OOP.",
    skills: ["JavaScript", "Programming Foundations"],
    link: "https://www.dicoding.com/certificates/07Z63VLJRZQR",
  },
  {
    id: "c23",
    title: "Belajar Dasar Pemrograman Web",
    issuer: "Dicoding Indonesia",
    issueDate: "2025",
    description:
      "Fundamentals of web programming, covering HTML, CSS, and JavaScript basics for building interactive web pages.",
    skills: ["HTML", "CSS", "JavaScript"],
    link: "https://www.dicoding.com/certificates/L4PQE4KKVPO1",
  },

  {
    id: "c24",
    title: "Coding Camp 2025 – Certificate of Completion",
    issuer: "DBS Foundation",
    issueDate: "2025",
    description:
      "Awarded for completing over 800 hours of an intensive full-stack development program.",
    featured: true,
  },
  {
    id: "c25",
    title: "2nd Place Competition CYBER SECURITY",
    issuer: "Faculty of Informatics Technology Competition 2.0",
    issueDate: "2024",
    description:
      "Secured 2nd place in a competitive cyber security challenge, demonstrating strong skills in network defense and vulnerability analysis.",
  },
  {
    id: "c26",
    title: "Best Capstone Project – Top 15 Team",
    issuer: "Coding Camp powered by DBS Foundation",
    issueDate: "2025",
    description:
      "Recognized as one of the Top 15 teams for the AgriTrend-DSS Capstone project, leading the Backend and DevOps architecture.",
    featured: true,
  },
  {
    id: "c27",
    title: "Pijak x IBM Skillsbuild Completion Letter",
    issuer: "Pijak in collaboration with IBM SkillsBuild",
    issueDate: "2026",
    description:
      "Awarded for outstanding performance and innovation in the capstone project, demonstrating excellence in full-stack development and teamwork.",
    link: "https://drive.google.com/file/d/1N5upWhXuxXBsZ9IotHiTuakF253jN_N9/view?usp=drive_link",
    featured: true,
  },
];
