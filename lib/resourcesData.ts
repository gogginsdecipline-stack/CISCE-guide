export interface StudyResource {
  title: string;
  type: 'pdf' | 'textbook' | 'website' | 'video';
  url: string;
  description: string;
  tag?: string; // e.g., "Syllabus Year 2026", "Highly Recommended", "Full Playlist", "Official Source"
}

export interface SubjectResources {
  pastPapers: StudyResource[];
  textbooks: StudyResource[];
  websites: StudyResource[];
  videos: StudyResource[];
}

// Generates highly accurate custom study materials and links for ICSE & ISC subjects
export function getSubjectResources(subjectId: string, subjectName: string): SubjectResources {
  const isIsc = subjectId.startsWith("isc-");
  const isIcse = subjectId.startsWith("icse-");
  const cleanName = subjectName.toLowerCase();
  
  // Base default resources to fallback on for any subject
  const defaultValue: SubjectResources = {
    pastPapers: [
      {
        title: `${subjectName} Official Specimen Question Paper`,
        type: 'pdf',
        url: 'https://cisce.org/publications-resources/',
        description: 'Latest official specimen question paper issued directly by the CISCE board to understand structure, section formatting, and evaluation trends.',
        tag: 'Official Specimen'
      },
      {
        title: `${subjectName} Previous 5-Year Solved Papers Bundle`,
        type: 'pdf',
        url: 'https://cisce.org/archives/',
        description: 'Comprehensive archival registry of actual board exam question papers from recent cycles with authorized marking standards.',
        tag: 'Board Papers'
      }
    ],
    textbooks: [
      {
        title: `Comprehensive CISCE Curriculum Guide for ${subjectName}`,
        type: 'textbook',
        url: 'https://cisce.org/syllabus/',
        description: `Recommended textbook reference and core library syllabus guide for ${subjectName}, aligned with current terminal examination layouts.`,
        tag: 'Official'
      }
    ],
    websites: [
      {
        title: "CISCE Official Publications and Resources Hub",
        type: 'website',
        url: 'https://cisce.org',
        description: 'The official governance portal of the Council for the Indian School Certificate Examinations, New Delhi. Sourcing the most accurate official communications.',
        tag: 'Board Portal'
      },
      {
        title: "Shiksha CISCE Academic Hub",
        type: 'website',
        url: 'https://www.shiksha.com/boards/icse-board',
        description: 'Study guides, analysis of past papers, scoring systems, and dynamic peer discussions for students of Class X and XII.',
        tag: 'Syllabus Tips'
      }
    ],
    videos: [
      {
        title: "Study with Sudhir - CISCE Masterclasses",
        type: 'video',
        url: 'https://www.youtube.com/@StudywithSudhir',
        description: 'One of the top-rated academic channels dedicated to ICSE and ISC English, Humanities, and board preparation tips.',
        tag: 'Study with Sudhir'
      },
      {
        title: "Clarify Knowledge (CISCE Specialist)",
        type: 'video',
        url: 'https://www.youtube.com/@ClarifyKnowledge',
        description: 'Video series focusing on Class 10 and 12 curriculum weightages, high-scoring questions, and notes.',
        tag: 'Board Prep'
      }
    ]
  };

  // Specific Subject Resources
  
  // ENGLISH (Both ICSE & ISC)
  if (cleanName.includes("english") || cleanName.includes("eng")) {
    defaultValue.textbooks = [
      {
        title: "Julius Caesar - Shakespeare (Selina / S. Chand Edition)",
        type: 'textbook',
        url: 'https://www.schandpublishing.com',
        description: "The primary drama play text for ICSE Class 10. Complete with paraphrased explanations, word meanings, and sample Act extract questions.",
        tag: isIcse ? 'Recommended Class X' : 'Recommended'
      },
      {
        title: "The Tempest - Shakespeare (OUP / S. Chand Edition)",
        type: 'textbook',
        url: 'https://global.oup.com',
        description: "The primary drama selection for Class XII ISC. High-fidelity annotated script with act-by-act modern translation.",
        tag: isIsc ? 'Recommended Class XII' : 'Recommended'
      },
      {
        title: "Prism & Rhapsody Collection (Evergreen Publications)",
        type: 'textbook',
        url: 'https://www.evergreenpublications.in',
        description: "Selected poetical works and short stories syllabus for Class XII and Class X. Includes comprehensive summary guides.",
        tag: 'Core Anthologies'
      }
    ];
    defaultValue.websites = [
      {
        title: "LitCharts Lit-Guides for Shakespeare Plays",
        type: 'website',
        url: 'https://www.litcharts.com',
        description: "Premium study guides, character relationship trees, high-importance quote analysis, and theme trackers.",
        tag: 'Analysis Guide'
      },
      {
        title: "Englicist - CISCE English Literature Resource Portal",
        type: 'website',
        url: 'https://www.englicist.com',
        description: "Comprehensive notes, line-by-line analyses, question banks, and quizzes covering all stories and poems of contemporary ICSE/ISC.",
        tag: 'Study Helper'
      }
    ];
    defaultValue.videos.unshift({
      title: "Study with Sudhir - ICSE & ISC English Excellence",
      type: 'video',
      url: 'https://www.youtube.com/playlist?list=PL_U7N71_5N4D3C5n2dI2Zc_gKTM9-gAxe',
      description: "Step-by-step narration, grammar rules, act analysis, and essay writing formulas for full-marks English preparation.",
      tag: 'Full Playlists'
    });
  }

  // MATHEMATICS
  else if (cleanName.includes("mathematics") || cleanName.includes("math")) {
    defaultValue.textbooks = [
      {
        title: isIcse ? "Concise Mathematics for Class X - Selina Publishers" : "Understanding ISC Mathematics Class XII - ML Aggarwal (Arya)",
        type: 'textbook',
        url: 'https://www.apcbooks.co.in/books/school-education/icse-board/mathematics-icse-class-10-ml-aggarwal',
        description: isIcse 
          ? "The gold standard textbook for ICSE Class 10 mathematics. Extremely clear theorem proofs, extensive practical assignments, and previous boards lists."
          : "Highly rigorous syllabus text covering Calculus (Differential & Integral), Vectors, 3D Geometry, and Linear Programming options step-by-step.",
        tag: 'Primary Textbook'
      },
      {
        title: "S. Chand ICSE Mathematics for Class X / XII",
        type: 'textbook',
        url: 'https://www.schandpublishing.com',
        description: "Alternative study textbook with simplified problem solving and illustrative model papers.",
        tag: 'Self Study Code'
      }
    ];
    defaultValue.websites = [
      {
        title: "Khan Academy India - Interactive Mathematics Core",
        type: 'website',
        url: 'https://www.khanacademy.org/math',
        description: "Self-paced personalized math lectures, quizzes, and micro-assessments covering algebra, coordinates, trigonometry, and calculus.",
        tag: 'Interactive Practice'
      },
      {
        title: "Toppr Advanced Subject Problem Repository",
        type: 'website',
        url: 'https://www.toppr.com/guides/maths',
        description: "Exhaustive database of step-by-step textbook solutions and interactive diagnostic toolsets.",
        tag: 'Solution Keys'
      }
    ];
    defaultValue.videos = [
      {
        title: "Physics Wallah - Mathematics Board Preparation",
        type: 'video',
        url: 'https://www.youtube.com/@PhysicsWallah',
        description: "Comprehensive crash courses on tricky topics like Calculus, Matrices, Mensuration, and advanced Probability.",
        tag: 'Top Lectures'
      },
      {
        title: "Neha Agrawal Mathematically Inclined - Board Specials",
        type: 'video',
        url: 'https://www.youtube.com/@MathematicallyInclined',
        description: "High-yield video reviews, shortcut tricks for sections, and solution strategies for standard Board exam questions.",
        tag: 'Board Marathons'
      }
    ];
  }

  // SCIENCE subjects (Physics, Chemistry, Biology)
  else if (cleanName.includes("physics") || cleanName.includes("chemistry") || cleanName.includes("biology") || cleanName.includes("science")) {
    defaultValue.textbooks = [
      {
        title: cleanName.includes("physics")
          ? (isIcse ? "Concise Physics Class 10 - Selina Publishers" : "Nootan ISC Physics Class XII - Kumar & Mittal")
          : cleanName.includes("chemistry")
          ? (isIcse ? "Concise Chemistry Class 10 - Selina Publishers" : "Nootan ISC Chemistry Class XII - Dr. H.C. Srivastava")
          : (isIcse ? "Concise Biology Class 10 - Selina Publishers" : "S. Chand Biology Class XII - Dr. P.S. Verma"),
        type: 'textbook',
        url: 'https://www.schandpublishing.com',
        description: `The standard approved textbook series designed to fulfill exact curriculum lines for ${subjectName}. Features rigorous theoretical questions.`,
        tag: 'Recommended Primary'
      }
    ];
    defaultValue.websites = [
      {
        title: "Learn-Fatafat Science Interactive Simulations",
        type: 'website',
        url: 'https://learnfatafat.com',
        description: "Animated video lectures, conceptual breakdowns, and diagnostic 3D learning models matching physical theories.",
        tag: '3D Simulations'
      }
    ];
    defaultValue.videos = [
      {
        title: "Physics Wallah - Alakh Pandey Pure Lectures",
        type: 'video',
        url: 'https://www.youtube.com/@PhysicsWallah',
        description: "Phenomenal and highly popular classroom lectures breaking down electrodynamics, organic chemistry synthesis, or genetic DNA replication pathways.",
        tag: 'Alakh Pandey'
      },
      {
        title: "Concept Clarity - ICSE Science Hub",
        type: 'video',
        url: 'https://www.youtube.com/@ClarifyKnowledge',
        description: "Concept-driven summaries of long chapters, quick test banks, and lab-practical drawing guidelines.",
        tag: 'Lab Prep'
      }
    ];
  }

  // COMPUTER APPLICATIONS / SPECIALIZED / CS
  else if (cleanName.includes("computer") || cleanName.includes("robotics") || cleanName.includes("ai")) {
    defaultValue.textbooks = [
      {
        title: isIcse ? "Understanding Computer Applications Class 10 (APC)" : "Computer Science with Java Class XII - Sumita Arora",
        type: 'textbook',
        url: 'https://www.apcbooks.co.in',
        description: isIcse 
          ? "The most popular Java & BlueJ conceptual text for Class 10. Packed with theoretical dry run tracing questions, output predictions, and full programs."
          : "Highly detailed Object-Oriented Programming (OOP) text. Includes comprehensive treatment of boolean algebra, advanced recursion, data interfaces, and complexity analysis.",
        tag: 'Coding Best Seller'
      }
    ];
    defaultValue.websites = [
      {
        title: "GeeksforGeeks School - Java and DSA Guides",
        type: 'website',
        url: 'https://www.geeksforgeeks.org',
        description: "Interactive language portals for standard Java structures (2D arrays, stacks, linked lists, searching & sorting algorithms). Includes quick code-play tools.",
        tag: 'DSA Learning'
      },
      {
        title: "W3Schools Interactive Coding Exercises",
        type: 'website',
        url: 'https://www.w3schools.com/java/',
        description: "Great playground for testing basic logic syntax, object properties, polymorphism, and inheritance statements safely.",
        tag: 'Syntax Playground'
      }
    ];
    defaultValue.videos = [
      {
        title: "Amplify Learning - With Alok (CISCE Specialist)",
        type: 'video',
        url: 'https://www.youtube.com/@AmplifyLearning',
        description: "The absolute best Channel for CISCE Java Programming, covering arrays, string manipulation, functions, recursion, and theory definitions.",
        tag: 'Alok Sir Lectures'
      },
      {
        title: "Knowledge Boat - Interactive Coding Lab",
        type: 'video',
        url: 'https://www.youtube.com/playlist?list=PL4Ceb9tGfLNo6HwSnyorG0g_jI0M6eNnF',
        description: "Focuses on step-by-step solving of standard logical Board questions, array sorting, and dry-run tracing techniques.",
        tag: 'Interactive Java'
      }
    ];
  }

  // COMMERCE / ECONOMIC / ACCOUNTS / BST
  else if (cleanName.includes("commerce") || cleanName.includes("eco") || cleanName.includes("account") || cleanName.includes("business")) {
    defaultValue.textbooks = [
      {
        title: cleanName.includes("account")
          ? "Double Entry Bookkeeping - T.S. Grewal (Sultan Chand)"
          : cleanName.includes("eco")
          ? "Frank ISC Economics Class XII - DK Dey"
          : "ISC Commerce Class XII - Dr. C.B. Gupta",
        type: 'textbook',
        url: 'https://www.shoppersworld.in',
        description: "Industry-standard workbook and concepts guide mapped precisely to the theoretical balance sheets and transaction regulations formatted by the board.",
        tag: 'Approved Guide'
      }
    ];
    defaultValue.websites = [
      {
        title: "Moneycontrol Corporate Finance Glossary",
        type: 'website',
        url: 'https://www.moneycontrol.com',
        description: "Practical understanding of stock indices, credit mechanisms, budget allocations, taxes, and accounting practices.",
        tag: 'Practical Finance'
      }
    ];
    defaultValue.videos = [
      {
        title: "Commerce Baba - Balance Sheets and Accounts Marathons",
        type: 'video',
        url: 'https://www.youtube.com/@CommerceBaba',
        description: "Top-rated educational channels covering ledger records, ratio formulas, demand/supply graphs, and financial accounting principles clearly.",
        tag: 'Commerce Guru'
      },
      {
        title: "Rajat Arora - Board Class Lectures",
        type: 'video',
        url: 'https://www.youtube.com/@RajatAroraOfficial',
        description: "Fabulously designed short lectures on National Income accounting, fiscal policy, balance of payments, and staffing procedures.",
        tag: 'Accounts Master class'
      }
    ];
  }

  // HISTORY / POL SCI / HUMANITIES
  else if (cleanName.includes("history") || cleanName.includes("civics") || cleanName.includes("geography") || cleanName.includes("pol") || cleanName.includes("sociology") || cleanName.includes("psychology")) {
    defaultValue.textbooks = [
      {
        title: isIcse 
          ? "Total History & Civics Class 10 - Morning Star" 
          : "ISC History / Political Science Class XII - Dr. K.K. Mukherjee",
        type: 'textbook',
        url: 'https://www.morningstarpublisher.com',
        description: "Syllabus-aligned comprehensive guide detailing World Wars, Indian Nationalism, constitution framework, and international organization structures.",
        tag: 'Morning Star Core'
      },
      {
        title: "Total Geography Class 10 (Morning Star / Frank)",
        type: 'textbook',
        url: 'https://www.morningstarpublisher.com',
        description: "High-resolution map studies, meteorological charts, soil, minerals, agriculture, industries, and climate cycles.",
        tag: 'Topographical Focus'
      }
    ];
    defaultValue.websites = [
      {
        title: "Geography Map Studies Portal - Maps of India",
        type: 'website',
        url: 'https://www.mapsofindia.com',
        description: "Highly accurate map practice utilities, marking tools, and geographic resource grids to perfect map scoring questions.",
        tag: 'Map Practice'
      }
    ];
    defaultValue.videos = [
      {
        title: "Study with Sudhir - Humanities and Social Sciences Excellence",
        type: 'video',
        url: 'https://www.youtube.com/@StudywithSudhir',
        description: "Fabulous audio lectures breaking down historical treaties, local governance boards, topography calculations, and political draft mechanisms.",
        tag: 'Recommended Humanities'
      },
      {
        title: "Sleepy Classes - Political Science and History",
        type: 'video',
        url: 'https://www.youtube.com/@SleepyClasses',
        description: "Conceptual and analytical frameworks suited for higher evaluation profiles and competitive prep streams like UPSC.",
        tag: 'Advanced Concepts'
      }
    ];
  }

  return defaultValue;
}

export function solveOptimalSubjectCombination(board: "ICSE" | "ISC", career: string): {
  subjectIds: string[];
  subjectNames: string[];
  rationale: string;
  combinationTitle: string;
} {
  if (board === "ICSE") {
    // Compulsory Group I
    const core = ["icse-eng", "icse-lang", "icse-hcg"];
    
    if (career === "Engineering, Robotics & AI Architect" || career === "Data Scientist, Fullstack Developer or Tech Entrepreneur") {
      return {
        combinationTitle: "Science & Technology Pathway (Class X)",
        subjectIds: [...core, "icse-math", "icse-sci", "icse-comp"],
        subjectNames: ["English", "Second Language", "History, Civics & Geography", "Mathematics", "Science (Physics/Chemistry/Biology)", "Computer Applications"],
        rationale: "This combination provides an exceptionally strong foundation in critical thinking, analytical logic, and programming concepts. Computer Applications strengthens Java logic, laying a solid pathway for higher-level Software Engineering and AI streams.",
      };
    } else if (career === "Medicine, Bio-technology & Surgery") {
      return {
        combinationTitle: "Medicine & Health Sciences Pathway (Class X)",
        subjectIds: [...core, "icse-math", "icse-sci", "icse-pe"],
        subjectNames: ["English", "Second Language", "History, Civics & Geography", "Mathematics", "Science (Physics/Chemistry/Biology)", "Physical Education"],
        rationale: "Maximizes scientific rigor through core Science electives, while providing physical health, anatomy, and physiology exposure through Physical Education to benefit future study in clinical fields.",
      };
    } else if (career === "Chartered Accountant, Investment Banker or CFO" || career === "Business Tycoon, Management Consultant or Economist") {
      return {
        combinationTitle: "Modern Business & Commerce Pathway (Class X)",
        subjectIds: [...core, "icse-math", "icse-comm", "icse-eco-app"],
        subjectNames: ["English", "Second Language", "History, Civics & Geography", "Mathematics", "Commercial Studies", "Economic Applications"],
        rationale: "Equips you with real-world corporate knowledge, trade economics, and financial modeling. Mathematics is highly recommended to support advanced accounting and finance systems.",
      };
    } else if (career === "Civil Services (UPSC), Legal Practitioner or Diplomat") {
      return {
        combinationTitle: "Humanities & Public Administration Pathway (Class X)",
        subjectIds: [...core, "icse-eco", "icse-evs", "icse-comm-app"],
        subjectNames: ["English", "Second Language", "History, Civics & Geography", "Economics", "Environmental Science", "Commercial Applications"],
        rationale: "Develops a comprehensive macro-view of environmental policy, fiscal studies, and state applications. Encourages descriptive precision and public administration skills.",
      };
    } else { // Creative / UX / fallback
      return {
        combinationTitle: "Creative Arts & Digital Design Pathway (Class X)",
        subjectIds: [...core, "icse-math", "icse-comm", "icse-art"],
        subjectNames: ["English", "Second Language", "History, Civics & Geography", "Mathematics", "Commercial Studies", "Art"],
        rationale: "Balances logical and commercial fundamentals with a dedicated focus on fine arts, perspective geometry, and design principles, suitable for modern creative careers and media studies.",
      };
    }
  } else {
    // ISC Class 12
    const core = ["isc-eng"];
    
    if (career === "Engineering, Robotics & AI Architect") {
      return {
        combinationTitle: "Advanced Pure Science & Computing Stream (Class XII)",
        subjectIds: [...core, "isc-physics", "isc-chemistry", "isc-math", "isc-cs"],
        subjectNames: ["English", "Physics (Theory & Practical)", "Chemistry (Theory & Practical)", "Mathematics", "Computer Science"],
        rationale: "This classic PCM + CS stream delivers maximum analytical horsepower. Rigorous physics/math mechanics paired with Object-Oriented Java prepares you perfectly for engineering schools worldwide.",
      };
    } else if (career === "Medicine, Bio-technology & Surgery") {
      return {
        combinationTitle: "Clinical Medical & Life Sciences Stream (Class XII)",
        subjectIds: [...core, "isc-physics", "isc-chemistry", "isc-biology", "isc-math"],
        subjectNames: ["English", "Physics (Theory & Practical)", "Chemistry (Theory & Practical)", "Biology (Theory & Practical)", "Mathematics"],
        rationale: "The PCM + Biology combination keeps all competitive entrance streams open, delivering full-spectrum training in chemical, physical, and cellular biological systems.",
      };
    } else if (career === "Chartered Accountant, Investment Banker or CFO") {
      return {
        combinationTitle: "Finance, Quantitative Accounts & Taxation Stream (Class XII)",
        subjectIds: [...core, "isc-accounts", "isc-commerce-sub", "isc-eco", "isc-math"],
        subjectNames: ["English", "Accounts", "Commerce", "Economics", "Mathematics"],
        rationale: "Includes the core trifecta of professional corporate commerce, plus advanced Mathematics. Essential for rigorous investment frameworks, econometric analysis, and CA certifications.",
      };
    } else if (career === "Data Scientist, Fullstack Developer or Tech Entrepreneur") {
      return {
        combinationTitle: "Computational Mathematics & Analytics Stream (Class XII)",
        subjectIds: [...core, "isc-math", "isc-cs", "isc-physics", "isc-eco"],
        subjectNames: ["English", "Mathematics", "Computer Science", "Physics (Theory & Practical)", "Economics"],
        rationale: "Combines data-science fundamentals (Math & CS) with financial theory (Economics) and rigorous physical models (Physics). Perfect for high-growth tech ventures.",
      };
    } else if (career === "Civil Services (UPSC), Legal Practitioner or Diplomat") {
      return {
        combinationTitle: "Public Policy, Law & Geopolitical Stream (Class XII)",
        subjectIds: [...core, "isc-history", "isc-polsci", "isc-geography", "isc-eco"],
        subjectNames: ["English", "History", "Political Science", "Geography", "Economics"],
        rationale: "Unlocks maximum descriptive strength. Delivers comprehensive background expertise on world histories, international relations (Political Science), demographic planning, and macroeconomics.",
      };
    } else if (career === "Creative Designer, Fine Artist or UX Architect") {
      return {
        combinationTitle: "Creative Media, Human Minds & Systems Stream (Class XII)",
        subjectIds: [...core, "isc-cs", "isc-psychology", "isc-sociology", "isc-geography"],
        subjectNames: ["English", "Computer Science", "Psychology", "Sociology", "Geography"],
        rationale: "Melds technology systems (CS) with user psychology and human demographics, building a highly unique, modern foundation for interface and spatial product design.",
      };
    } else { // Business / fallback
      return {
        combinationTitle: "Strategic Management & Economic Systems Stream (Class XII)",
        subjectIds: [...core, "isc-commerce-sub", "isc-eco", "isc-bst", "isc-math"],
        subjectNames: ["English", "Commerce", "Economics", "Business Studies", "Mathematics"],
        rationale: "Designed to provide complete business intelligence—from accounting foundations to management theories and industrial math—shaping leaders, founders, and consultants.",
      };
    }
  }
}
