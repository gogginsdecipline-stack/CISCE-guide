export interface Subject {
  id: string;
  name: string;
  group: string;
  code: string;
  description: string;
  baseTheoryMarks: number;
  basePracticalMarks: number;
  isCompulsory: boolean;
  category: "Language" | "Science" | "Commerce" | "Humanities" | "Vocational" | "General";
}

export interface BoardConfig {
  name: string;
  description: string;
  level: string;
  minChoice: number;
  maxChoice: number;
  choiceRuleDescription: string;
  groups: {
    id: string;
    name: string;
    rule: string;
    isRequired: boolean;
    minSelect: number;
    maxSelect: number;
    subjects: Subject[];
  }[];
}

export const ICSE_CONFIG: BoardConfig = {
  name: "ICSE",
  level: "Class 10",
  description: "Indian Certificate of Secondary Education. A highly meticulous and detailed curriculum focusing on robust conceptual foundations.",
  minChoice: 7,
  maxChoice: 7,
  choiceRuleDescription: "Must choose 7 subjects in total: All 3 from Group I (Compulsory), exactly 2 or 3 from Group II, and exactly 1 from Group III (to make up 7).",
  groups: [
    {
      id: "group-1",
      name: "Group I (Compulsory)",
      rule: "Must study all subjects in this group. Formulate the core curriculum.",
      isRequired: true,
      minSelect: 3,
      maxSelect: 3,
      subjects: [
        {
          id: "icse-eng",
          name: "English",
          code: "01",
          group: "Group I",
          description: "Split into English Language (Paper 1) and Literature in English (Paper 2). Focuses on composition, grammar, comprehension, play study, poetry, and prose.",
          baseTheoryMarks: 80,
          basePracticalMarks: 20,
          isCompulsory: true,
          category: "Language",
        },
        {
          id: "icse-lang",
          name: "Second Language",
          code: "05",
          group: "Group I",
          description: "Choice of Hindi, Bengali, Sanskrit, French, etc. Enhances regional or foreign language comprehension, creative writing, and literary reading.",
          baseTheoryMarks: 80,
          basePracticalMarks: 20,
          isCompulsory: true,
          category: "Language",
        },
        {
          id: "icse-hcg",
          name: "History, Civics & Geography",
          code: "50",
          group: "Group I",
          description: "Split into History & Civics (Paper 1) and Geography (Paper 2) including topographical map studies and Indian geography.",
          baseTheoryMarks: 80,
          basePracticalMarks: 20,
          isCompulsory: true,
          category: "Humanities",
        },
      ],
    },
    {
      id: "group-2",
      name: "Group II (Electives)",
      rule: "Choose any 2 or 3 subjects from this group. Schools typically offer Science or Commerce sets.",
      isRequired: true,
      minSelect: 2,
      maxSelect: 3,
      subjects: [
        {
          id: "icse-math",
          name: "Mathematics",
          code: "51",
          group: "Group II",
          description: "Algebra, Geometry, Trigonometry, Statistics, Mensuration, Coordinate Geometry, and Commercial Mathematics.",
          baseTheoryMarks: 80,
          basePracticalMarks: 20,
          isCompulsory: false,
          category: "Science",
        },
        {
          id: "icse-sci",
          name: "Science (Physics, Chemistry, Biology)",
          code: "52",
          group: "Group II",
          description: "Comprehensive scientific literacy split into three distinct theory papers: Paper 1 (Physics), Paper 2 (Chemistry), and Paper 3 (Biology).",
          baseTheoryMarks: 80,
          basePracticalMarks: 20,
          isCompulsory: false,
          category: "Science",
        },
        {
          id: "icse-comm",
          name: "Commercial Studies",
          code: "53",
          group: "Group II",
          description: "Foundational aspects of commercial operations, accounting, banking, marketing, and human resource environments.",
          baseTheoryMarks: 80,
          basePracticalMarks: 20,
          isCompulsory: false,
          category: "Commerce",
        },
        {
          id: "icse-eco",
          name: "Economics",
          code: "54",
          group: "Group II",
          description: "Basic economic principles, consumer awareness, sectors of the Indian economy, money, and banking.",
          baseTheoryMarks: 80,
          basePracticalMarks: 20,
          isCompulsory: false,
          category: "Commerce",
        },
        {
          id: "icse-evs",
          name: "Environmental Science",
          code: "55",
          group: "Group II",
          description: "Bridges geography, science, and sociology to analyze global warming, wildlife depletion, and sustainable management resource practices.",
          baseTheoryMarks: 80,
          basePracticalMarks: 20,
          isCompulsory: false,
          category: "General",
        },
      ],
    },
    {
      id: "group-3",
      name: "Group III (Electives)",
      rule: "Choose exactly 1 subject from this group. Heavy emphasis on hands-on practical scoring.",
      isRequired: true,
      minSelect: 1,
      maxSelect: 1,
      subjects: [
        {
          id: "icse-comp",
          name: "Computer Applications",
          code: "86",
          group: "Group III",
          description: "Core programming fundamentals using Java (OOPs concepts, arrays, loops, functions, class and objects). Excellent high-scoring subject.",
          baseTheoryMarks: 100,
          basePracticalMarks: 100,
          isCompulsory: false,
          category: "Vocational",
        },
        {
          id: "icse-pe",
          name: "Physical Education",
          code: "72",
          group: "Group III",
          description: "Study of physical health, nutrition, human anatomy, posture, first aid, alongside choice-specific rules of major sports (Cricket, Football, Basketball, etc.).",
          baseTheoryMarks: 100,
          basePracticalMarks: 100,
          isCompulsory: false,
          category: "Vocational",
        },
        {
          id: "icse-eco-app",
          name: "Economic Applications",
          code: "87",
          group: "Group III",
          description: "Interactive application of core economic dynamics, pricing, inflation, market structures, and national policies directly.",
          baseTheoryMarks: 100,
          basePracticalMarks: 100,
          isCompulsory: false,
          category: "Commerce",
        },
        {
          id: "icse-comm-app",
          name: "Commercial Applications",
          code: "88",
          group: "Group III",
          description: "Practical projects detailing advertising, sales promotion, accounting books, and service organization protocols.",
          baseTheoryMarks: 100,
          basePracticalMarks: 100,
          isCompulsory: false,
          category: "Commerce",
        },
        {
          id: "icse-art",
          name: "Art",
          code: "60",
          group: "Group III",
          description: "Still life sketching, imaginative compositions, applied designs, and historical context of fine arts.",
          baseTheoryMarks: 100,
          basePracticalMarks: 100,
          isCompulsory: false,
          category: "Vocational",
        },
        {
          id: "icse-ai-robotics",
          name: "Robotics and Artificial Intelligence",
          code: "99",
          group: "Group III",
          description: "Foundational robotics systems, sensory feedback loops, mobile robot navigation, introduction to intelligence agents, algorithms, and micro-controllers.",
          baseTheoryMarks: 100,
          basePracticalMarks: 100,
          isCompulsory: false,
          category: "Vocational",
        },
      ],
    },
  ],
};

export const ISC_CONFIG: BoardConfig = {
  name: "ISC",
  level: "Class 12",
  description: "Indian School Certificate. Prepares students for higher university education globally, offering rigorous stream classifications.",
  minChoice: 4,
  maxChoice: 6,
  choiceRuleDescription: "Must choose English (Compulsory) + between 3 to 5 elective subjects of your choice, typically organized along Stream lines (Science, Commerce, Humanities).",
  groups: [
    {
      id: "isc-compulsory",
      name: "Compulsory Subjects",
      rule: "English is absolutely mandatory for all candidates in India.",
      isRequired: true,
      minSelect: 1,
      maxSelect: 1,
      subjects: [
        {
          id: "isc-eng",
          name: "English",
          code: "801",
          group: "Compulsory",
          description: "Split into Paper 1 (English Language: essays, proposal writing, grammar) and Paper 2 (Literature in English: Shakespearean play, poetry anthology, prose stories).",
          baseTheoryMarks: 80,
          basePracticalMarks: 20,
          isCompulsory: true,
          category: "Language",
        },
      ],
    },
    {
      id: "isc-science",
      name: "Science Elective Stream",
      rule: "Popular electives for science majors. Typically matched with Mathematics for engineering or Biology for medicine.",
      isRequired: false,
      minSelect: 0,
      maxSelect: 5,
      subjects: [
        {
          id: "isc-physics",
          name: "Physics",
          code: "861",
          group: "Science Stream",
          description: "Electrostatics, Current Electricity, Magnetic Effects, Optics, Dual Nature of Matter, Atoms & Nuclei, Electronic Devices.",
          baseTheoryMarks: 70,
          basePracticalMarks: 30,
          isCompulsory: false,
          category: "Science",
        },
        {
          id: "isc-chemistry",
          name: "Chemistry",
          code: "862",
          group: "Science Stream",
          description: "Physical Chemistry (Solutions, Electrochemistry, Kinetics), Inorganic (Coordination Compounds, d & f-block), and highly comprehensive Organic Chemistry.",
          baseTheoryMarks: 70,
          basePracticalMarks: 30,
          isCompulsory: false,
          category: "Science",
        },
        {
          id: "isc-biology",
          name: "Biology",
          code: "863",
          group: "Science Stream",
          description: "Reproduction, Genetics and Evolution, Biology and Human Welfare, Biotechnology and its Applications, Ecology and Environment.",
          baseTheoryMarks: 70,
          basePracticalMarks: 30,
          isCompulsory: false,
          category: "Science",
        },
        {
          id: "isc-math",
          name: "Mathematics",
          code: "860",
          group: "Science Stream",
          description: "Calculus (heavy weighting), Relations & Functions, Algebra, Vectors & 3D Geometry, Probability, and optional Section B (Conic, Vectors) or Section C (Linear Programming).",
          baseTheoryMarks: 80,
          basePracticalMarks: 20,
          isCompulsory: false,
          category: "Science",
        },
        {
          id: "isc-cs",
          name: "Computer Science",
          code: "868",
          group: "Science Stream",
          description: "Boolean Algebra, Computer Hardware, Java Object-Oriented Programming, Data Structures (Stacks, Queues, Linked Lists) and algorithmic complexity.",
          baseTheoryMarks: 70,
          basePracticalMarks: 30,
          isCompulsory: false,
          category: "Vocational",
        },
      ],
    },
    {
      id: "isc-commerce",
      name: "Commerce Elective Stream",
      rule: "Provides rigorous insight into corporate functions, accounting books, legal commerce mandates, and marketing policies.",
      isRequired: false,
      minSelect: 0,
      maxSelect: 5,
      subjects: [
        {
          id: "isc-accounts",
          name: "Accounts",
          code: "858",
          group: "Commerce Stream",
          description: "Partnership Accounts, Joint Stock Company Accounts, Financial Statement Analysis, Cash Flow Statements, and Accounting Ratios.",
          baseTheoryMarks: 80,
          basePracticalMarks: 20,
          isCompulsory: false,
          category: "Commerce",
        },
        {
          id: "isc-commerce-sub",
          name: "Commerce",
          code: "857",
          group: "Commerce Stream",
          description: "Business Environment, Financing, Management Functions (Planning, Organizing, Staffing, Directing, Control), Marketing, and Consumer Protection.",
          baseTheoryMarks: 80,
          basePracticalMarks: 20,
          isCompulsory: false,
          category: "Commerce",
        },
        {
          id: "isc-eco",
          name: "Economics",
          code: "856",
          group: "Commerce Stream",
          description: "Microeconomics (Consumer Theory, Elasticity, Producer Behavior), Macroeconomics (National Income, Money and Banking, Balance of Payments).",
          baseTheoryMarks: 80,
          basePracticalMarks: 20,
          isCompulsory: false,
          category: "Commerce",
        },
        {
          id: "isc-bst",
          name: "Business Studies",
          code: "859",
          group: "Commerce Stream",
          description: "Human Resource Management, Recruitment, Selection, Training, Employee Appraisals, Communication, and emerging business paradigms.",
          baseTheoryMarks: 80,
          basePracticalMarks: 20,
          isCompulsory: false,
          category: "Commerce",
        },
      ],
    },
    {
      id: "isc-humanities",
      name: "Humanities Elective Stream",
      rule: "Focuses on deep literature comprehension, global history records, civic laws, societal systems, and human cognitive behaviors.",
      isRequired: false,
      minSelect: 0,
      maxSelect: 5,
      subjects: [
        {
          id: "isc-history",
          name: "History",
          code: "851",
          group: "Humanities Stream",
          description: "Modern World History (World Wars, Cold War, Decolonization) and Modern Indian History (Nationalist Movement, Post-Independence reconstruction).",
          baseTheoryMarks: 80,
          basePracticalMarks: 20,
          isCompulsory: false,
          category: "Humanities",
        },
        {
          id: "isc-polsci",
          name: "Political Science",
          code: "852",
          group: "Humanities Stream",
          description: "Forms of Government, Constitution of India, Legislature, Executive, Judiciary, Local Government, and Contemporary Global Politics.",
          baseTheoryMarks: 80,
          basePracticalMarks: 20,
          isCompulsory: false,
          category: "Humanities",
        },
        {
          id: "isc-geography",
          name: "Geography",
          code: "853",
          group: "Humanities Stream",
          description: "Physical Geography, Human activities, Agriculture, Mineral and Energy Resources, Transportation, and map work representation.",
          baseTheoryMarks: 70,
          basePracticalMarks: 30,
          isCompulsory: false,
          category: "Humanities",
        },
        {
          id: "isc-sociology",
          name: "Sociology",
          code: "854",
          group: "Humanities Stream",
          description: "Social institutions (Family, Kinship, Marriage), Religion, Caste system, Tribal societies, Social change, and contemporary Indian issues.",
          baseTheoryMarks: 80,
          basePracticalMarks: 20,
          isCompulsory: false,
          category: "Humanities",
        },
        {
          id: "isc-psychology",
          name: "Psychology",
          code: "855",
          group: "Humanities Stream",
          description: "Intelligence, Personality development, Psychological disorders, Therapeutic approaches, Social influence, and health psychology applications.",
          baseTheoryMarks: 70,
          basePracticalMarks: 30,
          isCompulsory: false,
          category: "Humanities",
        },
      ],
    },
  ],
};

export interface SyllabusReport {
  title: string;
  board: string;
  grade: string;
  totalMarks: number;
  markingScheme: {
    theoryMarks: number;
    practicalMarks: number;
    breakdown: string[];
  };
  questionPattern: {
    duration: string;
    sections: {
      name: string;
      marks: string;
      compulsory: boolean;
      description: string;
    }[];
    overallStructure: string;
  };
  syllabus: {
    unitName: string;
    weightage: string;
    topics: string[];
  }[];
  expertTips: string[];
}

export function getStaticSyllabusReport(subject: Subject, board: "ICSE" | "ISC"): SyllabusReport {
  const isIcse = board === "ICSE";
  const name = subject.name;
  const lowercase = name.toLowerCase();

  // Create standard template base
  const total = subject.baseTheoryMarks + subject.basePracticalMarks;
  const theory = subject.baseTheoryMarks;
  const practical = subject.basePracticalMarks;

  let syllabus: { unitName: string; weightage: string; topics: string[] }[] = [];
  let breakdown: string[] = [];
  let duration = isIcse ? (lowercase.includes("math") || lowercase.includes("sci") ? "2.5 Hours" : "2 Hours") : "3 Hours";
  let sections: { name: string; marks: string; compulsory: boolean; description: string }[] = [];
  let overallStructure = "";
  let expertTips: string[] = [];

  // Content generation depending on details
  if (lowercase.includes("math")) {
    syllabus = [
      {
        unitName: isIcse ? "Commercial Mathematics" : "Relations and Functions",
        weightage: isIcse ? "12 Marks" : "10 Marks",
        topics: isIcse 
          ? ["Goods and Services Tax (GST) - calculations on tax inputs/outputs.", "Banking: Recurring Deposit Accounts interest formulas.", "Shares and Dividends: Market value, nominal value, dividend yield calculations."]
          : ["Relations and Functions: Types of relations, inverse trigonometric functions.", "Binary Operations and composite properties."]
      },
      {
        unitName: isIcse ? "Algebra Core" : "Algebra & Calculus",
        weightage: isIcse ? "25 Marks" : "32 Marks",
        topics: isIcse
          ? ["Linear Inequations: solving sets on Number Line.", "Quadratic Equations in one variable.", "Matrices: order, transposition, operations.", "Arithmetic (AP) and Geometric (GP) progressions."]
          : ["Matrices and Determinants: properties, Cramer's Rule, Matrix Inverse.", "Calculus: Limits, Continuity, Derivatives, Integration by parts & substitution."]
      },
      {
        unitName: isIcse ? "Geometry & Trigonometry" : "Vectors & Three-Dimensional Geometry",
        weightage: isIcse ? "18 Marks" : "16 Marks",
        topics: isIcse
          ? ["Similarity: axioms, map scales.", "Circles: chord and tangent properties, cyclic quadrillaterals.", "Trigonometric identities: proving statements, heights and distances problems."]
          : ["Vectors: dot and cross products, scalar triple product.", "3D Geometry: direction cosines, short distance between skew lines."]
      },
      {
        unitName: isIcse ? "Mensuration & Coordinate Geometry" : "Probability & Linear Programming",
        weightage: isIcse ? "15 Marks" : "12 Marks",
        topics: isIcse
          ? ["Coordinate Geometry: reflection, section formula, equation of straight line.", "Mensuration: volume and surface area of cylinder, cone, sphere & hemispheres."]
          : ["Probability: Bayes' theorem, binomial distribution.", "Linear Programming (LPP): graphical optimization mapping."]
      },
      {
        unitName: "Statistics & Probability",
        weightage: isIcse ? "10 Marks" : "10 Marks",
        topics: isIcse
          ? ["Measures of Central Tendency: Mean, Median, Mode.", "Ogive Graphs: plotting cumulative frequency curves.", "Simple Probability events."]
          : ["Section B/C options: Application of integrals or Commercial mathematics regression."]
      }
    ];

    breakdown = [
      `Section A Written Assessment (${theory} Marks): Comprehensive evaluation of mathematical reasoning, accuracy, and proofs.`,
      `Internal Project Work (${practical} Marks): Practical mapping of planning commissions, banking sheets, or statistical surveys.`,
      "External Evaluation: Projects co-graded co-operatively by external visiting examiners nominated by the CISCE council."
    ];

    sections = [
      {
        name: "Section A",
        marks: "40",
        compulsory: true,
        description: "Standard conceptual questions, proofs, and MCQs requiring fast computations."
      },
      {
        name: "Section B",
        marks: "40",
        compulsory: false,
        description: "Analytical problems detailing Coordinate geometry, Trigonometry, or Calculus. Choose 4 out of 7 questions."
      }
    ];

    overallStructure = "All workings, rough drafts, and algebraic proof steps must be shown alongside main solutions. Drawing instruments (compass, ruler) must be used where appropriate.";
    
    expertTips = [
      "Keep standard algebraic identities and formulas on a separate cheat sheet and revise daily.",
      "In Section B, spend the first 5 minutes choosing the 4 questions that you are most confident to score full marks on.",
      "Work out textbook examples carefully — CISCE often frames direct questions from standard exercises.",
      "Solve at least 5 previous year question papers under strict time constraints to master Section B speed."
    ];
  } 
  else if (lowercase.includes("physics") || lowercase.includes("science")) {
    syllabus = [
      {
        unitName: isIcse ? "Force, Work, Power and Energy" : "Electrostatics & Current Electricity",
        weightage: isIcse ? "16 Marks" : "15 Marks",
        topics: isIcse
          ? ["Moment of a force and equilibrium conditions.", "Center of gravity, Simple machines (pulleys, levers).", "Kinetic & potential energy conversion, Law of conservation of energy."]
          : ["Coulomb's Law, Electric Potential and Capacitors.", "Ohm's Law, Kirchhoff's circuit rules, Wheatstone bridge, Potentiometers."]
      },
      {
        unitName: isIcse ? "Light and Wave Optics" : "Magnetic Effects & Electromagnetic Induction",
        weightage: isIcse ? "18 Marks" : "16 Marks",
        topics: isIcse
          ? ["Refraction at plane surfaces: laws, refractive index.", "Lenses: image formation, convex and concave characteristics.", "Electromagnetic Spectrum: properties and scattered warnings."]
          : ["Biot-Savart Law, Ampere's Law, force on moving charges in magnetic fields.", "Electromagnetic induction: Faraday's laws, Lenz's Law, AC Generator & Transformers."]
      },
      {
        unitName: isIcse ? "Sound and Waves" : "Optics & Electromagnetic Waves",
        weightage: isIcse ? "12 Marks" : "18 Marks",
        topics: isIcse
          ? ["Reflection of sound waves: echo equations, acoustic reverberation.", "Natural, forced, and resonant vibrations.", "Loudness, pitch, and quality features of sound waves."]
          : ["Refraction on spherical lenses, optical instruments (microscopes, telescopes).", "Wave Optics: Young's double slit interference, Huygen's principle."]
      },
      {
        unitName: isIcse ? "Electricity and Magnetism" : "Dual Nature of Matter & Modern Physics",
        weightage: isIcse ? "14 Marks" : "12 Marks",
        topics: isIcse
          ? ["Ohm's Law, parallel and series household circuits.", "Heating effects of current, electric power formulas.", "Electromagnetism: solenoid power fields, electromagnetic deflection."]
          : ["Photoelectric effect, Einstein's equation, De Broglie waves.", "Atomic structures: Bohr's model, energy levels, and hydrogen spectrum."]
      },
      {
        unitName: isIcse ? "Heat & Calorimetry" : "Semiconductor Electronic Devices",
        weightage: isIcse ? "10 Marks" : "9 Marks",
        topics: isIcse
          ? ["Specific heat capacity equations.", "Calorimeter physics, state changes, latent heat of fusion calculations."]
          : ["Energy bands in solids, intrinsic vs extrinsic semiconductors.", "P-N Junction diode, rectifiers, and simple logic gates."]
      },
      {
        unitName: isIcse ? "Modern & Nuclear Physics" : "Practical Evaluation Guidelines",
        weightage: isIcse ? "10 Marks" : "30 Marks",
        topics: isIcse
          ? ["Radioactivity: alpha, beta, gamma emissions.", "Nuclear fission and fusion: mass-energy equivalence equations."]
          : ["Laboratory practical logbook maintenance.", "Demonstrating electrical resistances, focal lengths, and spectrometer alignments."]
      }
    ];

    breakdown = [
      `Theory Examination (${theory} Marks): Evaluates understanding of principles, derivations, and mathematical numeric solving.`,
      `Practical / Laboratory Lab Work (${practical} Marks): Performing experiments, recording observations, drawing ray diagrams, and plotting graph coordinates.`,
      "Viva-Voce Exam: Oral questioning by external evaluators to confirm conceptual understanding."
    ];

    sections = [
      {
        name: "Section A",
        marks: isIcse ? "40" : "35",
        compulsory: true,
        description: "Direct definitions, objective MCQs, simple conceptual reasoning, and short formulas."
      },
      {
        name: "Section B",
        marks: isIcse ? "40" : "35",
        compulsory: false,
        description: "Complex derivations, multi-step numericals, ray-tracing and circuit setups. Choose Section B questions freely."
      }
    ];

    overallStructure = "All major physical constants (e.g. charge of electron, speed of light) are printed on the front cover. SI units must be strictly specified for all calculated final outputs.";

    expertTips = [
      "Pay massive attention to Units. Write physical values with correct SI denominations to avoid losing fractional marks.",
      "Practice drawing neat, clean ray diagrams using sharp pencils. Arrows indicating the direction of light are strictly compulsory.",
      "Deduce derivations step-by-step. Don't skip intermediate equations because examiners grade on a stepwise basis.",
      "Solve at least 15 numeric problems daily from Calorimetry, Optics, and Ohm's Law circuits."
    ];
  }
  else if (lowercase.includes("chemistry") || lowercase.includes("chem")) {
    syllabus = [
      {
        unitName: "Physical Chemistry Foundations",
        weightage: isIcse ? "25 Marks" : "25 Marks",
        topics: isIcse
          ? ["Periodic Table properties: ionization energy, electron affinity, electronegativity.", "Chemical Bonding: electrovalent, covalent, coordinate bonds, structure diagrams."]
          : ["Solutions: colligative properties, Raoult's law, elevation of boiling point.", "Electrochemistry: Nernst equation, Kohlrausch's law, Faraday's electrolysis laws.", "Chemical Kinetics: rate laws, order of reaction, activation energy."]
      },
      {
        unitName: isIcse ? "Acids, Bases and Study of Salts" : "Inorganic Coordination Compounds",
        weightage: isIcse ? "15 Marks" : "15 Marks",
        topics: isIcse
          ? ["pH scale properties.", "Preparation of normal and acid salts.", "Analytical Chemistry: actions of ammonium and sodium hydroxide on societal cations."]
          : ["d and f-block transition metals: properties, lanthanide contraction.", "Coordination Compounds: IUPAC naming rules, Werner's theory, isomerism basics."]
      },
      {
        unitName: isIcse ? "Mole Concept & Stoichiometry" : "Organic Chemistry Nomenclature & Carbonyls",
        weightage: isIcse ? "12 Marks" : "22 Marks",
        topics: isIcse
          ? ["Gay-Lussac's Law of combining volumes.", "Avogadro's Law, vapor density conversions.", "Empirical and molecular chemical formulas."]
          : ["Haloalkanes & Haloarenes, Alcohols, Phenols, and Ethers.", "Aldehydes, Ketones, and Carboxylic Acids: structures, aldol condensation mechanisms."]
      },
      {
        unitName: isIcse ? "Electrolysis & Metallurgy" : "Organic Nitrogen Compounds & Biomolecules",
        weightage: isIcse ? "18 Marks" : "8 Marks",
        topics: isIcse
          ? ["Electrochemical series, anode/cathode processes.", "Extraction of Aluminum (Hall-Heroult process) & electrorefining copper.", "Alloys: composition of brass, bronze, duralumin."]
          : ["Amines & Diazonium Salts: synthetic reactions.", "Biomolecules: carbohydrates, proteins, nucleic acids (DNA/RNA) structure links."]
      },
      {
        unitName: isIcse ? "Study of Compounds" : "Laboratory Practical Projects",
        weightage: isIcse ? "10 Marks" : "30 Marks",
        topics: isIcse
          ? ["Industrial preparation and chemical properties of Hydrogen Chloride.", "Ammonia (Haber Process) and Nitric Acid (Ostwald Process).", "Sulfuric Acid: manufacture (Contact process)."]
          : ["Salt Analysis: identifying basic cations and acidic anions.", "Volumetric Analysis: Titrations (acid-base or redox KMnO4 processes)."]
      }
    ];

    breakdown = [
      `Theory Papers (${theory} Marks): Focuses on chemical equations, periodic trends, industrial manufactures, and physical calculations.`,
      `Practical Portfolios (${practical} Marks): Titrations, qualitative salt testing (cations/anions identification worksheets), and project books.`,
      "Internal Record Assessment: Regular lab performance sheet records."
    ];

    sections = [
      {
        name: "Section A",
        marks: isIcse ? "40" : "35",
        compulsory: true,
        description: "Periodic table trends, structural diagrams, balanced equation setups, and MCQs."
      },
      {
        name: "Section B",
        marks: isIcse ? "40" : "35",
        compulsory: false,
        description: "Industrial flows, conversion reactions, stoichiometric mole numericals, and mechanism proofs."
      }
    ];

    overallStructure = "All chemical equations must be fully balanced. State-symbols (gas, solid, liquid, precipitate arrow) must be annotated to earn highest scores in conversions.";

    expertTips = [
      "Keep a separate notebook for Organic Conversions. Revise reaction conditions (catalysts, temp) every morning.",
      "In Salt Analysis, write exact observations first (e.g. 'dirty green precipitate soluble in excess') followed by chemical equations.",
      "Do not make mistakes in writing the IUPAC names. Memorize the priorities of functional carbon rings.",
      "Balanced equations are the heart of chemistry. An unbalanced equation receives exactly 0 marks."
    ];
  }
  else if (lowercase.includes("biology") || lowercase.includes("bio")) {
    syllabus = [
      {
        unitName: isIcse ? "Basic Biology & Cell Division" : "Reproduction Systems",
        weightage: isIcse ? "12 Marks" : "14 Marks",
        topics: isIcse
          ? ["Structure of chromosomes: chromatin, DNA molecule.", "Cell Division: Mitosis cell stages (Karyokinesis, Cytokinesis) vs Meiosis."]
          : ["Sexual reproduction in flowering plants: microsporogenesis, double fertilization.", "Human Reproduction: anatomy, gametogenesis, menstrual cycle, embryogenesis."]
      },
      {
        unitName: isIcse ? "Plant Physiology" : "Genetics and Molecular Evolution",
        weightage: isIcse ? "18 Marks" : "20 Marks",
        topics: isIcse
          ? ["Absorption by Roots: osmosis, turgidity, plasmolysis.", "Transpiration: factors, potometer measurements, guttation.", "Photosynthesis: light reaction (photophosphorylation) and dark reaction (Calvin cycle)."]
          : ["Mendelian Inheritance: monohybrid and dihybrid crosses, sex linkages.", "Molecular Basis of Inheritance: DNA replication, transcription, translation (genetic codes).", "Evolution theories: Darwinism, Lamarckism, modern synthesis."]
      },
      {
        unitName: isIcse ? "Human Anatomy and Physiology" : "Biology and Human Welfare",
        weightage: isIcse ? "25 Marks" : "10 Marks",
        topics: isIcse
          ? ["Circulatory System: heart structures, blood groups, tissue fluid.", "Excretory System: structure of nephron, urine formation steps.", "Nervous System: brain lobes, reflex arcs, structure of eye and ear.", "Endocrine System: hormones of pituitary, thyroid, pancreas, adrenal."]
          : ["Health and Disease: immunology, common bacterial and viral pathogens.", "Microbes in household and industrial processing, sewage treatment."]
      },
      {
        unitName: isIcse ? "Population & Pollutions" : "Biotechnology & Ecology",
        weightage: isIcse ? "15 Marks" : "16 Marks",
        topics: isIcse
          ? ["Demography: population explosion and control indicators.", "Pollution: sources, greenhouse effects, ozone layer damage, and mitigation strategies."]
          : ["Recombinant DNA Technology: cloning vectors, PCR, agarose electrophoresis.", "BT Crops, insulin production, gene therapies.", "Ecosystems, biogeochemical cycles, biodiversity hot-spots."]
      },
      {
        unitName: "Practical Evaluation Work",
        weightage: isIcse ? "10 Marks" : "30 Marks",
        topics: isIcse
          ? ["Plant specimen tissue sheets.", "Human skeleton diagrams, reflex action calculations, and internal lab tests."]
          : ["Dissection studies (flower parts or virtual skeleton structures).", "Spotting of slide specimens, slide preparations, physiological charts."]
      }
    ];

    breakdown = [
      `Theory Papers (${theory} Marks): Focuses on conceptual biological diagrams, systemic flows, and precise terminology.`,
      `Practical Project Records (${practical} Marks): Maintaining biology journals, physiological charts, model spotting sheets, and field files.`,
      "Oral Exam: Viva assessments based on project submissions."
    ];

    sections = [
      {
        name: "Section A",
        marks: isIcse ? "40" : "35",
        compulsory: true,
        description: "Biological labeling, matching terms, definitions, crossword paths, and MCQs."
      },
      {
        name: "Section B",
        marks: isIcse ? "40" : "35",
        compulsory: false,
        description: "Reasoning and conceptual 'give reasons', long descriptions, and structural labeled drawings. Choose 4 out of 6 questions."
      }
    ];

    overallStructure = "All biological diagrams must be sketched with sharp pencils and labeled in clear blocked capitals. Arrows must touch the exact organ or tissue layer being indicated.";

    expertTips = [
      "Use precise biological keywords (e.g. 'turgid', 'hemolysis', 'nephron') rather than vague general text to secure full marks.",
      "Before drawing a diagram, spend 10 seconds determining spacing on your solution sheet. Use sharp colors or clean shading.",
      "Differentiate biological concepts under strict columnar headings to make it highly readable for the examiner.",
      "Solve the structural/labeled questions of previous years as they are highly repetitive."
    ];
  }
  else if (lowercase.includes("english") || lowercase.includes("literature")) {
    syllabus = [
      {
        unitName: "English Language: Composition",
        weightage: "20 Marks",
        topics: ["Composition writing: Descriptive, Narrative, Argumentative, Reflective, or Short Story.", "Word limits: 300-350 words matching stylistic guidelines."]
      },
      {
        unitName: "Formal and Informal Letters",
        weightage: "10/15 Marks",
        topics: ["Letter drafting: Layout, salutation, body format, official register.", "Persuasive writing on community matters."]
      },
      {
        unitName: "Notice and Email Writing",
        weightage: "10 Marks",
        topics: ["Notice writing: Creative titles, specific dates, times, and venue outlines.", "Email construction: Recipient address blocks, professional subject, structural agenda."]
      },
      {
        unitName: "Unseen Comprehension Passage",
        weightage: "20 Marks",
        topics: ["Vocabulary check: Synonyms, sentence constructions.", "Direct textual answers, summary drafting with grid box limits."]
      },
      {
        unitName: "Drama: Shakespeare Study",
        weightage: "25 Marks",
        topics: ["Analysis of major plays (Julius Caesar, Macbeth, or Tempest).", "Theme tracing: Royalty, betrayal, loyalty, power corridors.", "Extract-based reference-to-context textual questions."]
      },
      {
        unitName: "Short Stories & Poetry Anthologies",
        weightage: "30 Marks",
        topics: ["Prism Short Stories and Rhapsody Poetry interpretations.", "Character analyses, literary devices (metaphors, alliteration, irony)."]
      }
    ];

    breakdown = [
      `Language Paper 1 (${theory} Marks): External written paper analyzing compositional flow, structural format, and correct grammatical applications.`,
      `Literature Paper 2 (${theory} Marks): Analysis of dramatic texts, emotional themes of poetry, and prose storylines.`,
      "Listening & Speaking Oral Skills (20 Marks): Conversational listening tasks, reading tests, and impromptu speeches graded internally."
    ];

    sections = [
      {
        name: "Paper 1 (Language)",
        marks: "80",
        compulsory: true,
        description: "All questions compulsory. Includes compositional essays, notices, emails, comprehensions, and direct tense grammars."
      },
      {
        name: "Paper 2 (Literature)",
        marks: "80",
        compulsory: true,
        description: "Section A contains extract MCQs. Section B asks dramatic and narrative descriptive questions. Solve chosen literary texts."
      }
    ];

    overallStructure = "The word limit is highly critical for comprehension summaries. Correct formatting layouts for notices, emails, and letterheads carry separate key marks.";

    expertTips = [
      "In summary writing, strictly follow the grid box of 50 words. Do not let your final summary spill over even by a single word.",
      "Memorize exact literary quotes from the Shakespearean plays to make your literature descriptive sheets highly sophisticated.",
      "Check letter head formulas. An incorrect informal salutation, date placement, or closing signature costs immediate structural marks.",
      "Avoid spelling and basic subject-verb agreement errors. Examiners look deeply at grammatical syntax correctness."
    ];
  }
  else if (lowercase.includes("computer") || lowercase.includes("applications") || lowercase.includes("science")) {
    syllabus = [
      {
        unitName: "Object-Oriented Programming Fundamentals",
        weightage: "15 Marks",
        topics: ["Principles of OOPs: abstraction, encapsulation, inheritance, polymorphism.", "Class as a blueprint and objects as real-world entities."]
      },
      {
        unitName: "Elementary Java & Variables",
        weightage: "10 Marks",
        topics: ["Data types, variables, arithmetic operators.", "Decision controls: if-else, switch-case, default fallbacks."]
      },
      {
        unitName: "Iteration & Functions",
        weightage: "20 Marks",
        topics: ["Loops in Java: while, for, do-while structures, nested loops.", "User-defined functions: recursive calls, method overloading, scopes."]
      },
      {
        unitName: "Arrays & String Handling",
        weightage: "25 Marks",
        topics: ["Single and double dimensional arrays (1D/2D).", "Sorting algorithms: Bubble sort, Selection sort.", "Searching: Linear and Binary search.", "String functions: charAt(), substring(), indexOf(), compareTo(), equals()."]
      },
      {
        unitName: isIcse ? "Class & Constructor Designs" : "Boolean Algebra & Data Structures",
        weightage: isIcse ? "30 Marks" : "30 Marks",
        topics: isIcse
          ? ["Constructors: parameterization, default values, garbage collection.", "This keyword, static variables and scopes."]
          : ["Boolean Algebra: logic expressions, K-Maps simplification, Boolean laws.", "Data Structures: Stacks, Queues, Single Linked Lists implementation in Class coding."]
      }
    ];

    breakdown = [
      `Theory Papers (${theory} Marks): Basic concepts, tracing variable states, dry runs, and logical code generation.`,
      `Practical Lab Examination (${practical} Marks): Programming on an IDE (BlueJ or Eclipse), executing test setups, and printing output sheets.`,
      "External Lab Grading: Graded co-operatively by external software engineers or visiting professors."
    ];

    sections = [
      {
        name: "Section A",
        marks: "40",
        compulsory: true,
        description: "Dry run traces, syntax check MCQs, finding infinite loops, error identification, and short Boolean conversions."
      },
      {
        name: "Section B",
        marks: "60",
        compulsory: false,
        description: "Full Java Class definition codes. Choose 4 programming tasks. Include variable descriptions."
      }
    ];

    overallStructure = "A Variable Description Table (VDT) specifying data type, name, and usage description is strictly mandatory at the end of each Java program coding.";

    expertTips = [
      "Include clear code comments and a comprehensive Variable Description Table to ensure 100% full marks in practical codes.",
      "Dry-run your nested loops step-by-step on paper before final execution to avoid off-by-one errors in arrays.",
      "Master String parsing methods thoroughly — they form the core of Section B programming tasks.",
      "Ensure brackets are closed. Indentation improves readability and reduces examiner friction."
    ];
  }
  else if (lowercase.includes("robotics") || lowercase.includes("artificial")) {
    syllabus = [
      {
        unitName: "Introduction to Robotics Fundamentals",
        weightage: "20 Marks",
        topics: [
          "Laws of Robotics (Asimov's laws) and ethical considerations in AI.",
          "Anatomy of modern robots: links, joints, degrees of freedom, and workspace envelopes.",
          "Actuators: DC motor, servo motor, stepper motor, and pneumatic actuators."
        ]
      },
      {
        unitName: "Sensor Technology & Feedback Loops",
        weightage: "20 Marks",
        topics: [
          "Sensors: ultrasonic sensors, infrared (IR) proximity detectors, gyro and accelerometers, LiDAR, and camera vision tools.",
          "Feedback loop dynamics: open-loop vs. closed-loop control setups.",
          "Introduction to PID controllers and basic signal processing."
        ]
      },
      {
        unitName: "Microcontrollers & Embedded C/C++ Programming",
        weightage: "25 Marks",
        topics: [
          "Microcontrollers: architecture of Arduino/Raspberry Pi boards, GPIO pins, and digital/analog interfaces.",
          "Embedded programming basics: variables, routines, interfacing sensors, and motor driver shields.",
          "Basic serial communication: UART, I2C, and SPI protocols."
        ]
      },
      {
        unitName: "Artificial Intelligence & Search Algorithms",
        weightage: "15 Marks",
        topics: [
          "Introduction to AI: rational agents, states, and action workspaces.",
          "Heuristic Search: breadth-first (BFS), depth-first (DFS), and A* algorithm logics.",
          "Machine learning fundamentals: supervised, unsupervised, and reinforcement paradigms."
        ]
      },
      {
        unitName: "Robot Autonomous Navigation & Path Planning",
        weightage: "20 Marks",
        topics: [
          "SLAM (Simultaneous Localization and Mapping) basics.",
          "Collision avoidance algorithms and reactive navigation grids.",
          "Project implementation: autonomous line follower, maze solver, and human detector bots."
        ]
      }
    ];

    breakdown = [
      `Theory Papers (${theory} Marks): Fundamental robot design equations, logic gates, AI search patterns, and pseudo-codes.`,
      `Practical Project Implementation (${practical} Marks): Designing physical models, wiring breadboards, and flashing embedded firmware codes.`,
      "External Evaluation: Demonstration of physical prototypes (Line Follower/Robot Arms) with operational logic grids."
    ];

    sections = [
      {
        name: "Section A",
        marks: "40",
        compulsory: true,
        description: "Covers joint conversions, logic queries, sensor descriptions, micro-controller architecture, and short AI algorithm outputs."
      },
      {
        name: "Section B",
        marks: "60",
        compulsory: false,
        description: "Long-form questions on state space graphs, inverse kinematics sketches, PID formulas, and full embedded C pseudocode programming blocks. Answer 4 of 6 questions."
      }
    ];

    overallStructure = "Circuit diagrams using correct ISO sensor/actuator schematic symbols and structured operational pseudo-codes are strictly mandatory for earning full marks.";

    expertTips = [
      "Draw clear circuit schematics with correct power, ground, and signal wiring lines to gain examiner visual points.",
      "Understand BFS and DFS state-space generation thoroughly - they are extremely high-scoring in Section B.",
      "Explain the exact logic of your SLAM or sensor filtration formulas in step-by-step numbered sentences.",
      "In embedded pseudocodes, remember to define state loop() and initialization setup() structures clearly."
    ];
  }
  else {
    // Elegant descriptive generic/fallback template based on Category name
    syllabus = [
      {
        unitName: `Unit I: Advanced Core Concepts of ${name}`,
        weightage: "20 Marks",
        topics: [`Introduction to theoretical foundations and principles of ${name}.`, "Evolution of contemporary paradigms and structural frameworks.", "Analysis of standard case laws, case studies, or diagnostic elements."]
      },
      {
        unitName: "Unit II: Operational Frameworks & Applications",
        weightage: "25 Marks",
        topics: ["Practical applications of core methodologies and calculations.", "System operations, industry workflows, or regional patterns.", "Strategic comparisons between alternative structural sets."]
      },
      {
        unitName: "Unit III: Research and Policy Audits",
        weightage: "20 Marks",
        topics: ["Current regulations, international standards, or socio-economic aspects.", "Data models, graphical tracking, or detailed analytical reasoning.", "Case audits and local adaptations in modern sectors."]
      },
      {
        unitName: "Unit IV: Emerging Paradigms & Industry Focus",
        weightage: "15 Marks",
        topics: ["Technical integrations, sustainability impacts, and digitalization.", "Strategic options, future scopes, and advanced diagnostics.", "Analysis of historical curves and trend transformations."]
      }
    ];

    breakdown = [
      `Written Board Exam (${theory} Marks): Evaluation on systematic definitions, structured explanations, cases, or diagrams.`,
      `Internal Project Audits (${practical} Marks): Hand-made scrap projects, surveys, field logs, or laboratory files verified at the school levels.`,
      "Council Guidelines Compliance check: Verified by external visiting examiners."
    ];

    sections = [
      {
        name: "Section A (Objective)",
        marks: isIcse ? "40" : "30",
        compulsory: true,
        description: "Includes multiple-choice MCQs, fast fill-in-blanks, definition matches, and true/false reasons."
      },
      {
        name: "Section B (Subjective)",
        marks: isIcse ? "40" : "50",
        compulsory: false,
        description: "Long-form analytical descriptions, comparisons, and structured problem essays. Choose 4 out of 6 questions."
      }
    ];

    overallStructure = "Clear tabular listings, structured paragraph points, and neat visual block sketches are highly recommended to earn maximum board scores.";

    expertTips = [
      `Read the CISCE past papers strictly to understand context and frequently repeating questions for ${name}.`,
      "Write neat bulleted answers rather than massive blocks of unformatted text to make grading easy.",
      "Check that your exam layout is well numbered according to the Board paper naming sections.",
      "Ensure neat handwriting, precise margins, and highlighted keyword terms."
    ];
  }

  return {
    title: name,
    board,
    grade: isIcse ? "Class 10" : "Class 12",
    totalMarks: total,
    markingScheme: {
      theoryMarks: theory,
      practicalMarks: practical,
      breakdown
    },
    questionPattern: {
      duration,
      sections,
      overallStructure
    },
    syllabus,
    expertTips
  };
}

