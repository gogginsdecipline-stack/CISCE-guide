"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  BookMarked,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lightbulb,
  Send,
  RefreshCw,
  Sliders,
  X,
  ChevronRight,
  GraduationCap,
  Clock,
  Sparkles,
  Calculator,
  HelpCircle,
  Layers,
  Check,
  Search,
  BookOpenCheck,
  Award,
  Calendar,
  ArrowRight,
  Compass,
  Download,
  ExternalLink,
  PlayCircle,
} from "lucide-react";
import { ICSE_CONFIG, ISC_CONFIG, Subject, BoardConfig, SyllabusReport, getStaticSyllabusReport } from "@/lib/boardData";
import { getSubjectResources, solveOptimalSubjectCombination } from "@/lib/resourcesData";

// Interfaces for UI state


interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
}

export default function Home() {
  // Tab states
  const [activeBoard, setActiveBoard] = React.useState<"ICSE" | "ISC">("ICSE");
  const currentConfig: BoardConfig = activeBoard === "ICSE" ? ICSE_CONFIG : ISC_CONFIG;

  // Selected subject for side panel detail view
  const [selectedSubject, setSelectedSubject] = React.useState<Subject | null>(null);

  // Filter and search
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string>("All");

  // Subject Planner Selections (subject IDs)
  const [selectedSubjectIds, setSelectedSubjectIds] = React.useState<string[]>([]);

  // Automatically select compulsory ones on load or tab change
  React.useEffect(() => {
    const compulsories = currentConfig.groups
      .flatMap((g) => g.subjects)
      .filter((s) => s.isCompulsory)
      .map((s) => s.id);
    setSelectedSubjectIds(compulsories);
  }, [activeBoard, currentConfig]);

  // AI syllabus detail fetching
  const [syllabusReports, setSyllabusReports] = React.useState<Record<string, SyllabusReport>>({});
  const [isLoadingSyllabus, setIsLoadingSyllabus] = React.useState(false);
  const [syllabusError, setSyllabusError] = React.useState<string | null>(null);

  // Active sub-tab inside the detail view drawer: "overview" | "syllabus" | "marking" | "questions" | "expert" | "chat" | "resources"
  const [drawerTab, setDrawerTab] = React.useState<"overview" | "syllabus" | "marking" | "questions" | "expert" | "chat" | "resources">("overview");

  // Guided Subject Combinations Advisor wizard states
  const [showAdvisorModal, setShowAdvisorModal] = React.useState(false);
  const [advisorStep, setAdvisorStep] = React.useState(1);
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>([]);
  const [selectedCareer, setSelectedCareer] = React.useState<string>("");
  const [advisorModalBoard, setAdvisorModalBoard] = React.useState<"ICSE" | "ISC">("ICSE");

  // Calendar states and countdown tracking
  const [calBoard, setCalBoard] = React.useState<"ICSE" | "ISC" | null>(null);
  const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, mins: 0 });

  React.useEffect(() => {
    const target = new Date("2027-02-15T09:00:00");
    const updateCountdown = () => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, mins: 0 });
        return;
      }
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft({ days, hours, mins });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // update every minute is optimal
    return () => clearInterval(interval);
  }, []);

  // Advisor Chat states
  const [chatLogs, setChatLogs] = React.useState<Record<string, ChatMessage[]>>({});
  const [advisorInput, setAdvisorInput] = React.useState("");
  const [isSendingMsg, setIsSendingMsg] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat when new messages arrive
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatLogs, selectedSubject, drawerTab]);

  // Handle subject choice toggle
  const toggleSubjectChoice = (subject: Subject) => {
    if (subject.isCompulsory) return; // Cannot toggle compulsory subjects
    setSelectedSubjectIds((prev) => {
      if (prev.includes(subject.id)) {
        return prev.filter((id) => id !== subject.id);
      } else {
        // Enforce max selections based on global maximums to prevent overflow
        const totalInGroup = prev.filter((id) =>
          currentConfig.groups.flatMap((g) => g.subjects).find((s) => s.id === id)?.group === subject.group
        ).length;
        return [...prev, subject.id];
      }
    });
  };

  // Run official board-level curriculum audits on user selection
  const validatePlanner = () => {
    const selectedSubjects = currentConfig.groups
      .flatMap((g) => g.subjects)
      .filter((s) => selectedSubjectIds.includes(s.id));

    const totalCount = selectedSubjects.length;

    if (activeBoard === "ICSE") {
      // ICSE validation rules:
      // Group I compulsory: English, Second Language, HCG (always present, count = 3)
      const group1Count = selectedSubjects.filter((s) => s.group === "Group I").length;
      // Group II: must choose 2 or 3
      const group2Count = selectedSubjects.filter((s) => s.group === "Group II").length;
      // Group III: must choose exactly 1
      const group3Count = selectedSubjects.filter((s) => s.group === "Group III").length;

      const group2Valid = group2Count === 2 || group2Count === 3;
      const group3Valid = group3Count === 1;
      const lengthValid = totalCount === 7 || (group2Count === 3 && group3Count === 1 && totalCount === 7); // Usually exactly 7 subjects total for ICSE evaluation (Group 1 contains 3 core sheets)

      const errors: string[] = [];
      const successes: string[] = [];

      successes.push("Group I (Compulsory) complete (English, Language, H.C.G.)");

      if (group2Valid) {
        successes.push(`Group II: Correct selection of ${group2Count} subjects.`);
      } else {
        errors.push(`Group II (Electives): You have selected ${group2Count} subjects. Must select exactly 2 or 3.`);
      }

      if (group3Valid) {
        successes.push("Group III (Vocational): Correct selection of 1 subject.");
      } else {
        errors.push(`Group III (Vocational): You have selected ${group3Count} subjects. Must select exactly 1.`);
      }

      const isValid = group2Valid && group3Valid && totalCount === 7;

      return {
        isValid,
        totalCount,
        requiredCount: 7,
        groupBreakdowns: {
          "Group I": group1Count,
          "Group II": group2Count,
          "Group III": group3Count,
        },
        errors,
        successes,
      };
    } else {
      // ISC Class 12 validation rules:
      // English is compulsory (count = 1)
      const compulsoryCount = selectedSubjects.filter((s) => s.group === "Compulsory").length;
      const electivesCount = selectedSubjects.filter((s) => s.group !== "Compulsory").length;

      const errors: string[] = [];
      const successes: string[] = [];

      successes.push("Compulsory English is selected.");

      const electivesValid = electivesCount >= 3 && electivesCount <= 5;

      if (electivesValid) {
        successes.push(`Electives: Valid selection of ${electivesCount} subjects.`);
      } else {
        errors.push(`Electives: You selected ${electivesCount} subjects. Must choose between 3 and 5 elective subjects.`);
      }

      const isValid = compulsoryCount === 1 && electivesValid;
      const totalRequiredString = "4 to 6 total including English";

      return {
        isValid,
        totalCount,
        requiredCount: "4 - 6",
        groupBreakdowns: {
          Compulsory: compulsoryCount,
          Electives: electivesCount,
        },
        errors,
        successes,
      };
    }
  };

  const auditReport = validatePlanner();

  // Async trigger to fetch fully structured curriculum details from Gemini
  const fetchSubjectSyllabus = async (subject: Subject) => {
    const cacheKey = `${activeBoard}-${subject.id}`;
    if (syllabusReports[cacheKey]) {
      // Already cached, just load it
      setDrawerTab("syllabus");
      return;
    }

    setIsLoadingSyllabus(true);
    setSyllabusError(null);
    setDrawerTab("overview");

    try {
      const response = await fetch("/app/api/subject-detail" === "/app/api/subject-detail" ? "/api/subject-detail" : "/api/subject-detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          board: activeBoard,
          subjectName: subject.name,
          className: activeBoard === "ICSE" ? "10" : "12",
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to fetch AI Syllabus Details at this moment. Please check server connections.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setSyllabusReports((prev) => ({
        ...prev,
        [cacheKey]: data,
      }));
      setDrawerTab("syllabus"); // auto navigate to official syllabus once loaded
    } catch (err: any) {
      console.error(err);
      setSyllabusError(err.message || "Failed to fetch details.");
    } finally {
      setIsLoadingSyllabus(false);
    }
  };

  // Sends student inquiry to Gemini Advisor Chat
  const sendAdvisorMessage = async () => {
    if (!advisorInput.trim() || !selectedSubject) return;

    const cacheKey = `${activeBoard}-${selectedSubject.id}`;
    const studentQueryObj = advisorInput.trim();
    setAdvisorInput("");

    // Initialize conversation logs if empty
    const currentLogs = chatLogs[cacheKey] || [
      {
        id: "welcome",
        role: "model",
        content: `Welcome to the **${selectedSubject.name}** AI academic workspace. Ask me anything about this syllabus! I can draft custom speed timetables, render practice sample questions, explain question splits, or explain any complex topics right away.`,
      },
    ];

    const updatedLogs = [
      ...currentLogs,
      { id: Date.now().toString(), role: "user" as const, content: studentQueryObj },
    ];

    setChatLogs((prev) => ({ ...prev, [cacheKey]: updatedLogs }));
    setIsSendingMsg(true);

    try {
      const syllabusContext = syllabusReports[cacheKey] || null;

      const response = await fetch("/api/ask-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          board: activeBoard,
          subjectName: selectedSubject.name,
          className: activeBoard === "ICSE" ? "10" : "12",
          messages: updatedLogs,
          syllabusContext: syllabusContext,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to contact AI Advisor. Please try again.");
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      setChatLogs((prev) => ({
        ...prev,
        [cacheKey]: [
          ...updatedLogs,
          { id: (Date.now() + 1).toString(), role: "model" as const, content: result.text },
        ],
      }));
    } catch (err: any) {
      console.error(err);
      setChatLogs((prev) => ({
        ...prev,
        [cacheKey]: [
          ...updatedLogs,
          {
            id: (Date.now() + 1).toString(),
            role: "model" as const,
            content: `⚠️ Sorry, I encountered a connection issue: ${err.message}. Please verify your API key configurations or retry.`,
          },
        ],
      }));
    } finally {
      setIsSendingMsg(false);
    }
  };

  // Get active cached report if available, else fallback to standard static details
  const activeReportKey = selectedSubject ? `${activeBoard}-${selectedSubject.id}` : "";
  const aiReport = selectedSubject ? syllabusReports[activeReportKey] : undefined;
  const currentSyllabusReport: SyllabusReport | undefined = React.useMemo(() => {
    if (!selectedSubject) return undefined;
    if (aiReport) return aiReport;
    return getStaticSyllabusReport(selectedSubject, activeBoard);
  }, [selectedSubject, aiReport, activeBoard]);

  // Derive all unique categories under the chosen board to display in quick filter
  const categories = ["All", ...Array.from(new Set(currentConfig.groups.flatMap((g) => g.subjects).map((s) => s.category)))];

  // List of filtered subjects based on categorization and typing query
  const filteredSubjects = currentConfig.groups
    .flatMap((g) => g.subjects)
    .filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.code.includes(searchQuery);
      const matchesCategory = activeCategory === "All" || s.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

  // Calculate stats
  const totalStandardCount = currentConfig.groups.flatMap((g) => g.subjects).length;

  return (
    <div className={`min-h-screen transition-all duration-700 ${selectedSubject ? "bg-slate-950 text-white" : "bg-[#f5f7fa] text-slate-800"} font-sans selection:bg-amber-100 selection:text-[#0c2340] pb-12 overflow-x-hidden relative`}>
      {/* Dynamic Immersive Background Photo of SELECTED SUBJECT */}
      <AnimatePresence>
        {selectedSubject && (
          <motion.div
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 0.52, scale: 1 }}
            exit={{ opacity: 0, scale: 1.12 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            className="fixed inset-0 z-0 pointer-events-none"
          >
            <img
              src={getSubjectTheme(selectedSubject).imageUrl}
              alt=""
              className="w-full h-full object-cover brightness-[0.65] saturate-[1.25]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950" />
            <div className={`absolute inset-0 opacity-45 mix-blend-color bg-gradient-to-br ${getSubjectTheme(selectedSubject).gradientFrom} ${getSubjectTheme(selectedSubject).gradientTo}`} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upper Subtle Academic Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(12,35,64,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(12,35,64,0.03)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none h-128 z-0" />
      {!selectedSubject && (
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#e3ecf5]/40 to-transparent pointer-events-none z-0" />
      )}

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 z-10"
      >
        
        {/* Navigation Banner / Dashboard Header */}
        <header className={`mb-6 border rounded-2xl py-4 flex flex-col md:flex-row md:items-center justify-between px-5 sm:px-8 gap-4 shadow-sm transition-all duration-500 ${
          selectedSubject 
            ? "bg-slate-900/90 border-slate-800 text-white" 
            : "bg-white border-[#d6e1ee] text-slate-800"
        }`}>
          <div className="flex items-center gap-4">
            {/* Actual Official Logo Image of CISCE */}
            <div id="cisce-crest-container" className="relative group shrink-0">
              <svg 
                className="w-12 h-12 sm:w-14 sm:h-14 text-amber-500 drop-shadow-[0_2px_5px_rgba(12,35,64,0.15)] transition-transform duration-300 group-hover:scale-105" 
                viewBox="0 0 120 120" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Arc for the top text */}
                  <path id="text-path-top" d="M 14,60 A 46,46 0 0,1 106,60" fill="none" />
                </defs>

                {/* Outer Ring & Royal Background */}
                <circle cx="60" cy="60" r="56" fill="#0a2540" stroke="#cca43b" strokeWidth="2.5" />
                <circle cx="60" cy="60" r="46" fill="#113054" stroke="#eccd71" strokeWidth="1" />
                
                {/* Curved Text Path */}
                <text fill="#eccd71" fontSize="5.8" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.3">
                  <textPath href="#text-path-top" startOffset="50%" textAnchor="middle">
                    COUNCIL FOR THE INDIAN SCHOOL CERTIFICATE EXAMINATIONS
                  </textPath>
                </text>

                {/* Inner Crest Shield */}
                <path d="M 45,42 Q 60,42 75,42 Q 75,64 60,82 Q 45,64 45,42" fill="#081b2f" stroke="#cca43b" strokeWidth="1.5" strokeLinejoin="round" />
                
                {/* The Diya of Knowledge (Lamp) */}
                <path d="M 54,54 C 54,58 66,58 66,54 Z" fill="#cca43b" />
                <line x1="60" y1="54" x2="60" y2="58" stroke="#cca43b" strokeWidth="1.5" />
                <path d="M 56,58 L 64,58" stroke="#cca43b" strokeWidth="1.2" strokeLinecap="round" />
                
                {/* Burning Flame (Amber & Red Gradient style) */}
                <path d="M 60,53 C 57,51 57,44 60,39 C 63,44 63,51 60,53 Z" fill="#ef4444" />
                <path d="M 60,51 C 58.5,49.5 58.5,45.5 60,42 C 61.5,45.5 61.5,49.5 60,51 Z" fill="#f59e0b" />
                <circle cx="60" cy="48" r="1" fill="#ffffff" />
                
                {/* Open Book Representation */}
                <path d="M 49,60 C 53,58 57,60 60,62 L 60,72 C 57,70 53,68 49,70 Z" fill="#ffffff" stroke="#cca43b" strokeWidth="0.6" />
                <path d="M 71,60 C 67,58 63,60 60,62 L 60,72 C 63,70 67,68 71,70 Z" fill="#ffffff" stroke="#cca43b" strokeWidth="0.6" />
                <line x1="51" y1="63" x2="57" y2="65" stroke="#003366" strokeWidth="0.5" opacity="0.4" />
                <line x1="51" y1="66" x2="57" y2="68" stroke="#003366" strokeWidth="0.5" opacity="0.4" />
                <line x1="63" y1="65" x2="69" y2="63" stroke="#003366" strokeWidth="0.5" opacity="0.4" />
                <line x1="63" y1="68" x2="69" y2="66" stroke="#003366" strokeWidth="0.5" opacity="0.4" />

                {/* Bottom text banner / details inside shield */}
                <text x="60" y="80" fill="#cca43b" fontSize="4.5" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.4">
                  ESTD. 1958
                </text>

                {/* Decorative Stars */}
                <path d="M 23,60 Q 25,60 25,58 Q 25,60 27,60 Q 25,60 25,62 Q 25,60 23,60" fill="#cca43b" />
                <path d="M 97,60 Q 95,60 95,58 Q 95,60 93,60 Q 95,60 95,62 Q 95,60 97,60" fill="#cca43b" />
                
                {/* Outer Circular Label "NEW DELHI" on Bottom */}
                <text x="60" y="101" fill="#eccd71" fontSize="6.5" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.8">
                  NEW DELHI
                </text>
              </svg>
            </div>
            
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-[8px] sm:text-[9.5px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full font-mono shrink-0 ${
                  selectedSubject 
                    ? "bg-amber-400/10 text-amber-300 border border-amber-400/20" 
                    : "bg-[#0c2340]/10 text-[#0c2340] border border-[#0c2340]/15"
                }`}>Official Curriculum Registry</span>
              </div>
              <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className={selectedSubject ? "text-white" : "text-slate-900"}>CISCE Academic Companion</span>
                <span className="text-amber-500 font-extrabold bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded text-[10px] sm:text-xs select-none">Class {activeBoard === "ICSE" ? "X" : "XII"}</span>
              </h1>
            </div>
          </div>
          
          <div className="relative flex p-1 bg-[#f1f4f8] rounded-xl border border-slate-200/50 shadow-inner">
            <motion.button
              whileHover={{ scale: 1.04, y: -0.5 }}
              whileTap={{ scale: 0.96 }}
              id="icse-tab-btn"
              onClick={() => {
                setActiveBoard("ICSE");
                setSelectedSubject(null);
                setActiveCategory("All");
              }}
              className={`relative px-4 py-2 text-xs font-black rounded-lg transition-all duration-300 cursor-pointer z-10 ${
                activeBoard === "ICSE" ? "text-white" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {activeBoard === "ICSE" && (
                <motion.div
                  layoutId="board-active-pill"
                  className="absolute inset-0 bg-[#0c2340] rounded-lg shadow-sm z-[-1]"
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                />
              )}
              ICSE (Class X)
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, y: -0.5 }}
              whileTap={{ scale: 0.96 }}
              id="isc-tab-btn"
              onClick={() => {
                setActiveBoard("ISC");
                setSelectedSubject(null);
                setActiveCategory("All");
              }}
              className={`relative px-4 py-2 text-xs font-black rounded-lg transition-all duration-300 cursor-pointer z-10 ${
                activeBoard === "ISC" ? "text-white" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {activeBoard === "ISC" && (
                <motion.div
                  layoutId="board-active-pill"
                  className="absolute inset-0 bg-[#0c2340] rounded-lg shadow-sm z-[-1]"
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                />
              )}
              ISC (Class XII)
            </motion.button>
          </div>
        </header>

        {/* Top Bento Grid Row (Interactive Board Standards, Groups, and Compliance) */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6" id="bento-board-standards">
          {/* Card 1: Available Curriculum Overview (Bento Style) */}
          <div className="md:col-span-4 bg-[#0c2340] rounded-2xl p-5 text-white shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[160px]" id="bento-curriculum-overview">
            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <h3 className="text-amber-300 text-[10px] font-mono uppercase tracking-widest leading-none">Curriculum Scope</h3>
              </div>
              <div className="pt-2">
                <p className="text-xs font-semibold text-slate-300">CISCE Board Registry</p>
                <p className="text-3xl font-black tracking-tight mt-1 text-white flex items-center gap-1.5">
                  <span>{activeBoard === "ICSE" ? "14 Subjects" : "15 Subjects"}</span>
                  <span className="text-[10px] text-amber-400 border border-amber-500/35 px-2 py-0.5 rounded bg-amber-500/10 font-black tracking-tight">Active</span>
                </p>
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-slate-700/50 flex items-center justify-between font-mono text-[10px] text-slate-350">
              <div>
                Level: <span className="text-white font-bold">{activeBoard === "ICSE" ? "Class 10 (Secondary)" : "Class 12 (Higher)"}</span>
              </div>
              <div>
                Opt: <span className="text-amber-400 font-bold">{activeBoard === "ICSE" ? "Exactly 7" : "4 to 6"}</span>
              </div>
            </div>

            {/* Subtle background glow */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Card 2: Group & Stream Choice Rules (Bento Style) */}
          <div className="md:col-span-5 bg-white rounded-2xl border border-[#d6e1ee] p-5 shadow-xs flex flex-col justify-between min-h-[160px]" id="bento-group-rules">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-slate-950 font-black text-xs uppercase tracking-wider font-mono">
                  Subject Grouping & Choices
                </h4>
                <span className="text-[9px] bg-[#f0f4f9] text-[#0c2340] border border-[#d6e1ee] px-2 py-0.5 rounded font-bold uppercase">
                  {activeBoard === "ICSE" ? "Group A | B | C" : "Streams Matrix"}
                </span>
              </div>

              {activeBoard === "ICSE" ? (
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="bg-[#f0f4f9] border border-[#d6e1ee] rounded-xl p-2.5 text-center">
                    <p className="text-xs font-mono text-slate-400">Group I</p>
                    <p className="text-lg font-black text-slate-900 mt-0.5">3 / 3</p>
                    <p className="text-[8px] font-bold text-[#0c2340] uppercase mt-1">Syllabus Core</p>
                  </div>
                  <div className="bg-[#fcfdfc] border border-slate-100 rounded-xl p-2.5 text-center">
                    <p className="text-xs font-mono text-slate-400">Group II</p>
                    <p className="text-lg font-black text-slate-800 mt-0.5">2 | 3</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">Electives</p>
                  </div>
                  <div className="bg-[#fcfdfc] border border-slate-100 rounded-xl p-2.5 text-center">
                    <p className="text-xs font-mono text-slate-400">Group III</p>
                    <p className="text-lg font-black text-slate-800 mt-0.5">1 / 1</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">Vocational</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="bg-[#f0f4f9] border border-[#d6e1ee] rounded-xl p-2.5 text-center">
                    <p className="text-xs font-mono text-slate-400">Compulsory</p>
                    <p className="text-lg font-black text-slate-900 mt-0.5">1 / 1</p>
                    <p className="text-[8px] font-bold text-[#0c2340] uppercase mt-1">English</p>
                  </div>
                  <div className="bg-[#fcfdfc] border border-slate-100 rounded-xl p-2.5 text-center">
                    <p className="text-xs font-mono text-slate-400">Electives</p>
                    <p className="text-lg font-black text-slate-800 mt-0.5">3 to 5</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">Choose Subj</p>
                  </div>
                  <div className="bg-[#fcfdfc] border border-slate-100 rounded-xl p-2.5 text-center flex flex-col justify-center items-center font-mono text-[9px] text-slate-400">
                    <p className="font-extrabold text-[#0c2340]">Science</p>
                    <p>Commerce</p>
                    <p>Humanities</p>
                  </div>
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-500 leading-tight mt-3 bg-[#f8fafc] px-2.5 py-1.5 rounded-lg border border-slate-100 font-medium">
              {activeBoard === "ICSE" 
                ? "🌱 All 3 Group I core courses are compulsory. Choose 2-3 electives and exactly 1 vocational subject to total 7."
                : "🌱 English is compulsory. Select 3 to 5 additional electives from Science, Commerce, or Humanities stream groups."
              }
            </p>
          </div>

          {/* Card 3: Selection Compliance Status (Bento Style) */}
          <div className="md:col-span-3 bg-white rounded-2xl border border-[#d6e1ee] p-5 shadow-xs flex flex-col justify-between min-h-[160px]" id="bento-compliance-status">
            <div className="space-y-1">
              <h4 className="text-slate-400 text-[10px] font-mono uppercase tracking-widest leading-none">Course Progress</h4>
              <div className="pt-2 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900 leading-none">
                  {auditReport.totalCount}
                </span>
                <span className="text-slate-400 text-xs font-mono">
                  / {activeBoard === "ICSE" ? "7" : "4-6"} Selected
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {(() => {
                const currentCount = auditReport.totalCount;
                const targetCount = activeBoard === "ICSE" ? 7 : 4;
                const percentage = Math.min((currentCount / targetCount) * 100, 100);
                return (
                  <>
                    <div className="w-full bg-[#f1f4f8] h-2 rounded-full overflow-hidden border border-slate-200">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ease-out ${
                          auditReport.isValid ? "bg-emerald-500" : "bg-amber-500"
                        }`} 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">
                        Requirements compliance
                      </span>
                      {auditReport.isValid ? (
                        <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-0.5 border border-emerald-200 shadow-3xs">
                          ✓ Approved
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-800 font-extrabold bg-amber-50 px-2.5 py-0.5 rounded-full flex items-center gap-0.5 border border-amber-200/50">
                          ⏳ Draft
                        </span>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </section>

        {/* Dynamic Exam Calendar & Key Academic Milestones Section */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs mb-6 relative overflow-hidden" id="academic-exam-calendar">
          {/* Subtle calendar graphic/stripes in background */}
          <div className="absolute right-0 top-0 h-full w-32 bg-[linear-gradient(135deg,rgba(99,102,241,0.02)_0%,rgba(99,102,241,0.05)_100%)] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row gap-6 relative z-10">
            {/* Left Side: Summary & Countdown Timer Block */}
            <div className="lg:w-1/3 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-600 animate-pulse" />
                  <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Academic Exam Calendar</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Plan ahead and secure crucial checkpoints. Review official registration deadlines, practical assessments, theory intervals, and score publications.
                </p>
              </div>

              {/* Real-Time Countdown Block */}
              <div className="bg-gradient-to-br from-indigo-900 to-[#0c2340] text-white p-4 sm:p-5 rounded-2xl shadow-xs border border-white/10 space-y-3">
                <div className="flex items-center gap-1.5 text-indigo-300 font-mono">
                  <Clock className="h-3.5 w-3.5 animate-bounce" />
                  <h5 className="text-[10px] font-mono uppercase tracking-widest leading-none font-bold">Theory Exam Countdown</h5>
                </div>
                <div>
                  <h4 className="text-[11px] text-indigo-200/90 font-medium font-sans">Commencement: February 15, 2027</h4>
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-1 text-center font-mono">
                    <div className="bg-white/10 px-2 py-1.5 rounded-lg border border-white/5">
                      <span className="block text-xl font-bold tracking-tight text-white">{timeLeft.days}</span>
                      <span className="text-[8px] text-indigo-305 font-bold uppercase tracking-wider">Days</span>
                    </div>
                    <div className="bg-white/10 px-2 py-1.5 rounded-lg border border-white/5">
                      <span className="block text-xl font-bold tracking-tight text-white">{timeLeft.hours}</span>
                      <span className="text-[8px] text-indigo-305 font-bold uppercase tracking-wider">Hrs</span>
                    </div>
                    <div className="bg-white/10 px-2 py-1.5 rounded-lg border border-white/5">
                      <span className="block text-xl font-bold tracking-tight text-white">{timeLeft.mins}</span>
                      <span className="text-[8px] text-indigo-305 font-bold uppercase tracking-wider">Mins</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Tabbed Interactive Milestones List */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-black text-slate-900 tracking-tight uppercase">Milestones &amp; Scheduled Phases</span>
                
                {/* Independent Toggle */}
                <div className="flex bg-[#f1f4f8] p-1 rounded-xl border border-slate-200/40">
                  <button
                    onClick={() => setCalBoard("ICSE")}
                    className={`px-3 py-1 text-[10px] sm:text-xs font-black rounded-lg transition-all cursor-pointer ${
                      (calBoard || activeBoard) === "ICSE" 
                        ? "bg-[#0c2340] text-amber-400 shadow-2xs" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    ICSE (Class X)
                  </button>
                  <button
                    onClick={() => setCalBoard("ISC")}
                    className={`px-3 py-1 text-[10px] sm:text-xs font-black rounded-lg transition-all cursor-pointer ${
                      (calBoard || activeBoard) === "ISC" 
                        ? "bg-[#0c2340] text-amber-400 shadow-2xs" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    ISC (Class XII)
                  </button>
                </div>
              </div>

              {/* Milestones Vertical List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                {((calBoard || activeBoard) === "ICSE" ? [
                  {
                    title: "Registration & Profile Audit",
                    date: "Sept 15 - Oct 31, 2026",
                    badge: "Action Required",
                    badgeBg: "bg-amber-100 text-amber-800 border-amber-250",
                    description: "Verify spelling, birth records, and selected electives at school for submission to CISCE databases."
                  },
                  {
                    title: "Release of Specimen Papers",
                    date: "Mid-November 2026",
                    badge: "Released",
                    badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-250",
                    description: "Official Class X Specimen/Modal PDFs issued. Use syllabus-focused study guides to construct timelines."
                  },
                  {
                    title: "Admit Card Distribution",
                    date: "Jan 25, 2027",
                    badge: "Upcoming",
                    badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
                    description: "Authorized Board Hall Tickets signed by school principals. Confirm correct center codes."
                  },
                  {
                    title: "Theory Examinations Begin",
                    date: "Feb 15 - Mar 28, 2027",
                    badge: "Upcoming",
                    badgeBg: "bg-rose-50 text-rose-700 border-rose-250",
                    description: "Class X core theory written exams. Sessions initiate, concluding with vocational electives."
                  },
                  {
                    title: "Official Result Declared",
                    date: "May 2027",
                    badge: "Upcoming",
                    badgeBg: "bg-slate-100 text-slate-600 border-slate-205",
                    description: "Statements of Marks issued via CAREERS portal, DigiLocker, and SMS triggers."
                  }
                ] : [
                  {
                    title: "Class XII Registration Lock",
                    date: "Sept 15 - Oct 30, 2026",
                    badge: "Ongoing",
                    badgeBg: "bg-amber-100 text-amber-800 border-amber-250",
                    description: "Elective matrices and stream choices locked in official board system servers."
                  },
                  {
                    title: "Specimen Papers Released",
                    date: "November 2026",
                    badge: "Released",
                    badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-250",
                    description: "Analyze official written layouts and section score definitions on CISCE portal."
                  },
                  {
                    title: "Practical Board Trials",
                    date: "Jan 20 - Feb 5, 2027",
                    badge: "Upcoming",
                    badgeBg: "bg-indigo-50 text-indigo-750 border-indigo-205",
                    description: "External inspectors grade physics, chemistry, biology lab journals, CS codes and English speaking vivas."
                  },
                  {
                    title: "Theory Board Exams",
                    date: "Feb 15 - Apr 4, 2027",
                    badge: "Upcoming",
                    badgeBg: "bg-rose-50 text-rose-700 border-rose-250",
                    description: "Class XII Theory written papers launch with English. Concluding in early April."
                  },
                  {
                    title: "CISCE Result Declaration",
                    date: "May 2027",
                    badge: "Upcoming",
                    badgeBg: "bg-slate-100 text-slate-600 border-slate-205",
                    description: "Scores published dynamically. Rechecks open, followed by institutional admission rounds."
                  }
                ]).map((milestone, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-150 p-3 rounded-xl space-y-1.5 flex flex-col justify-between hover:border-indigo-500/25 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between flex-wrap gap-1.5">
                        <h4 className="text-xs font-extrabold text-slate-900 tracking-tight leading-tight">{milestone.title}</h4>
                        <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded border ${milestone.badgeBg}`}>{milestone.badge}</span>
                      </div>
                      <p className="text-[10px] text-indigo-650 font-bold font-mono">{milestone.date}</p>
                    </div>
                    <p className="text-[10.5px] text-slate-500 leading-normal font-medium pt-1.5 border-t border-slate-200/50">{milestone.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Separate Academic Search, Code, and Group Filter Section */}
        <section className="bg-white border border-[#e2ece5] rounded-2xl p-6 shadow-sm mb-6 relative overflow-hidden" id="separate-search-section">
          {/* Subtle nature element aesthetic background lines */}
          <div className="absolute right-0 top-0 h-full w-24 bg-[linear-gradient(135deg,rgba(16,185,129,0.02)_0%,rgba(16,185,129,0.06)_100%)] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-1 self-start lg:self-center">
              <h4 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0c2340]" />
                <span>Search &amp; Filters Workspace</span>
              </h4>
              <p className="text-xs text-slate-400">Type subject names, specific codes (e.g. &apos;51&apos;, &apos;99&apos;) or pick specialized curriculum categories below.</p>
            </div>
            
            <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1 justify-end">
              {/* Main Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#0c2340]/60" />
                <input
                  type="text"
                  placeholder="Type Subject or Code (e.g. Computer, Physics, 99)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#f1f4f8] border border-[#cbd9e7] pl-10 pr-10 py-2.5 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c2340] focus:bg-white text-slate-800 transition shadow-2xs font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Categorization Tabs Row */}
              <div className="flex flex-wrap gap-1 items-center overflow-x-auto p-1 bg-slate-100 border border-slate-200 rounded-xl max-w-sm sm:max-w-none">
                {categories.map((cat) => (
                  <motion.button
                    key={cat}
                    whileHover={{ scale: 1.05, y: -0.5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      activeCategory === cat
                        ? "bg-[#0c2340] text-white shadow-xs"
                        : "text-slate-500 hover:bg-slate-250/60 hover:text-slate-800"
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Two-Column Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN (Lg: 4/12) - Interactive Curriculum Choice Planner */}
          <section className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-6 lg:sticky lg:top-8 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto scrollbar-thin">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 header font-sans">
              <BookOpenCheck className="h-5 w-5 text-[#0c2340] animate-pulse" />
              <h3 className="font-extrabold text-lg text-[#0c2340] tracking-tight">
                Subject Choice Planner
              </h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              📌 {currentConfig.choiceRuleDescription}
            </p>

            {/* Guided combinations prompt */}
            <div className="bg-gradient-to-r from-teal-500/10 via-indigo-500/5 to-transparent border border-teal-500/20 rounded-2xl p-4 space-y-3 shadow-3xs hover:border-teal-500/35 transition-all">
              <div className="flex items-start gap-2.5">
                <span className="text-xl">✨</span>
                <div>
                  <h4 className="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                    Stream Advisor &amp; Guide
                    <span className="px-1.5 py-0.5 rounded-full bg-teal-500/10 text-[8px] text-teal-700 font-extrabold uppercase">Interactive</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-normal mt-1">
                    Answer questions about your interests and career paths to get a compliant combination suggested and automatically configured.
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02, y: -0.5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setAdvisorModalBoard(activeBoard);
                  setAdvisorStep(1);
                  setSelectedInterests([]);
                  setSelectedCareer("");
                  setShowAdvisorModal(true);
                }}
                className="w-full py-2.5 bg-[#0c2340] text-amber-400 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-900 transition shadow-xs hover:text-white"
              >
                <Compass className="h-3.5 w-3.5 animate-spin-slow text-amber-400" />
                Guided Course Advisor
              </motion.button>
            </div>

            {/* Interactive selections list grouped by constraint */}
            <div className="space-y-4">
              {currentConfig.groups.map((grp) => {
                const groupSelectedCount = grp.subjects.filter((s) => selectedSubjectIds.includes(s.id)).length;
                const isSatisfied = groupSelectedCount >= grp.minSelect && groupSelectedCount <= grp.maxSelect;

                return (
                  <div key={grp.id} className="border border-slate-100 rounded-xl p-3.5 space-y-2.5 bg-slate-25">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-slate-900 tracking-tight uppercase">
                          {grp.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Req: {grp.minSelect} {grp.minSelect !== grp.maxSelect ? `- ${grp.maxSelect}` : ""} {grp.minSelect === 1 ? "subject" : "subjects"}
                        </p>
                      </div>
                      {grp.isRequired ? (
                        isSatisfied ? (
                          <span className="text-[10px] px-2 py-0.5 font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <Check className="h-3 w-3" /> Met
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {groupSelectedCount}/{grp.minSelect} Selected
                          </span>
                        )
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 font-bold rounded-full bg-slate-100 text-slate-500">
                          {groupSelectedCount} Selected
                        </span>
                      )}
                    </div>

                    {/* Miniature checkboxes showing subjects in this group */}
                    <div className="space-y-1.5 pt-1">
                      {grp.subjects.map((sub) => {
                        const isChosen = selectedSubjectIds.includes(sub.id);
                        
                        // Mini inline mapping to get subject emoji matching bento theme aesthetic
                        const getSubjectEmoji = (name: string) => {
                          const lowercase = name.toLowerCase();
                          if (lowercase.includes("physics")) return "⚛️";
                          if (lowercase.includes("math")) return "📐";
                          if (lowercase.includes("chemistry") || lowercase.includes("chem")) return "🧪";
                          if (lowercase.includes("english") || lowercase.includes("literature")) return "📖";
                          if (lowercase.includes("history") || lowercase.includes("civics")) return "🏺";
                          if (lowercase.includes("computer") || lowercase.includes("applications") || lowercase.includes("science")) return "💻";
                          if (lowercase.includes("geography")) return "🌏";
                          if (lowercase.includes("biology") || lowercase.includes("bio")) return "🌿";
                          if (lowercase.includes("hindi") || lowercase.includes("bengali") || lowercase.includes("sanskrit") || lowercase.includes("language")) return "🗣️";
                          if (lowercase.includes("commercial") || lowercase.includes("economic") || lowercase.includes("accounts")) return "📊";
                          if (lowercase.includes("art")) return "🎨";
                          if (lowercase.includes("cook")) return "🍳";
                          if (lowercase.includes("music") || lowercase.includes("instrumental")) return "🎵";
                          if (lowercase.includes("physical education") || lowercase.includes("pe") || lowercase.includes("sports")) return "🎽";
                          return "📖";
                        };

                        return (
                          <motion.button
                            key={sub.id}
                            id={`planner-option-${sub.id}`}
                            whileHover={sub.isCompulsory ? {} : { x: 3, scale: 1.01 }}
                            whileTap={sub.isCompulsory ? {} : { scale: 0.99 }}
                            onClick={() => toggleSubjectChoice(sub)}
                            disabled={sub.isCompulsory}
                            className={`w-full flex items-center justify-between p-2.5 transition-all text-left border border-transparent ${
                              isChosen
                                ? "bg-indigo-50 border-l-4 border-indigo-600 rounded-r-lg text-indigo-950 font-bold shadow-2xs"
                                : "hover:bg-slate-50 hover:text-slate-900 rounded-lg text-slate-600"
                            } ${sub.isCompulsory ? "cursor-not-allowed opacity-90" : "cursor-pointer"}`}
                          >
                            <span className="text-xs flex items-center gap-2.5 truncate">
                              <span className="text-sm select-none shrink-0">{getSubjectEmoji(sub.name)}</span>
                              <span className="truncate">{sub.name}</span>
                            </span>
                            <span className="text-[10px] font-mono tracking-wider font-semibold ml-2 shrink-0">
                              {sub.isCompulsory ? (
                                <span className="text-[9px] font-bold uppercase text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded">Core</span>
                              ) : isChosen ? (
                                <span className="text-[9px] font-bold uppercase text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Selected</span>
                              ) : (
                                <span className="text-slate-400">Code {sub.code}</span>
                              )}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Audit validation status widget */}
            <div className="pt-4 border-t border-slate-100 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500">Total Selections:</span>
                <span className="text-sm font-black text-slate-900 border-b-2 border-indigo-200 pb-0.5">
                  {auditReport.totalCount} / {auditReport.requiredCount} subjects
                </span>
              </div>

              {/* Status Banner */}
              {auditReport.isValid ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-black">Curriculum Approved!</h5>
                    <p className="text-[10px] text-emerald-700 mt-1 font-medium leading-relaxed">
                      Your current selections perfectly adhere to the official CISCE registration regulations.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3.5 rounded-xl flex items-start gap-2.5">
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-black">Awaiting Complete Selection</h5>
                    <p className="text-[10px] text-amber-700 mt-1 font-medium leading-relaxed">
                      Adjust your selections above. Check group rules to fulfill graduation requirements.
                    </p>
                  </div>
                </div>
              )}

              {/* Success/Error logs list */}
              <div className="space-y-1.5">
                {auditReport.errors.map((err, i) => (
                  <p key={i} className="text-[10.5px] text-rose-600 font-bold flex items-center gap-1">
                    <span className="h-1 w-1 bg-rose-500 rounded-full" /> {err}
                  </p>
                ))}
                {auditReport.successes.map((suc, i) => (
                  <p key={i} className="text-[10.5px] text-emerald-700 font-bold flex items-center gap-1">
                    <span className="h-1 w-1 bg-emerald-500 rounded-full" /> {suc}
                  </p>
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN (Lg: 8/12) - Subject directory search, categorizing & active explorer */}
          <main className="lg:col-span-8 space-y-6">
            
            {/* Header info bar */}
            <div className="flex items-center justify-between bg-white px-5 py-4 rounded-xl border border-slate-200/50 shadow-xs">
              <div className="flex items-center gap-1.5 font-sans">
                <span className="w-2 h-2 rounded-full bg-emerald-650" />
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider font-mono">
                  Curriculum Directory ({filteredSubjects.length})
                </h3>
              </div>
              {activeCategory !== "All" && (
                <span className="text-[9px] bg-[#111e14] text-white font-mono uppercase px-2 py-0.5 rounded-md font-bold">
                  {activeCategory}
                </span>
              )}
            </div>

            {/* Render Category titles and grouped lists */}
            {filteredSubjects.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#e2ece5] py-16 text-center shadow-xs">
                <BookOpen className="h-10 w-10 text-emerald-800/20 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-800">No subjects matched your query</h4>
                <p className="text-slate-400 text-xs mt-1">Try resetting your typing search query or select another category option above.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg hover:bg-emerald-100 transition cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredSubjects.map((sub, idx) => {
                    const isSelectedInPlanner = selectedSubjectIds.includes(sub.id);
                    const isCurrentActiveDetail = selectedSubject?.id === sub.id;
                    const theme = getSubjectTheme(sub);

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.4) }}
                        whileHover={{ 
                          y: -5, 
                          scale: 1.015,
                          boxShadow: "0 12px 28px -5px rgba(12,35,64,0.08), 0 8px 10px -6px rgba(12,35,64,0.04)"
                        }}
                        whileTap={{ scale: 0.992 }}
                        key={sub.id}
                        id={`subject-card-${sub.id}`}
                        onClick={() => {
                          setSelectedSubject(sub);
                        }}
                        className={`group relative text-left overflow-hidden rounded-2xl p-5 cursor-pointer transition-all duration-500 border ${
                          isCurrentActiveDetail
                            ? "border-amber-400 ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/10"
                            : "border-slate-200 hover:border-slate-400"
                        }`}
                        style={{ minHeight: "230px" }}
                      >
                        {/* Immersive Card Background Image */}
                        <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl bg-neutral-900 pointer-events-none">
                          <img
                            src={theme.imageUrl}
                            alt=""
                            className="w-full h-full object-cover opacity-80 scale-100 group-hover:scale-110 transition-transform duration-700 ease-out brightness-[0.8] saturate-[1.2]"
                            referrerPolicy="no-referrer"
                          />
                          {/* Rich dynamic colored overlay based on the subject's related theme color */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />
                          <div className={`absolute inset-0 opacity-45 mix-blend-multiply bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo}`} />
                        </div>

                        {/* Card Content Wrapper */}
                        <div className="relative z-10 h-full flex flex-col justify-between">
                          <div>
                            {/* Upper Badges line */}
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <span className={`text-[10px] font-mono tracking-widest font-black px-2.5 py-0.5 rounded text-white ${
                                sub.id === "icse-ai-robotics" ? "bg-amber-550" : "bg-black/60 backdrop-blur-xs border border-white/10"
                              }`} style={{ backgroundColor: theme.primary }}>
                                {sub.code}
                              </span>
                              
                              <div className="flex items-center gap-1">
                                {sub.isCompulsory ? (
                                  <span className="text-[9px] font-black uppercase bg-[#0c2340] text-amber-400 px-2 py-0.5 rounded border border-amber-400/25">
                                    Compulsory
                                  </span>
                                ) : isSelectedInPlanner ? (
                                  <span className="text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded flex items-center gap-0.5">
                                    <Check className="h-2 w-2" /> In Planner
                                  </span>
                                ) : null}
                                
                                <span className="text-[9px] font-bold uppercase bg-white/10 text-slate-200 px-2 py-0.5 rounded border border-white/5">
                                  {sub.category}
                                </span>
                              </div>
                            </div>

                            {/* Title & Static description */}
                            <div className="flex items-center gap-2">
                              <span className="text-lg select-none">{(() => {
                                const name = sub.name;
                                const lowercase = name.toLowerCase();
                                if (lowercase.includes("physics")) return "⚛️";
                                if (lowercase.includes("math")) return "📐";
                                if (lowercase.includes("chemistry") || lowercase.includes("chem")) return "🧪";
                                if (lowercase.includes("english") || lowercase.includes("literature")) return "📖";
                                if (lowercase.includes("history") || lowercase.includes("civics")) return "🏺";
                                if (lowercase.includes("computer") || lowercase.includes("applications") || lowercase.includes("science")) return "💻";
                                if (lowercase.includes("geography")) return "🌏";
                                if (lowercase.includes("biology") || lowercase.includes("bio")) return "🌿";
                                if (lowercase.includes("hindi") || lowercase.includes("bengali") || lowercase.includes("sanskrit") || lowercase.includes("language")) return "🗣️";
                                if (lowercase.includes("commercial") || lowercase.includes("economic") || lowercase.includes("accounts")) return "📊";
                                if (lowercase.includes("art")) return "🎨";
                                if (lowercase.includes("cook")) return "🍳";
                                if (lowercase.includes("music") || lowercase.includes("instrumental")) return "🎵";
                                if (lowercase.includes("physical education") || lowercase.includes("pe") || lowercase.includes("sports")) return "🎽";
                                return "📖";
                              })()}</span>
                              <h4 className={`font-extrabold text-base text-white group-hover:text-amber-300 transition duration-150 truncate ${theme.fontFamily}`}>
                                {sub.name}
                              </h4>
                            </div>
                            
                            <p className="text-slate-350 text-[10px] font-mono mt-0.5 uppercase tracking-wider">
                              {sub.group}
                            </p>
                            
                            <p className="text-slate-250 text-xs leading-relaxed mt-2.5 line-clamp-2 h-8">
                              {sub.description}
                            </p>
                          </div>

                          {/* Marks structure and action link line */}
                          <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3.5 font-mono text-[10px] text-slate-300">
                              <div>
                                Theory: <span className="font-bold text-white">{sub.baseTheoryMarks}</span>
                              </div>
                              <div className="h-3 w-px bg-white/10" />
                              <div>
                                Practical: <span className="font-bold text-white">{sub.basePracticalMarks}</span>
                              </div>
                            </div>

                            <span className="text-xs font-black flex items-center gap-0.5 group-hover:translate-x-1 transition-transform text-amber-400 group-hover:text-amber-350">
                              View Syllabus <ChevronRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </main>
        </div>

        {/* BOTTOM FLOATING / HALF SCREEN SYLLABUS DETAIL WORKSPACE DRAWER */}
        <AnimatePresence>
          {selectedSubject && (() => {
            const theme = getSubjectTheme(selectedSubject);
            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ type: "spring", bounce: 0.1, duration: 0.45 }}
                className="fixed inset-x-0 bottom-0 z-40 bg-white border-t border-slate-300 shadow-[0_-8px_30px_rgb(15,23,42,0.1)] rounded-t-3xl max-h-[88vh] overflow-hidden flex flex-col"
              >
                
                {/* Drawer Top Header controls */}
                <div className="relative text-white px-5 py-5 sm:px-8 flex items-center justify-between overflow-hidden border-b border-slate-800 shrink-0" style={{ backgroundColor: theme.primary }}>
                  {/* Background sliding cover image with gradient scrim */}
                  <motion.div
                    initial={{ scale: 1.18, y: 20, opacity: 0 }}
                    animate={{ scale: 1.02, y: 0, opacity: 0.36 }}
                    exit={{ scale: 1.18, y: 20, opacity: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="absolute inset-0 pointer-events-none z-0"
                  >
                    <img
                      src={theme.imageUrl}
                      alt=""
                      className="w-full h-full object-cover animate-fade-in"
                      referrerPolicy="no-referrer"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradientFrom} via-slate-900/90 to-transparent`} />
                  </motion.div>

                  <div className="flex items-center gap-3 relative z-10">
                    <motion.div 
                      initial={{ scale: 0.9, rotate: -8 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                      className="p-2 bg-white/10 text-white rounded-lg border border-white/20"
                    >
                      <BookOpenCheck className="h-5.5 w-5.5" />
                    </motion.div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-black text-lg tracking-tight ${theme.fontFamily}`}>
                          {selectedSubject.name} <span className="text-white/75 text-xs font-normal font-mono">Code {selectedSubject.code}</span>
                        </h3>
                        <span className="bg-white/20 text-white text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded border border-white/15">
                          {activeBoard}
                        </span>
                      </div>
                      <p className="text-xs text-white/75 font-mono mt-0.5">
                        {selectedBoardKey(selectedSubject.id)} Subject Details Panel
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 relative z-10">
                    {/* Quick toggle planner button directly on detail sheet */}
                    {!selectedSubject.isCompulsory && (
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => toggleSubjectChoice(selectedSubject)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs font-black transition-all cursor-pointer ${
                          selectedSubjectIds.includes(selectedSubject.id)
                            ? "bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 animate-pulse"
                            : "bg-[#d4af37] text-[#0c2340] border border-amber-300 font-extrabold hover:bg-[#cda42c] active:scale-95 shadow-sm"
                        }`}
                      >
                        {selectedSubjectIds.includes(selectedSubject.id) ? (
                          <>Remove from Planner</>
                        ) : (
                          <>Add to Planner</>
                        )}
                      </motion.button>
                    )}

                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setSelectedSubject(null)}
                    className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                    title="Close"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              {/* Drawer inner tabs bar */}
              <div className="bg-[#f0f4f1] border-b border-[#e2ece5] px-5 sm:px-8 py-2 overflow-x-auto flex gap-1 scrollbar-none shrink-0 relative z-10">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setDrawerTab("overview")}
                  className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                    drawerTab === "overview"
                      ? "bg-white text-emerald-800 shadow-xs border border-emerald-100"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                  }`}
                >
                  Quick Facts
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (currentSyllabusReport) {
                      setDrawerTab("syllabus");
                    } else {
                      fetchSubjectSyllabus(selectedSubject);
                    }
                  }}
                  disabled={isLoadingSyllabus}
                  className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                    drawerTab === "syllabus"
                      ? "bg-white text-emerald-800 shadow-xs border border-emerald-100"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                  } ${isLoadingSyllabus ? "opacity-75" : ""}`}
                >
                  {isLoadingSyllabus && drawerTab === "overview" ? (
                    <RefreshCw className="h-3 w-3 animate-spin text-emerald-700" />
                  ) : (
                    <Layers className="h-3 w-3" />
                  )}
                  Full Syllabus
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (currentSyllabusReport) {
                      setDrawerTab("marking");
                    } else {
                      fetchSubjectSyllabus(selectedSubject);
                    }
                  }}
                  disabled={isLoadingSyllabus}
                  className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                    drawerTab === "marking"
                      ? "bg-white text-emerald-800 shadow-xs border border-emerald-100"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                  }`}
                >
                  <Award className="h-3.5 w-3.5" /> Marking Scheme
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (currentSyllabusReport) {
                      setDrawerTab("questions");
                    } else {
                      fetchSubjectSyllabus(selectedSubject);
                    }
                  }}
                  disabled={isLoadingSyllabus}
                  className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                    drawerTab === "questions"
                      ? "bg-white text-emerald-800 shadow-xs border border-emerald-100"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" /> Exam Pattern
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (currentSyllabusReport) {
                      setDrawerTab("expert");
                    } else {
                      fetchSubjectSyllabus(selectedSubject);
                    }
                  }}
                  disabled={isLoadingSyllabus}
                  className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                    drawerTab === "expert"
                      ? "bg-white text-emerald-800 shadow-xs border border-emerald-100"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                  }`}
                >
                  <Lightbulb className="h-3.5 w-3.5" /> Prep Tips
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setDrawerTab("chat")}
                  className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    drawerTab === "chat"
                      ? "bg-white text-emerald-800 shadow-xs border border-emerald-100"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  Ask AI Tutor
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setDrawerTab("resources")}
                  className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    drawerTab === "resources"
                      ? "bg-white text-emerald-800 shadow-xs border border-emerald-100"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                  Study Resources
                </motion.button>
              </div>

              {/* Drawer Content Space */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-slate-25 scrollbar-thin">
                
                {/* Loader status */}
                {isLoadingSyllabus && (
                  <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <RefreshCw className="h-10 w-10 text-indigo-600 animate-spin" />
                    <div className="text-center">
                      <h4 className="text-sm font-black text-slate-800">Compiling Syllabus Audit with Gemini AI...</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm">
                        Please wait. Retrieving verified units, section weightages, structure, and official scoring tips directly...
                      </p>
                    </div>
                  </div>
                )}

                {/* Main Error status */}
                {syllabusError && !isLoadingSyllabus && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-900 p-5 rounded-2xl max-w-xl mx-auto text-center my-6">
                    <AlertCircle className="h-10 w-10 text-rose-600 mx-auto mb-3" />
                    <h4 className="text-sm font-black">AI Fetch Interrupted</h4>
                    <p className="text-xs text-rose-700 mt-1">{syllabusError}</p>
                    <button
                      onClick={() => fetchSubjectSyllabus(selectedSubject)}
                      className="mt-4 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-500 transition"
                    >
                      Try Request Again
                    </button>
                  </div>
                )}

                 {/* TAB 1: QUICK OVERVIEW (Instant Static factual view styled as Bento Grid) */}
                {drawerTab === "overview" && !isLoadingSyllabus && (
                  <div className="space-y-6">
                    {/* Visual subject picture card (slides up dynamically!) */}
                    <motion.div
                      initial={{ opacity: 0, y: 35, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="relative rounded-2xl h-48 sm:h-56 w-full overflow-hidden shadow-sm border border-emerald-100/35 group"
                    >
                      <img 
                        src={theme.imageUrl} 
                        alt={selectedSubject.name} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent z-0" />
                      
                      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 z-10 text-white">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="px-2 py-0.5 bg-emerald-700/85 text-white text-[10px] font-black rounded uppercase tracking-wider font-sans">{selectedSubject.group}</span>
                              <span className="text-slate-300 text-xs font-semibold">Subject Code: {selectedSubject.code}</span>
                            </div>
                            <h2 className="text-2xl sm:text-3.5xl font-black tracking-tight flex items-center gap-2 font-sans">
                              <span className="text-2xl select-none">
                                {(() => {
                                  const lowercaseName = selectedSubject.name.toLowerCase();
                                  if (lowercaseName.includes("physics")) return "⚛️";
                                  if (lowercaseName.includes("math")) return "📐";
                                  if (lowercaseName.includes("chem")) return "🧪";
                                  if (lowercaseName.includes("english")) return "📖";
                                  if (lowercaseName.includes("history")) return "🏺";
                                  if (lowercaseName.includes("computer")) return "💻";
                                  if (lowercaseName.includes("geography")) return "🌏";
                                  return "📖";
                                })()}
                              </span>
                              {selectedSubject.name}
                            </h2>
                          </div>
                          
                          <div className="text-left sm:text-right shrink-0">
                            <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Total Evaluation Weight</p>
                            <p className="text-3xl sm:text-4xl font-black font-mono text-white">
                              {selectedSubject.baseTheoryMarks + selectedSubject.basePracticalMarks}<span className="text-xs text-slate-300 font-bold ml-1 font-sans">MARKS</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Sub-Card 1: Marking Scheme */}
                      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                        <div>
                          <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-rose-500 rounded-full"></span> Marking Scheme
                          </h5>
                          <ul className="space-y-4">
                            <li className="flex justify-between items-end pb-2 border-b border-slate-100">
                              <span className="text-xs text-slate-500 font-medium">Theory Paper</span>
                              <span className="text-xs font-bold text-slate-900">{selectedSubject.baseTheoryMarks}m ({Math.round((selectedSubject.baseTheoryMarks / (selectedSubject.baseTheoryMarks + selectedSubject.basePracticalMarks)) * 100)}%)</span>
                            </li>
                            <li className="flex justify-between items-end pb-2 border-b border-slate-100">
                              <span className="text-xs text-slate-500 font-medium">Practicals / Projects</span>
                              <span className="text-xs font-bold text-slate-900">{selectedSubject.basePracticalMarks}m ({Math.round((selectedSubject.basePracticalMarks / (selectedSubject.baseTheoryMarks + selectedSubject.basePracticalMarks)) * 100)}%)</span>
                            </li>
                            <li className="flex justify-between items-end">
                              <span className="text-xs text-slate-800 font-semibold">Total Evaluation</span>
                              <span className="text-xs font-bold text-indigo-600 font-mono">{selectedSubject.baseTheoryMarks + selectedSubject.basePracticalMarks} Marks</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Sub-Card 2: Syllabus Focus */}
                      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                        <div>
                          <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Syllabus Focus
                          </h5>
                          <p className="text-xs text-slate-600 leading-relaxed font-semibold mb-4">
                            {selectedSubject.description}
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <div className="px-3 py-1.5 bg-slate-50 rounded border border-slate-200 text-[11px] font-semibold text-slate-700">Category: {selectedSubject.category}</div>
                          <div className="px-3 py-1.5 bg-slate-50 rounded border border-slate-200 text-[11px] font-semibold text-slate-700">Course: {selectedSubject.group}</div>
                        </div>
                      </div>

                      {/* Sub-Card 3: Exam Pattern */}
                      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                        <div>
                          <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Paper Pattern
                          </h5>
                          <div className="space-y-3.5">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Section A (Theory-heavy)</p>
                              <p className="text-[11px] text-slate-600 font-semibold">Compulsory scoring answers &amp; definitions.</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Section B (Application)</p>
                              <p className="text-[11px] text-slate-600 font-semibold">Analytical questions &amp; elective choices.</p>
                            </div>
                          </div>
                        </div>
                        <div className="pt-4 flex justify-between border-t border-slate-100">
                          <button
                            id="drawer-tab-btn-syllabus" 
                            onClick={() => setDrawerTab("syllabus")}
                            className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
                          >
                            Course Syllabi
                          </button>
                          <button
                            id="drawer-tab-btn-questions" 
                            onClick={() => setDrawerTab("questions")}
                            className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
                          >
                            Pattern Outline
                          </button>
                        </div>
                      </div>
                    </div>
 
                    {/* Dynamic Syllabus Unlock Button banner if not loaded */}
                    {!aiReport && (
                      <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-lg border border-indigo-700 mt-6">
                        <div className="absolute right-0 bottom-0 bg-indigo-500/20 translate-x-12 translate-y-12 h-44 w-44 rounded-full blur-2xl pointer-events-none" />
                        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                          <div>
                            <h5 className="font-extrabold text-slate-100 flex items-center gap-1.5 text-sm">
                              <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" /> Supercharge with Gemini AI
                            </h5>
                            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed max-w-lg">
                              Generate customized, chapter-by-chapter weightages, specialized mock examination splits, scoring guides and study timetables instantly.
                            </p>
                          </div>
                          <button
                            id="unlock-syllabus-btn"
                            onClick={() => fetchSubjectSyllabus(selectedSubject)}
                            className="px-5 py-2.5 bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-black rounded-lg shrink-0 transition-all flex items-center gap-1.5 shadow-md shadow-indigo-900/30 active:scale-95 cursor-pointer"
                          >
                            Generate with Gemini AI
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: DETAILED SYLLABUS DIRECTORY MAP (From Gemini cached response) */}
                {drawerTab === "syllabus" && currentSyllabusReport && (
                  <div className="space-y-6 max-w-4xl">
                    <div className="flex items-center gap-2">
                      <span className="p-1 px-2.5 rounded bg-indigo-50 text-indigo-700 font-black text-xs uppercase font-mono">Curriculum Module Details</span>
                      <div className="h-px flex-1 bg-slate-200" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentSyllabusReport.syllabus.map((uni, i) => (
                        <div key={i} className="bg-white border border-slate-150 rounded-xl p-4 shadow-[0_1px_2px_rgba(15,23,42,0.01)] hover:border-indigo-200 hover:shadow-xs transition">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <h5 className="font-extrabold text-sm text-slate-950 pr-4">
                              {uni.unitName}
                            </h5>
                            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100 font-mono shrink-0">
                              {uni.weightage || "Syllabus Standard"}
                            </span>
                          </div>

                          <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                            {uni.topics.map((top, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                                <span>{top}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: DETAILED MARKING SCHEME BREAKDOWN */}
                {drawerTab === "marking" && currentSyllabusReport && (
                  <div className="max-w-3xl space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white border border-slate-150 p-4 rounded-xl text-center shadow-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Theory Paper</span>
                        <p className="text-3xl font-black text-slate-900 mt-1">{currentSyllabusReport.markingScheme.theoryMarks}m</p>
                      </div>
                      <div className="bg-white border border-slate-150 p-4 rounded-xl text-center shadow-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Practicals & Project</span>
                        <p className="text-3xl font-black text-indigo-600 mt-1">{currentSyllabusReport.markingScheme.practicalMarks}m</p>
                      </div>
                      <div className="bg-slate-900 text-white p-4 rounded-xl text-center shadow-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Full Scale Maximums</span>
                        <p className="text-3xl font-black text-amber-400 mt-1">{currentSyllabusReport.totalMarks}m</p>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm space-y-4">
                      <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 pb-2.5 border-b border-slate-100">
                        <Award className="h-4.5 w-4.5 text-indigo-500" /> CISCE Board Evaluation Protocol
                      </h4>

                      <ul className="space-y-3.5 pt-2">
                        {currentSyllabusReport.markingScheme.breakdown?.map((item, id) => (
                          <li key={id} className="text-xs text-slate-600 font-medium leading-relaxed flex items-start gap-2">
                            <span className="h-5 w-5 bg-indigo-50 text-indigo-700 font-bold rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                              {id + 1}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* TAB 4: EXAMINATION PAPERS QUESTION PATTERN */}
                {drawerTab === "questions" && currentSyllabusReport && (
                  <div className="max-w-3xl space-y-6">
                    <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm flex items-center justify-between gap-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
                          <Clock className="h-5.5 w-5.5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Exam Board Duration</span>
                          <p className="text-sm font-black text-slate-900">{currentSyllabusReport.questionPattern.duration}</p>
                        </div>
                      </div>
                      <div className="px-4 py-2 bg-indigo-50 border border-indigo-150 text-indigo-800 rounded-lg font-mono text-xs font-bold">
                        Maximum Score: {currentSyllabusReport.markingScheme.theoryMarks} Marks
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-widest text-[11px]">
                        Question Section Allocation
                      </h4>

                      <div className="space-y-3">
                        {currentSyllabusReport.questionPattern.sections.map((sec, i) => (
                          <div key={i} className="bg-white border border-slate-150 p-4 rounded-xl shadow-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <h5 className="font-black text-sm text-slate-900">{sec.name}</h5>
                              <div className="flex gap-1.5 items-center">
                                {sec.compulsory ? (
                                  <span className="text-[9px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-100">
                                    Compulsory Section
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                                    Elective Section
                                  </span>
                                )}
                                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono">
                                  {sec.marks} Marks
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">
                              {sec.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-250 p-4 rounded-xl text-xs text-slate-500 leading-relaxed font-mono">
                      <h5 className="font-extrabold text-[#334155] uppercase tracking-wider text-[9px] mb-1">Additional Exam Rules:</h5>
                      {currentSyllabusReport.questionPattern.overallStructure}
                    </div>
                  </div>
                )}

                {/* TAB 5: EXPERT STUDY STRATEGIES / TIPS */}
                {drawerTab === "expert" && currentSyllabusReport && (
                  <div className="max-w-2xl space-y-4">
                    <h4 className="font-black text-base text-slate-950 tracking-tight pb-2 border-b border-slate-200">
                      💡 Preparation Hacks for {selectedSubject.name} Class {selectedSubject.code}
                    </h4>

                    {currentSyllabusReport.expertTips.map((tip, i) => (
                      <div key={i} className="bg-white border border-slate-150 p-4 rounded-xl shadow-xs flex items-start gap-3">
                        <div className="p-1.5 bg-yellow-50 text-yellow-600 rounded-lg shrink-0">
                          <Lightbulb className="h-5 w-5" />
                        </div>
                        <p className="text-xs text-slate-700 font-semibold leading-relaxed pt-0.5">
                          {tip}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 7: STUDY MATERIALS AND ADDITIONAL RESOURCES */}
                {drawerTab === "resources" && selectedSubject && (() => {
                  const resources = getSubjectResources(selectedSubject.id, selectedSubject.name);
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      <div className="border-b border-slate-200 pb-4">
                        <h3 className="text-lg font-extrabold text-[#0c2340] tracking-tight flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-indigo-650" />
                          <span>Syllabus Resources &amp; Reference Hub</span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Curated novels, reference keys, PDF archive guides, and expert video tutorials mapped to core chapters for <strong>{selectedSubject.name}</strong>.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Column 1: Downloadable Past Papers & Textbooks */}
                        <div className="space-y-6">
                          {/* Past Papers Category */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-black text-[#0c2340] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                              <span className="w-1.5 h-3 bg-[#0c2340] rounded" />
                              Downloadable Past Papers
                            </h4>
                            <div className="space-y-2.5">
                              {resources.pastPapers.map((paper, i) => (
                                <div key={i} className="bg-white border border-slate-200 p-4 rounded-xl shadow-3xs hover:border-indigo-500/35 transition space-y-2 flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-center justify-between flex-wrap gap-1">
                                      <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">{paper.tag || "PDF Document"}</span>
                                      <span className="text-[9px] font-mono text-slate-400">PDF File</span>
                                    </div>
                                    <h5 className="text-xs font-bold text-slate-900 mt-1.5">{paper.title}</h5>
                                    <p className="text-[11px] text-slate-500 mt-1 leading-normal font-semibold">{paper.description}</p>
                                  </div>
                                  <div className="pt-2">
                                    <a
                                      href={paper.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-extrabold hover:underline cursor-pointer"
                                    >
                                      <Download className="h-3 w-3 text-indigo-600" />
                                      Download Material
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Textbooks Recommended */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-[#0c2340] uppercase tracking-wider flex items-center gap-1.5 font-mono font-black">
                              <span className="w-1.5 h-3 bg-[#0c2340] rounded" />
                              Relevant Textbooks
                            </h4>
                            <div className="space-y-2.5">
                              {resources.textbooks.map((book, i) => (
                                <div key={i} className="bg-white border border-slate-200 p-4 rounded-xl shadow-3xs hover:border-indigo-500/35 transition space-y-4 flex flex-col justify-between">
                                  <div>
                                    <span className="text-[9px] font-mono font-black bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded border border-indigo-100 uppercase">{book.tag || "Textbook"}</span>
                                    <h5 className="text-xs font-bold text-slate-900 mt-1.5">{book.title}</h5>
                                    <p className="text-[11px] text-slate-500 mt-1 leading-normal font-semibold">{book.description}</p>
                                  </div>
                                  <div className="pt-2 border-t border-slate-100">
                                    <a
                                      href={book.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-extrabold hover:underline cursor-pointer"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      Sourcing Directory
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Column 2: Web Links & Video Tutorials */}
                        <div className="space-y-6">
                          {/* Educational Websites */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-black text-[#0c2340] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                              <span className="w-1.5 h-3 bg-[#0c2340] rounded" />
                              Educational Websites
                            </h4>
                            <div className="space-y-2.5">
                              {resources.websites.map((web, i) => (
                                <div key={i} className="bg-white border border-slate-200 p-4 rounded-xl shadow-3xs hover:border-amber-500/35 transition space-y-2 flex flex-col justify-between">
                                  <div>
                                    <span className="text-[9px] font-mono font-bold bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded border border-amber-100 uppercase">{web.tag || "PortalLink"}</span>
                                    <h5 className="text-xs font-bold text-slate-900 mt-1.5">{web.title}</h5>
                                    <p className="text-[11px] text-slate-500 mt-1 leading-normal font-semibold">{web.description}</p>
                                  </div>
                                  <div className="pt-2">
                                    <a
                                      href={web.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-extrabold hover:underline cursor-pointer"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      Visit Resource Portal
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Video Tutorials */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-black text-[#0c2340] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                              <span className="w-1.5 h-3 bg-[#0c2340] rounded" />
                              Video Tutorials
                            </h4>
                            <div className="space-y-2.5">
                              {resources.videos.map((vid, i) => (
                                <div key={i} className="bg-white border border-slate-200 p-4 rounded-xl shadow-3xs hover:border-rose-500/35 transition space-y-3 flex flex-col justify-between">
                                  <div>
                                    <span className="text-[9px] font-mono font-bold bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded border border-rose-100 uppercase">{vid.tag || "Video Lesson"}</span>
                                    <h5 className="text-xs font-bold text-slate-900 mt-2 flex items-center gap-1.5">
                                      <PlayCircle className="h-4 w-4 text-rose-500 shrink-0" />
                                      <span className="line-clamp-1">{vid.title}</span>
                                    </h5>
                                    <p className="text-[11px] text-slate-500 mt-1 leading-normal font-semibold">{vid.description}</p>
                                  </div>
                                  <div className="pt-1.5 border-t border-slate-100">
                                    <a
                                      href={vid.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs text-rose-650 font-extrabold hover:underline cursor-pointer"
                                    >
                                      Watch Video Playlist
                                      <ArrowRight className="h-3 w-3" />
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}

                {/* TAB 6: ASK AI PREPARATION SUPPORT TUTOR (Live Chat) */}
                {drawerTab === "chat" && (
                  <div className="max-w-3xl h-[480px] bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
                    {/* Chat log displays */}
                    <div
                      ref={scrollRef}
                      className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
                    >
                      {/* Base Welcome Msg if chat log empty */}
                      {(chatLogs[`${activeBoard}-${selectedSubject.id}`] || []).length === 0 && (
                        <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl text-xs leading-relaxed text-indigo-950 font-medium max-w-xl">
                          👋 Welcome to the **{selectedSubject.name}** AI tutor! 
                          I am loaded with the CISCE board guidelines. Feel free to prompt questions such as:
                          <ul className="list-disc pl-4 mt-2 space-y-1 font-mono text-[10.5px]">
                            <li><em>&quot;Draft a 4-week study timetable.&quot;</em></li>
                            <li><em>&quot;What are some common high-scoring chapters?&quot;</em></li>
                            <li><em>&quot;Generate an MCQ mockup set to check my knowledge.&quot;</em></li>
                            <li><em>&quot;Can you explain some topics from Section B?&quot;</em></li>
                          </ul>
                        </div>
                      )}

                      {(chatLogs[`${activeBoard}-${selectedSubject.id}`] || []).map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[78%] px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-xs whitespace-pre-line ${
                              msg.role === "user"
                                ? "bg-indigo-600 text-white font-semibold rounded-tr-none"
                                : "bg-white border border-slate-200 text-slate-800 rounded-tl-none font-medium text-slate-700 prose prose-slate max-w-full"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}

                      {/* Msg sending wait bubble */}
                      {isSendingMsg && (
                        <div className="flex justify-start">
                          <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                            <span className="flex gap-1">
                              <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold font-mono">Tutor is analyzing curriculum...</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Text Input area */}
                    <div className="border-t border-slate-200 p-3 sm:p-4 bg-white flex items-center gap-3">
                      <input
                        type="text"
                        value={advisorInput}
                        onChange={(e) => setAdvisorInput(e.target.value)}
                        placeholder={`Ask questions about ${selectedSubject.name}...`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !isSendingMsg) {
                            sendAdvisorMessage();
                          }
                        }}
                        disabled={isSendingMsg}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white text-slate-800"
                      />
                      <button
                        onClick={sendAdvisorMessage}
                        disabled={isSendingMsg || !advisorInput.trim()}
                        className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition"
                        title="Send Message"
                      >
                        <Send className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Drawer status footer for desktop screen sizes */}
              <div className="bg-slate-900 border-t border-slate-800 text-[10px] text-slate-500 px-5 py-2.5 flex justify-between items-center shrink-0">
                <span>CISCE Academic Curriculum Workspace &copy; 2026</span>
                <span>Powered by Gemini 3.5 AI Core</span>
              </div>
            </motion.div>
          );
        })()}
        </AnimatePresence>

        {/* GUIDED SUBJECT COMBINATIONS ADVISOR MODAL */}
        <AnimatePresence>
        {showAdvisorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Blurry Dark Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdvisorModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Body Container */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
            >
              {/* Header Title with decorative top bar accent */}
              <div className="bg-[#0c2340] text-white p-5 sm:p-6 shrink-0 relative overflow-hidden flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-2">
                    <Compass className="h-5 w-5 text-amber-400 animate-spin-slow" />
                    Guided Subject Choice Advisor
                  </h3>
                  <p className="text-[11px] text-slate-350 leading-normal mt-1 max-w-md">
                    Analyze dynamic pathways to establish compliance and align streams to target medical, software, or public careers.
                  </p>
                </div>
                <button
                  onClick={() => setShowAdvisorModal(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Step indicator bar */}
              <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 shrink-0 flex items-center justify-between">
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider font-mono">
                  Progress Step {advisorStep} of 4
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                        step <= advisorStep ? "bg-teal-500" : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Scrollable Center Form Content */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 scrollbar-thin space-y-6">
                
                {/* STEP 1: BOARD CLASS LEVEL SELECTION */}
                {advisorStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">Select your academic milestone level:</h4>
                      <p className="text-xs text-slate-500 font-semibold">
                        ICSE Class 10 focuses on general foundations (7 subjects), while ISC Class 12 offers specialized streamlined combinations (4 to 6 subjects).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-sans">
                      <div
                        onClick={() => setAdvisorModalBoard("ICSE")}
                        className={`p-5 rounded-2xl border-2 transition cursor-pointer text-left space-y-2 flex flex-col justify-between ${
                          advisorModalBoard === "ICSE"
                            ? "border-teal-500 bg-teal-50/20"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="text-2xl">🏫</span>
                          <h5 className="text-xs font-black text-slate-900 leading-none">ICSE Class 10</h5>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">General Secondary Certificate. Compulsory Language, Literature, Geography/History and choice of electives.</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono font-black text-teal-600">
                          <span>Group A, B, and C constraints</span>
                          <span>&rarr;</span>
                        </div>
                      </div>

                      <div
                        onClick={() => setAdvisorModalBoard("ISC")}
                        className={`p-5 rounded-2xl border-2 transition cursor-pointer text-left space-y-2 flex flex-col justify-between ${
                          advisorModalBoard === "ISC"
                            ? "border-teal-500 bg-teal-50/20"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="text-2xl">🎓</span>
                          <h5 className="text-xs font-black text-slate-900 leading-none">ISC Class 12</h5>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">Higher Secondary Certificate. Deeply streamlined streams aligning to professional sciences, commerce, or humanities.</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono font-black text-teal-600">
                          <span>Specialization stream matrices</span>
                          <span>&rarr;</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: INTERESTS MULTIPLEX SELECT */}
                {advisorStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">What academic exercises interest you?</h4>
                      <p className="text-xs text-slate-500 font-semibold">
                        Choose up to 3 areas from the list below that match your strengths.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {[
                        { id: "logic", label: "Math, Logic & Code structure", icon: "💻", desc: "Formulas, abstract logic, programming databases." },
                        { id: "bio", label: "Human Anatomy, Biology & Healing", icon: "🧬", desc: "Cellular networks, botanics, medical research." },
                        { id: "business", label: "Companies, Markets & Capital balance", icon: "📈", desc: "Double entry sheets, finance, commerce audits." },
                        { id: "creative", label: "Visual Arts, Writing & Aesthetics", icon: "🎨", desc: "Fine arts, literature prose, graphic drafts." },
                        { id: "civics", label: "History, Geopolitics & Public Advocacy", icon: "⚖️", desc: "Judicial constitutions, state policies, world timelines." },
                        { id: "env", label: "Ecology, Nature & Earth cycles", icon: "🌍", desc: "Environmental audits, atmospheric patterns." },
                      ].map((item) => {
                        const isChosen = selectedInterests.includes(item.id);
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              if (isChosen) {
                                setSelectedInterests(prev => prev.filter(x => x !== item.id));
                              } else {
                                if (selectedInterests.length < 3) {
                                  setSelectedInterests(prev => [...prev, item.id]);
                                }
                              }
                            }}
                            className={`p-4 rounded-xl border-2 transition cursor-pointer text-left space-y-1 relative flex flex-col justify-between ${
                              isChosen
                                ? "border-teal-500 bg-teal-50/15"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-lg">{item.icon}</span>
                                <h5 className="text-xs font-black text-slate-900 leading-none">{item.label}</h5>
                              </div>
                              <p className="text-[10.5px] text-slate-500 leading-normal mt-1.5 font-semibold">{item.desc}</p>
                            </div>
                            <div className="flex justify-end pt-2">
                              <span className={`text-[9px] font-black font-mono transition-colors uppercase ${
                                isChosen ? "text-teal-700" : "text-slate-400"
                              }`}>
                                {isChosen ? "Selected" : "Pick Option"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 3: CAREER TARGET PATHWAYS SELECT */}
                {advisorStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">Select your target professional dream:</h4>
                      <p className="text-xs text-slate-500 font-semibold">
                        Choose the primary pathway that describes your long-term goal.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin pt-2">
                      {[
                        { id: "Engineering, Robotics & AI Architect", label: "Engineering, Robotics & AI Architect", desc: "Specialize in structural mechanics, hardware computing, machine learning core, or civil builds.", icon: "🤖" },
                        { id: "Medicine, Bio-technology & Surgery", label: "Medicine, Bio-technology & Surgery", desc: "Focus on diagnostic medicine, healthcare therapies, pharmaceutical formulations, or biological research.", icon: "🩺" },
                        { id: "Chartered Accountant, Investment Banker or CFO", label: "Chartered Accountant, Investment Banker or CFO", desc: "Supervise national financial models, balance portfolios, execute tax codes, and audit accounts.", icon: "🏦" },
                        { id: "Data Scientist, Fullstack Developer or Tech Entrepreneur", label: "Data Scientist, Fullstack Developer or Tech Entrepreneur", desc: "Build scalable web systems, evaluate metrics, write dynamic apps, and bootstrap startups.", icon: "🚀" },
                        { id: "Civil Services (UPSC), Legal Practitioner or Diplomat", label: "Civil Services (UPSC), Legal Practitioner or Diplomat", desc: "Draft geopolitical strategies, contest legal court sessions, or join global ambassador ranks.", icon: "🏛️" },
                        { id: "Creative Designer, Fine Artist or UX Architect", label: "Creative Designer, Fine Artist or UX Architect", desc: "Craft interfaces for screens, paint fine galleries, write creative screenplays, or design spatial blueprints.", icon: "🎨" },
                        { id: "Business Tycoon, Management Consultant or Economist", label: "Business Tycoon, Management Consultant or Economist", desc: "Formulate business policies, consult executive boards, launch global organizations, or analyze markets.", icon: "💼" },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedCareer(item.id)}
                          className={`p-3.5 rounded-xl border-2 transition cursor-pointer text-left flex items-start gap-3 ${
                            selectedCareer === item.id
                              ? "border-teal-500 bg-teal-50/15"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <span className="text-2xl shrink-0 p-1 bg-slate-50 border border-slate-100 rounded-lg">{item.icon}</span>
                          <div className="space-y-0.5 text-left">
                            <h5 className="text-xs font-black text-slate-900 tracking-tight leading-none">{item.label}</h5>
                            <p className="text-[10px] text-slate-500 leading-normal font-medium pt-1">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 4: RECOMMENDATION DYNAMIC RESULTS ANALYSIS */}
                {advisorStep === 4 && selectedCareer && (() => {
                  const recommendation = solveOptimalSubjectCombination(advisorModalBoard, selectedCareer);
                  return (
                    <div className="space-y-5">
                      <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white p-5 rounded-2xl border border-white/5 space-y-3 relative overflow-hidden">
                        <div className="absolute right-0 top-0 h-full w-24 bg-[linear-gradient(135deg,rgba(20,184,166,0.02)_0%,rgba(20,184,166,0.1)_100%)] pointer-events-none" />
                        <div className="space-y-1 text-left">
                          <span className="text-[8.5px] font-black uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded tracking-widest font-mono">Expert Recommendation</span>
                          <h4 className="text-base font-extrabold text-white tracking-tight pt-1">
                            {recommendation.combinationTitle}
                          </h4>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                            {recommendation.rationale}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h5 className="text-xs font-black text-[#0c2340] tracking-tight uppercase font-mono flex items-center gap-1.5">
                          <span className="w-1.5 h-3 bg-teal-500 rounded" />
                          Recommended Subject Combinations Grid:
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                          {recommendation.subjectNames.map((subName, i) => {
                            const isCompulsory = i < (advisorModalBoard === "ICSE" ? 3 : 1);
                            return (
                              <div key={i} className="bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-2.5">
                                <div className="space-y-0.5">
                                  <span className="text-xs font-bold text-slate-900 leading-none">{subName}</span>
                                  <p className="text-[9px] text-slate-400 font-mono tracking-wider uppercase">
                                    {isCompulsory ? "Compulsory Group I" : "Recommended Elective"}
                                  </p>
                                </div>
                                <span className={`text-[8.5px] font-black uppercase tracking-tight px-1.5 py-0.5 rounded border ${
                                  isCompulsory 
                                    ? "bg-slate-100 text-slate-500 border-slate-200" 
                                    : "bg-teal-50 text-teal-700 border-teal-200 shadow-3xs"
                                }`}>
                                  {isCompulsory ? "Compulsory" : "Elective"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Warnings and system compliance alerts */}
                      <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-3 flex items-start gap-2 text-left">
                        <span className="text-amber-500 text-sm">💡</span>
                        <div className="space-y-0.5">
                          <h5 className="text-[10px] font-black text-amber-850 uppercase font-mono tracking-tight">Compliance Verification Pass</h5>
                          <p className="text-[10.5px] text-amber-800 leading-normal font-semibold">
                            This selection matches all mandatory {advisorModalBoard} group guidelines perfectly, satisfying group counts ({advisorModalBoard === "ICSE" ? "7" : "4-6"} subjects) and board core metrics.
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

              </div>

              {/* Action Buttons Footer */}
              <div className="bg-slate-50 border-t border-slate-150 p-4 shrink-0 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    if (advisorStep > 1) {
                      setAdvisorStep(prev => prev - 1);
                    } else {
                      setShowAdvisorModal(false);
                    }
                  }}
                  className="px-4 py-2 text-xs font-black text-slate-500 hover:text-slate-800 border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border"
                >
                  {advisorStep === 1 ? "Cancel" : "Back"}
                </button>

                <div className="flex gap-2">
                  {advisorStep < 4 ? (
                    <button
                      onClick={() => {
                        if (advisorStep === 1) {
                          setAdvisorStep(2);
                        } else if (advisorStep === 2) {
                          setAdvisorStep(3);
                        } else if (advisorStep === 3) {
                          if (selectedCareer) {
                            setAdvisorStep(4);
                          }
                        }
                      }}
                      disabled={advisorStep === 3 && !selectedCareer}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        advisorStep === 3 && !selectedCareer
                          ? "bg-slate-300 pointer-events-none"
                          : "bg-teal-600 hover:bg-teal-700 text-white"
                      }`}
                    >
                      <span>Next Step</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const recommendation = solveOptimalSubjectCombination(advisorModalBoard, selectedCareer);
                        setActiveBoard(advisorModalBoard);
                        setSelectedSubjectIds(recommendation.subjectIds);
                        setShowAdvisorModal(false);
                      }}
                      className="px-5 py-2.5 bg-[#0c2340] text-amber-400 hover:bg-slate-900 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs hover:text-white"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Load Pathway into Scheduler &amp; Planner</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
        </AnimatePresence>

        {/* Back Screen Mask Shade for open Drawer */}
        {selectedSubject && (
          <div
            onClick={() => setSelectedSubject(null)}
            className="fixed inset-0 bg-slate-900/35 backdrop-blur-2xs z-30 transition-all duration-300 pointer-events-auto"
          />
        )}

        {/* Footer */}
        <footer className="mt-12 h-12 bg-white border border-slate-200 rounded-2xl px-8 flex items-center justify-between text-[10px] text-slate-400 font-medium shadow-2xs">
          <div>Council for the Indian School Certificate Examinations</div>
          <div className="flex gap-4 items-center">
            <span>Curriculum Ver. 2026-27</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> 
              Academic Server Online
            </span>
          </div>
        </footer>

      </motion.div>
    </div>
  );
}

// Utility mapper to calculate the specific groups name
function selectedBoardKey(subId: string) {
  if (subId.startsWith("icse")) {
    return "ICSE (Class 10)";
  } else {
    return "ISC (Class 12)";
  }
}

// Structure for custom academic themes requested by user
export interface SubjectTheme {
  primary: string;
  badgeBg: string;
  gradientFrom: string;
  gradientTo: string;
  fontFamily: string;
  ringClass: string;
  activeBg: string;
  hoverBorder: string;
  accentText: string;
  imageUrl: string;
}

// Map each subject to a dedicated, high-contrast style, custom font, and a completely unique, relevant photograph
function getSubjectTheme(sub: Subject): SubjectTheme {
  const lowercase = sub.name.toLowerCase();

  // Specific Switch for Subject IDs to guarantee 100% uniqueness and themes related to the subjects themselves
  switch (sub.id) {
    // ---- ICSE CLASS X ----
    case "icse-eng":
      return {
        primary: "#1e1b4b",
        badgeBg: "bg-indigo-950/40 text-indigo-250 border border-indigo-700/50",
        gradientFrom: "from-indigo-950",
        gradientTo: "to-slate-950",
        fontFamily: "font-serif font-black italic tracking-normal",
        ringClass: "ring-2 ring-indigo-500 border-indigo-400 bg-indigo-950/10",
        activeBg: "bg-indigo-950/20",
        hoverBorder: "hover:border-indigo-400",
        accentText: "text-indigo-400",
        imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1000"
      };
    case "icse-lang":
      return {
        primary: "#ea580c",
        badgeBg: "bg-orange-950/40 text-orange-200 border border-orange-700/50",
        gradientFrom: "from-orange-950",
        gradientTo: "to-slate-950",
        fontFamily: "font-sans font-extrabold tracking-tight",
        ringClass: "ring-2 ring-orange-500 border-orange-400 bg-orange-950/10",
        activeBg: "bg-orange-950/20",
        hoverBorder: "hover:border-orange-400",
        accentText: "text-orange-400",
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000"
      };
    case "icse-hcg":
      return {
        primary: "#b45309",
        badgeBg: "bg-amber-950/40 text-amber-250 border border-amber-700/50",
        gradientFrom: "from-amber-950",
        gradientTo: "to-slate-950",
        fontFamily: "font-serif font-extrabold tracking-tight",
        ringClass: "ring-2 ring-amber-500 border-amber-400 bg-amber-950/10",
        activeBg: "bg-amber-950/20",
        hoverBorder: "hover:border-amber-400",
        accentText: "text-amber-400",
        imageUrl: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&q=80&w=1000"
      };
    case "icse-math":
      return {
        primary: "#0284c7",
        badgeBg: "bg-sky-950/40 text-sky-200 border border-sky-700/50",
        gradientFrom: "from-sky-950",
        gradientTo: "to-slate-950",
        fontFamily: "font-mono font-semibold tracking-wide",
        ringClass: "ring-2 ring-sky-500 border-sky-400 bg-sky-950/105",
        activeBg: "bg-sky-950/20",
        hoverBorder: "hover:border-sky-450",
        accentText: "text-sky-400",
        imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000"
      };
    case "icse-sci":
      return {
        primary: "#0d9488",
        badgeBg: "bg-teal-950/40 text-teal-200 border border-teal-700/50",
        gradientFrom: "from-teal-950",
        gradientTo: "to-slate-950",
        fontFamily: "font-sans font-bold tracking-wider",
        ringClass: "ring-2 ring-teal-500 border-teal-400 bg-teal-950/10",
        activeBg: "bg-teal-950/20",
        hoverBorder: "hover:border-teal-400",
        accentText: "text-teal-400",
        imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1000"
      };
    case "icse-comm":
      return {
        primary: "#334155",
        badgeBg: "bg-slate-950/40 text-slate-200 border border-slate-705/50",
        gradientFrom: "from-slate-900",
        gradientTo: "to-slate-950",
        fontFamily: "font-mono tracking-tight",
        ringClass: "ring-2 ring-slate-500 border-slate-400 bg-slate-950/10",
        activeBg: "bg-slate-950/20",
        hoverBorder: "hover:border-slate-450",
        accentText: "text-slate-400",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000"
      };
    case "icse-eco":
      return {
        primary: "#0369a1",
        badgeBg: "bg-sky-950/40 text-sky-205 border border-sky-700/50",
        gradientFrom: "from-sky-950",
        gradientTo: "to-slate-950",
        fontFamily: "font-sans tracking-tight font-extrabold",
        ringClass: "ring-2 ring-sky-500 border-sky-400 bg-sky-950/10",
        activeBg: "bg-sky-950/20",
        hoverBorder: "hover:border-sky-400",
        accentText: "text-sky-400",
        imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1000"
      };
    case "icse-evs":
      return {
        primary: "#16a34a",
        badgeBg: "bg-green-950/40 text-green-200 border border-green-700/50",
        gradientFrom: "from-green-950",
        gradientTo: "to-slate-950",
        fontFamily: "font-sans font-medium tracking-tight",
        ringClass: "ring-2 ring-green-500 border-green-400 bg-green-950/10",
        activeBg: "bg-green-950/20",
        hoverBorder: "hover:border-green-400",
        accentText: "text-green-400",
        imageUrl: "https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&q=80&w=1000"
      };
    case "icse-comp":
      return {
        primary: "#0f172a",
        badgeBg: "bg-slate-950/40 text-slate-200 border border-slate-700/50",
        gradientFrom: "from-slate-955",
        gradientTo: "to-slate-950",
        fontFamily: "font-mono font-black text-rose-450",
        ringClass: "ring-2 ring-slate-550 border-slate-600 bg-slate-950/10",
        activeBg: "bg-slate-950/20",
        hoverBorder: "hover:border-slate-500",
        accentText: "text-rose-400",
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000"
      };
    case "icse-pe":
      return {
        primary: "#65a30d",
        badgeBg: "bg-lime-950/40 text-lime-200 border border-lime-700/50",
        gradientFrom: "from-lime-950",
        gradientTo: "to-slate-950",
        fontFamily: "font-sans italic font-black text-white",
        ringClass: "ring-2 ring-lime-500 border-lime-400 bg-lime-950/10",
        activeBg: "bg-lime-950/20",
        hoverBorder: "hover:border-lime-400",
        accentText: "text-lime-450",
        imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1000"
      };
    case "icse-eco-app":
      return {
        primary: "#0284c7",
        badgeBg: "bg-sky-950/40 text-sky-200 border border-sky-700/50",
        gradientFrom: "from-sky-950",
        gradientTo: "to-slate-950",
        fontFamily: "font-sans tracking-tight font-extrabold",
        ringClass: "ring-2 ring-sky-500 border-sky-400 bg-sky-950/10",
        activeBg: "bg-sky-950/20",
        hoverBorder: "hover:border-sky-500",
        accentText: "text-sky-400",
        imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1000"
      };
    case "icse-comm-app":
      return {
        primary: "#475569",
        badgeBg: "bg-slate-950/40 text-slate-200 border border-slate-750/50",
        gradientFrom: "from-slate-950",
        gradientTo: "to-slate-950",
        fontFamily: "font-mono tracking-tight",
        ringClass: "ring-2 ring-slate-500 border-slate-600 bg-slate-950/10",
        activeBg: "bg-slate-950/20",
        hoverBorder: "hover:border-slate-500",
        accentText: "text-slate-400",
        imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1000"
      };
    case "icse-art":
      return {
        primary: "#db2777",
        badgeBg: "bg-pink-950/40 text-pink-205 border border-pink-700/50",
        gradientFrom: "from-pink-950",
        gradientTo: "to-slate-950",
        fontFamily: "font-sans font-black uppercase text-pink-350",
        ringClass: "ring-2 ring-pink-500 border-pink-400 bg-pink-950/10",
        activeBg: "bg-pink-950/20",
        hoverBorder: "hover:border-pink-400",
        accentText: "text-pink-400",
        imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1000"
      };
    case "icse-ai-robotics":
      return {
        primary: "#0f172a",
        badgeBg: "bg-amber-950/40 text-amber-205 border border-amber-700/50",
        gradientFrom: "from-[#0c2340]",
        gradientTo: "to-slate-950",
        fontFamily: "font-mono uppercase tracking-widest font-black text-amber-300",
        ringClass: "ring-2 ring-amber-500 border-amber-400 bg-amber-950/10",
        activeBg: "bg-amber-950/20",
        hoverBorder: "hover:border-amber-400",
        accentText: "text-amber-400",
        imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000"
      };

    // ---- ISC CLASS XII ----
    case "isc-eng":
      return {
        primary: "#4f46e5",
        badgeBg: "bg-indigo-950/40 text-indigo-400 border border-indigo-700/50",
        gradientFrom: "from-indigo-950",
        gradientTo: "to-slate-950",
        fontFamily: "font-serif font-black tracking-normal italic text-indigo-300",
        ringClass: "ring-2 ring-indigo-500 border-indigo-400 bg-indigo-950/10",
        activeBg: "bg-indigo-950/20",
        hoverBorder: "hover:border-indigo-400",
        accentText: "text-indigo-400",
        imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1000"
      };
    case "isc-physics":
      return {
        primary: "#2563eb",
        badgeBg: "bg-blue-950/40 text-blue-200 border border-blue-700/50",
        gradientFrom: "from-blue-950",
        gradientTo: "to-slate-950",
        fontFamily: "font-mono font-bold tracking-tight text-blue-300",
        ringClass: "ring-2 ring-blue-500 border-blue-400 bg-blue-950/10",
        activeBg: "bg-blue-950/20",
        hoverBorder: "hover:border-blue-455",
        accentText: "text-blue-400",
        imageUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=1000"
      };
    case "isc-chemistry":
      return {
        primary: "#7c3aed",
        badgeBg: "bg-violet-950/40 text-violet-200 border border-violet-700/50",
        gradientFrom: "from-violet-950",
        gradientTo: "to-slate-950",
        fontFamily: "font-sans font-extrabold tracking-tight text-violet-300",
        ringClass: "ring-2 ring-violet-500 border-violet-400 bg-violet-950/10",
        activeBg: "bg-violet-950/20",
        hoverBorder: "hover:border-violet-400",
        accentText: "text-violet-400",
        imageUrl: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&q=80&w=1000"
      };
    case "isc-biology":
      return {
        primary: "#059669",
        badgeBg: "bg-emerald-950/40 text-emerald-250 border border-emerald-700/50",
        gradientFrom: "from-emerald-950",
        gradientTo: "to-slate-950",
        fontFamily: "font-sans font-semibold tracking-tight text-emerald-300",
        ringClass: "ring-2 ring-emerald-500 border-emerald-400 bg-emerald-950/10",
        activeBg: "bg-emerald-950/20",
        hoverBorder: "hover:border-emerald-550",
        accentText: "text-emerald-450",
        imageUrl: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&q=80&w=1000"
      };
    case "isc-math":
      return {
        primary: "#0284c7",
        badgeBg: "bg-sky-950/40 text-sky-200 border border-sky-700/50",
        gradientFrom: "from-sky-950",
        gradientTo: "to-slate-950",
        fontFamily: "font-mono font-semibold tracking-wide text-sky-305",
        ringClass: "ring-2 ring-sky-500 border-sky-400 bg-sky-950/10",
        activeBg: "bg-sky-950/20",
        hoverBorder: "hover:border-sky-500",
        accentText: "text-sky-450",
        imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=1000"
      };
    case "isc-cs":
      return {
        primary: "#0f172a",
        badgeBg: "bg-slate-950/40 text-slate-205 border border-slate-700/50",
        gradientFrom: "from-slate-955",
        gradientTo: "to-slate-950",
        fontFamily: "font-mono font-black text-rose-405",
        ringClass: "ring-2 ring-slate-500 border-slate-600 bg-slate-950/10",
        activeBg: "bg-slate-950/20",
        hoverBorder: "hover:border-slate-500",
        accentText: "text-rose-450",
        imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1000"
      };
    case "isc-accounts":
      return {
        primary: "#334155",
        badgeBg: "bg-slate-950/40 text-slate-200 border border-slate-750/50",
        gradientFrom: "from-slate-900",
        gradientTo: "to-slate-950",
        fontFamily: "font-mono tracking-tight",
        ringClass: "ring-2 ring-slate-550 border-slate-500 bg-slate-950/10",
        activeBg: "bg-slate-950/20",
        hoverBorder: "hover:border-slate-500",
        accentText: "text-slate-400",
        imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000"
      };
    case "isc-commerce-sub":
      return {
        primary: "#1e293b",
        badgeBg: "bg-slate-950/40 text-slate-200 border border-slate-720/50",
        gradientFrom: "from-slate-950",
        gradientTo: "to-slate-950",
        fontFamily: "font-sans font-extrabold text-white",
        ringClass: "ring-2 ring-slate-500 border-slate-650 bg-slate-950/10",
        activeBg: "bg-slate-950/20",
        hoverBorder: "hover:border-slate-500",
        accentText: "text-slate-350",
        imageUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1000"
      };
    case "isc-eco":
      return {
        primary: "#0284c7",
        badgeBg: "bg-sky-950/40 text-sky-200 border border-sky-700/50",
        gradientFrom: "from-sky-950",
        gradientTo: "to-slate-950",
        fontFamily: "font-sans tracking-tight font-extrabold text-sky-300",
        ringClass: "ring-2 ring-sky-500 border-sky-400 bg-sky-950/10",
        activeBg: "bg-sky-950/20",
        hoverBorder: "hover:border-sky-500",
        accentText: "text-sky-400",
        imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1000"
      };
    case "isc-bst":
      return {
        primary: "#475569",
        badgeBg: "bg-slate-950/40 text-slate-200 border border-slate-700/50",
        gradientFrom: "from-slate-900",
        gradientTo: "to-slate-950",
        fontFamily: "font-sans font-bold",
        ringClass: "ring-2 ring-slate-550 border-slate-600 bg-slate-950/10",
        activeBg: "bg-slate-950/20",
        hoverBorder: "hover:border-slate-500",
        accentText: "text-slate-400",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000"
      };
    case "isc-history":
      return {
        primary: "#b45309",
        badgeBg: "bg-amber-950/40 text-amber-250 border border-amber-700/50",
        gradientFrom: "from-amber-950",
        gradientTo: "to-slate-950",
        fontFamily: "font-serif font-extrabold tracking-tight text-amber-300",
        ringClass: "ring-2 ring-amber-500 border-amber-400 bg-amber-950/10",
        activeBg: "bg-amber-950/20",
        hoverBorder: "hover:border-amber-400",
        accentText: "text-amber-400",
        imageUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=1000"
      };
    case "isc-polsci":
      return {
        primary: "#be123c",
        badgeBg: "bg-[#4c0519]/70 text-rose-250 border border-rose-700/50",
        gradientFrom: "from-[#4c0519]",
        gradientTo: "to-slate-950",
        fontFamily: "font-sans uppercase font-black text-rose-300",
        ringClass: "ring-2 ring-rose-500 border-rose-450 bg-[#4c0519]/10",
        activeBg: "bg-[#4c0519]/20",
        hoverBorder: "hover:border-rose-400",
        accentText: "text-rose-455",
        imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=1000"
      };
    case "isc-geography":
      return {
        primary: "#0d9488",
        badgeBg: "bg-teal-950/40 text-teal-250 border border-teal-700/50",
        gradientFrom: "from-teal-950",
        gradientTo: "to-slate-950",
        fontFamily: "font-mono font-medium text-teal-300",
        ringClass: "ring-2 ring-teal-500 border-teal-400 bg-teal-950/10",
        activeBg: "bg-teal-950/20",
        hoverBorder: "hover:border-teal-400",
        accentText: "text-teal-400",
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000"
      };
    case "isc-sociology":
      return {
        primary: "#db2777",
        badgeBg: "bg-pink-950/40 text-pink-200 border border-pink-700/50",
        gradientFrom: "from-pink-950",
        gradientTo: "to-slate-950",
        fontFamily: "font-sans tracking-wide text-pink-300",
        ringClass: "ring-2 ring-pink-500 border-pink-400 bg-pink-950/10",
        activeBg: "bg-pink-950/20",
        hoverBorder: "hover:border-pink-500",
        accentText: "text-pink-400",
        imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1000"
      };
    case "isc-psychology":
      return {
        primary: "#7c3aed",
        badgeBg: "bg-purple-950/40 text-purple-200 border border-purple-700/50",
        gradientFrom: "from-purple-950",
        gradientTo: "to-slate-950",
        fontFamily: "font-serif tracking-tight font-black text-purple-300",
        ringClass: "ring-2 ring-purple-500 border-purple-400 bg-purple-10s/10",
        activeBg: "bg-purple-950/20",
        hoverBorder: "hover:border-purple-400",
        accentText: "text-purple-400",
        imageUrl: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=1000"
      };
  }

  // ---- KEYWORD-BASED BACKWARDS COMPATIBLE FALLBACK ----
  // 1. Robotics and Artificial Intelligence
  if (lowercase.includes("robotics") || lowercase.includes("artificial")) {
    return {
      primary: "#0c2340",
      badgeBg: "bg-amber-100/80 text-[#0c2340] border border-amber-300",
      gradientFrom: "from-[#0c2340]",
      gradientTo: "to-[#1e293b]",
      fontFamily: "font-mono uppercase tracking-widest font-black",
      ringClass: "ring-2 ring-amber-500 border-amber-400 bg-amber-500/5",
      activeBg: "bg-amber-50/20",
      hoverBorder: "hover:border-amber-400",
      accentText: "text-amber-600",
      imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000"
    };
  }
  
  // 2. Physics
  if (lowercase.includes("physics")) {
    return {
      primary: "#2563eb",
      badgeBg: "bg-blue-50 text-blue-800 border border-blue-200",
      gradientFrom: "from-[#1e293b]",
      gradientTo: "to-[#0f172a]",
      fontFamily: "font-mono font-bold tracking-tight",
      ringClass: "ring-2 ring-blue-600 border-blue-500 bg-blue-50/10",
      activeBg: "bg-blue-50/10",
      hoverBorder: "hover:border-blue-500",
      accentText: "text-blue-600",
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000"
    };
  }

  // 3. Chemistry
  if (lowercase.includes("chemistry") || lowercase.includes("chem")) {
    return {
      primary: "#7c3aed",
      badgeBg: "bg-violet-50 text-violet-800 border border-violet-200",
      gradientFrom: "from-[#2e1065]",
      gradientTo: "to-[#0c0a09]",
      fontFamily: "font-sans font-extrabold tracking-tight",
      ringClass: "ring-2 ring-violet-600 border-violet-400 bg-violet-50/10",
      activeBg: "bg-violet-50/10",
      hoverBorder: "hover:border-violet-500",
      accentText: "text-violet-600",
      imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?auto=format&fit=crop&q=80&w=1000"
    };
  }

  // 4. Mathematics
  if (lowercase.includes("math")) {
    return {
      primary: "#0284c7",
      badgeBg: "bg-sky-50 text-sky-800 border border-sky-200",
      gradientFrom: "from-[#0c4a6e]",
      gradientTo: "to-[#021d30]",
      fontFamily: "font-mono font-semibold tracking-wide",
      ringClass: "ring-2 ring-sky-600 border-sky-450 bg-sky-50/10",
      activeBg: "bg-sky-50/10",
      hoverBorder: "hover:border-sky-500",
      accentText: "text-sky-650",
      imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=1000"
    };
  }

  // 5. Biology
  if (lowercase.includes("biology") || lowercase.includes("bio")) {
    return {
      primary: "#059669",
      badgeBg: "bg-emerald-50 text-emerald-800 border border-emerald-200",
      gradientFrom: "from-[#064e3b]",
      gradientTo: "to-[#022c22]",
      fontFamily: "font-sans font-semibold tracking-tight",
      ringClass: "ring-2 ring-emerald-700 border-emerald-550 bg-emerald-50/10",
      activeBg: "bg-emerald-50/10",
      hoverBorder: "hover:border-emerald-600",
      accentText: "text-emerald-700",
      imageUrl: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&q=80&w=1000"
    };
  }

  // 6. English
  if (lowercase.includes("english") || lowercase.includes("literature")) {
    return {
      primary: "#4f46e5",
      badgeBg: "bg-indigo-50 text-indigo-800 border border-indigo-200",
      gradientFrom: "from-[#31108f]",
      gradientTo: "to-[#0f172a]",
      fontFamily: "font-serif font-black tracking-normal italic",
      ringClass: "ring-2 ring-indigo-600 border-indigo-400 bg-indigo-50/10",
      activeBg: "bg-indigo-50/10",
      hoverBorder: "hover:border-indigo-500",
      accentText: "text-indigo-650",
      imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1000"
    };
  }

  // 7. General Sciences / Generic Science Class X
  if (lowercase.includes("science")) {
    return {
      primary: "#0d9488",
      badgeBg: "bg-teal-50 text-teal-800 border border-teal-200",
      gradientFrom: "from-[#115e59]",
      gradientTo: "to-[#042f2e]",
      fontFamily: "font-sans font-bold tracking-wider",
      ringClass: "ring-2 ring-teal-600 border-teal-400 bg-teal-50/10",
      activeBg: "bg-teal-50/10",
      hoverBorder: "hover:border-teal-500",
      accentText: "text-teal-650",
      imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1000"
    };
  }

  // 8. History, Civics & Geography / Humanities Generic
  if (lowercase.includes("history") || lowercase.includes("civics") || lowercase.includes("constitution")) {
    return {
      primary: "#b45309",
      badgeBg: "bg-amber-50 text-amber-800 border border-amber-250",
      gradientFrom: "from-[#78350f]",
      gradientTo: "to-[#1c0800]",
      fontFamily: "font-serif font-extrabold tracking-tight",
      ringClass: "ring-2 ring-amber-700 border-amber-500 bg-amber-50/10",
      activeBg: "bg-amber-50/10",
      hoverBorder: "hover:border-amber-600",
      accentText: "text-amber-800",
      imageUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=1000"
    };
  }

  // 9. Geography Core Class XII
  if (lowercase.includes("geography")) {
    return {
      primary: "#14b8a6",
      badgeBg: "bg-teal-50 text-teal-800 border border-teal-200",
      gradientFrom: "from-[#115e59]",
      gradientTo: "to-[#021e25]",
      fontFamily: "font-mono font-medium tracking-tight",
      ringClass: "ring-2 ring-teal-600 border-teal-500 bg-teal-50/15",
      activeBg: "bg-teal-50/15",
      hoverBorder: "hover:border-teal-500",
      accentText: "text-teal-700",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000"
    };
  }

  // 10. Computer Applications / CS
  if (lowercase.includes("computer") || lowercase.includes("cs")) {
    return {
      primary: "#0f172a",
      badgeBg: "bg-slate-100 text-slate-800 border border-slate-300",
      gradientFrom: "from-[#020617]",
      gradientTo: "to-[#090d1f]",
      fontFamily: "font-mono font-black text-rose-650",
      ringClass: "ring-2 ring-slate-800 border-slate-700 bg-slate-50",
      activeBg: "bg-slate-100/50",
      hoverBorder: "hover:border-slate-800",
      accentText: "text-[#0c2340]",
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000"
    };
  }

  // 11. Commercial Studies / Commercial Applications / Accounts
  if (lowercase.includes("commercial") || lowercase.includes("accounts") || lowercase.includes("accountancy") || lowercase.includes("business")) {
    return {
      primary: "#334155",
      badgeBg: "bg-slate-50 text-slate-800 border border-slate-200",
      gradientFrom: "from-[#1e293b]",
      gradientTo: "to-[#090f1a]",
      fontFamily: "font-mono tracking-tight",
      ringClass: "ring-2 ring-[#0c2340] border-slate-400 bg-slate-50/20",
      activeBg: "bg-slate-50/25",
      hoverBorder: "hover:border-slate-800",
      accentText: "text-slate-700",
      imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000"
    };
  }

  // 12. Economics / Economic Applications
  if (lowercase.includes("economic") || lowercase.includes("economics")) {
    return {
      primary: "#0369a1",
      badgeBg: "bg-sky-50 text-sky-800 border border-sky-100",
      gradientFrom: "from-[#075985]",
      gradientTo: "to-[#022a45]",
      fontFamily: "font-sans tracking-tight font-extrabold",
      ringClass: "ring-2 ring-sky-700 border-sky-500 bg-sky-50/20",
      activeBg: "bg-sky-50/20",
      hoverBorder: "hover:border-sky-500",
      accentText: "text-sky-700",
      imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1000"
    };
  }

  // 13. Environmental Science
  if (lowercase.includes("environmental") || lowercase.includes("env")) {
    return {
      primary: "#16a34a",
      badgeBg: "bg-green-50 text-green-800 border border-green-200",
      gradientFrom: "from-[#14532d]",
      gradientTo: "to-[#022d1a]",
      fontFamily: "font-sans font-medium tracking-tight",
      ringClass: "ring-2 ring-green-600 border-green-400 bg-green-50/10",
      activeBg: "bg-green-50/10",
      hoverBorder: "hover:border-green-500",
      accentText: "text-green-700",
      imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1000"
    };
  }

  // 14. Art
  if (lowercase.includes("art")) {
    return {
      primary: "#db2777",
      badgeBg: "bg-pink-50 text-pink-800 border border-pink-200",
      gradientFrom: "from-[#500724]",
      gradientTo: "to-[#18000a]",
      fontFamily: "font-sans font-black uppercase text-pink-650",
      ringClass: "ring-2 ring-pink-600 border-pink-400 bg-pink-50/10",
      activeBg: "bg-pink-50/10",
      hoverBorder: "hover:border-pink-500",
      accentText: "text-pink-600",
      imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1000"
    };
  }

  // 15. Music / Instrumental
  if (lowercase.includes("music") || lowercase.includes("instrumental") || lowercase.includes("singing")) {
    return {
      primary: "#d97706",
      badgeBg: "bg-amber-50 text-amber-800 border border-amber-200",
      gradientFrom: "from-[#78350f]",
      gradientTo: "to-[#000000]",
      fontFamily: "font-serif font-black tracking-normal",
      ringClass: "ring-2 ring-amber-600 border-amber-400 bg-amber-50/10",
      activeBg: "bg-amber-50/10",
      hoverBorder: "hover:border-amber-500",
      accentText: "text-amber-650",
      imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000"
    };
  }

  // 16. Second Language / Regional Languages (Hindi / Bengali / Sanskrit / Languages)
  if (lowercase.includes("hindi") || lowercase.includes("bengali") || lowercase.includes("sanskrit") || lowercase.includes("language") || lowercase.includes("classic")) {
    return {
      primary: "#ea580c",
      badgeBg: "bg-orange-50 text-orange-850 border border-orange-200",
      gradientFrom: "from-[#7c2d12]",
      gradientTo: "to-[#1c0a02]",
      fontFamily: "font-sans font-extrabold tracking-tight",
      ringClass: "ring-2 ring-orange-600 border-orange-400 bg-orange-50/5",
      activeBg: "bg-orange-50/10",
      hoverBorder: "hover:border-orange-500",
      accentText: "text-orange-600",
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000"
    };
  }

  // 17. Physical Education
  if (lowercase.includes("physical") || lowercase.includes("pe") || lowercase.includes("sports")) {
    return {
      primary: "#65a30d",
      badgeBg: "bg-lime-50 text-lime-800 border border-lime-200",
      gradientFrom: "from-[#3f6212]",
      gradientTo: "to-[#0c1a02]",
      fontFamily: "font-sans italic font-black text-lime-950",
      ringClass: "ring-2 ring-lime-700 border-lime-400 bg-lime-50/10",
      activeBg: "bg-lime-50/10",
      hoverBorder: "hover:border-lime-500",
      accentText: "text-lime-700",
      imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1000"
    };
  }

  // 18. Political Science Class XII
  if (lowercase.includes("political") || lowercase.includes("politics")) {
    return {
      primary: "#e11d48",
      badgeBg: "bg-rose-50 text-rose-800 border border-rose-200",
      gradientFrom: "from-[#4c0519]",
      gradientTo: "to-[#0f0104]",
      fontFamily: "font-serif tracking-tight font-black",
      ringClass: "ring-2 ring-rose-600 border-rose-400 bg-rose-50/10",
      activeBg: "bg-rose-50/10",
      hoverBorder: "hover:border-rose-500",
      accentText: "text-rose-650",
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1000"
    };
  }

  // 19. Sociology
  if (lowercase.includes("sociology") || lowercase.includes("society")) {
    return {
      primary: "#ec4899",
      badgeBg: "bg-pink-50 text-pink-700 border border-pink-200",
      gradientFrom: "from-[#831843]",
      gradientTo: "to-[#110103]",
      fontFamily: "font-sans tracking-wide",
      ringClass: "ring-2 ring-pink-600 border-pink-400 bg-pink-50/10",
      activeBg: "bg-pink-50/10",
      hoverBorder: "hover:border-pink-500",
      accentText: "text-pink-650",
      imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1000"
    };
  }

  // 20. Psychology
  if (lowercase.includes("psychology") || lowercase.includes("mind")) {
    return {
      primary: "#8b5cf6",
      badgeBg: "bg-purple-50 text-purple-800 border border-purple-200",
      gradientFrom: "from-[#4c1d95]",
      gradientTo: "to-[#05001a]",
      fontFamily: "font-serif tracking-tight font-black",
      ringClass: "ring-2 ring-purple-600 border-purple-400 bg-purple-50/10",
      activeBg: "bg-purple-50/10",
      hoverBorder: "hover:border-purple-500",
      accentText: "text-purple-650",
      imageUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=1000"
    };
  }

  // 21. Electricity and Electronics
  if (lowercase.includes("electricity") || lowercase.includes("electronics") || lowercase.includes("electric")) {
    return {
      primary: "#ea580c",
      badgeBg: "bg-orange-50 text-orange-850 border border-orange-200",
      gradientFrom: "from-[#6a2900]",
      gradientTo: "to-[#080200]",
      fontFamily: "font-mono font-bold tracking-tight",
      ringClass: "ring-2 ring-orange-600 border-orange-400 bg-orange-50/10",
      activeBg: "bg-orange-50/10",
      hoverBorder: "hover:border-orange-500",
      accentText: "text-orange-650",
      imageUrl: "https://images.unsplash.com/photo-1517420784547-a3c57e8e39ad?auto=format&fit=crop&q=80&w=1000"
    };
  }

  // 22. Cooking / Home Sciences / Fallback
  return {
    primary: "#0f172a",
    badgeBg: "bg-slate-100 text-slate-800 border border-slate-200",
    gradientFrom: "from-[#334155]",
    gradientTo: "to-[#020617]",
    fontFamily: "font-sans",
    ringClass: "ring-2 ring-slate-800 border-slate-700 bg-slate-50",
    activeBg: "bg-slate-100/50",
    hoverBorder: "hover:border-slate-800",
    accentText: "text-indigo-650",
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1000"
  };
}
