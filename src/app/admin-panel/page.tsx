"use client"
import { useRouter } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import { motion, type Variants } from "framer-motion"
import {
  Search,
  Download,
  Users,
  Filter,
  FileText,
  Eye,
  Mail,
  Phone,
  Linkedin,
  ExternalLink,
  FileDown,
  Calendar,
  Plus,
  Settings,
  BarChart3,
  Copy,
  CheckCircle,
  X,
  Edit,
  Trash2,
  Bell,
  FileCheck,
  Send,
} from "lucide-react"
import { supabase } from "../../lib/SupabaseAuthClient"
import { supabaseAdmin } from "../../lib/supabase-admin"
import toast from "react-hot-toast"
import { Toaster } from "@/components/ui/toaster"
import MultiSelectFilter from "@/src/components/MultiSelectFilter"

// Animation variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
}


const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
}

type Freelancer = {
  id: string
  created_at: string
  full_name: string
  email: string
  phone: string
  resume_url?: string
  linkedin_url?: string
  portfolio_url?: string
  category: string
  category_other?: string
  domains: string[]
  domains_other?: string
  tech_stack: string[]
  tech_other?: string
  tools: string[]
  tools_other?: string
  employment_status?: string
  employment_other?: string
  experience_level?: string
  experience_other?: string
  updated_at: string
  [key: string]: any
}

export type Form = {
  id: string
  form_id: string
  form_name: string
  form_description: string
  category: string
  subcategory: string
  industry: string
  tech_stack?: string | null
  tools?: string | null
  created_by: string // NEW ✅ tracks who created the form
  created_at: string
  is_active: boolean
  form_message?: string | null
  required_fields?: string[]
  custom_questions?: any[]
  submission_count?: number
}


type FormSubmission = {
  id: string
  form_id: string
  name: string
  email: string
  phone: string
  portfolio_link?: string
  github_link?: string
  resume_link?: string
  years_experience?: number
  proposal_link?: string
  custom_responses?: any
  created_at: string
  profile_rating?: number
  is_selected: boolean
  selection_notes?: string | null
  selection_date?: string | null
  selected_by?: string | null
  updated_at: string
}

type SearchFilters = {
  category?: string
  subcategory: string
  main_category: string
  experience_level: string
  passing_year: string
  tech_stack: string[]
  tools: string[]
  profile_rating: number | string
  search_text: string
  formTextId?: string
  years_experience?: string
}

type CategoryOptions = {
  [key: string]: {
    subcategories: string[];
    techStacks: string[];
    tools: Record<string, string[]>;
  };
};

const categoryOptions: CategoryOptions = {
  Development: {
    subcategories: [
      "Frontend",
      "Backend",
      "Full Stack",
      "Mobile App Development",
      "Game Development",
      "Blockchain",
      "Embedded Systems",
    ],
    techStacks: [
      "React",
      "Vue",
      "Angular",
      "Node.js",
      "Python",
      "Java",
      "PHP",
      ".NET",
      "React Native",
      "Flutter",
      "Unity",
      "Unreal Engine",
      "Rust",
      "Solidity",
    ],
    tools: {
      React: ["Redux", "Next.js", "Material-UI", "Styled Components", "TypeScript"],
      Vue: ["Vuex", "Nuxt.js", "Vuetify", "Vue Router", "TypeScript"],
      Angular: ["NgRx", "Angular Material", "TypeScript", "RxJS", "Ionic"],
      "Node.js": ["Express", "MongoDB", "PostgreSQL", "Redis", "Socket.io"],
      Python: ["Django", "Flask", "FastAPI", "PostgreSQL", "MongoDB"],
      Java: ["Spring Boot", "Hibernate", "Maven", "PostgreSQL", "Redis"],
      PHP: ["Laravel", "Symfony", "MySQL", "PostgreSQL", "Redis"],
      ".NET": ["ASP.NET Core", "Entity Framework", "SQL Server", "Azure", "C#"],
      "React Native": ["Expo", "Redux", "AsyncStorage", "React Navigation", "TypeScript"],
      Flutter: ["Dart", "Firebase", "Provider", "Bloc", "GetX"],
      Unity: ["C#", "Photon", "DOTS", "Unity Analytics", "Shader Graph"],
      "Unreal Engine": ["Blueprints", "C++", "Niagara", "MetaHuman", "Sequencer"],
      Solidity: ["Truffle", "Hardhat", "Remix", "Ganache", "Web3.js"],
    },
  },
  Design: {
    subcategories: ["UI/UX", "Graphic Design", "Web Design", "Product Design", "Motion Graphics", "3D Design"],
    techStacks: ["Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "After Effects", "Blender"],
    tools: {
      Figma: ["Auto Layout", "Components", "Prototyping", "Design Systems", "Plugins"],
      "Adobe XD": ["Prototyping", "Voice Prototyping", "Auto-Animate", "Repeat Grid", "Plugins"],
      Sketch: ["Symbols", "Libraries", "Prototyping", "Plugins", "Abstract"],
      Photoshop: ["Layer Styles", "Smart Objects", "Actions", "Brushes", "Filters"],
      Illustrator: ["Vector Graphics", "Typography", "Logos", "Icons", "Illustrations"],
      "After Effects": ["Motion Graphics", "VFX", "Keyframes", "Expressions", "Compositing"],
      Blender: ["Modeling", "Animation", "UV Mapping", "Rendering", "Sculpting"],
    },
  },
  Data: {
    subcategories: ["Data Science", "Data Analysis", "Machine Learning", "AI", "Big Data", "ETL"],
    techStacks: ["Python", "R", "SQL", "Tableau", "Power BI", "TensorFlow", "PyTorch", "Apache Spark"],
    tools: {
      Python: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Scikit-learn"],
      R: ["ggplot2", "dplyr", "tidyr", "Shiny", "RMarkdown"],
      SQL: ["PostgreSQL", "MySQL", "MongoDB", "BigQuery", "Snowflake"],
      Tableau: ["Dashboard", "Stories", "Calculations", "Parameters", "Actions"],
      TensorFlow: ["Keras", "TensorBoard", "TFX", "TensorFlow Lite", "TensorFlow.js"],
      "Apache Spark": ["PySpark", "Spark SQL", "MLlib", "Streaming", "GraphX"],
    },
  },
  DevOps: {
    subcategories: ["DevOps & Cloud Engineering", "Containerization & Orchestration", "CI/CD", "Cloud Platforms"],
    techStacks: [
      "Docker",
      "Kubernetes",
      "Terraform",
      "Jenkins",
      "GitHub Actions",
      "GitLab CI/CD",
      "AWS",
      "Azure",
      "Google Cloud",
      "DigitalOcean",
    ],
    tools: {
      Docker: ["Compose", "Swarm", "Registry", "BuildKit", "Docker CLI"],
      Kubernetes: ["Helm", "Kubectl", "Kustomize", "Operators", "Istio"],
      Terraform: ["Modules", "State", "Workspaces", "Providers", "Cloud Automation"],
      Jenkins: ["Pipelines", "Declarative Pipeline", "Plugins", "Blue Ocean"],
      "GitHub Actions": ["Workflows", "Secrets", "Self-hosted Runners"],
      "GitLab CI/CD": ["Pipelines", "Artifacts", "Runners", "Environments"],
      AWS: ["EC2", "S3", "EKS", "RDS", "IAM"],
      Azure: ["AKS", "VMs", "Functions", "Blob Storage", "Azure DevOps"],
      "Google Cloud": ["GKE", "Cloud Functions", "BigQuery", "Cloud Storage", "IAM"],
    },
  },
  Cybersecurity: {
    subcategories: ["Application Security", "Penetration Testing", "Network Security"],
    techStacks: ["Kali Linux", "Metasploit", "Snyk", "Veracode", "pfSense", "Cisco ASA", "Fortinet"],
    tools: {
      "Application Security": ["Snyk", "Veracode", "Burp Suite", "OWASP ZAP"],
      "Penetration Testing": ["Kali Linux", "Metasploit", "Nmap", "Hydra", "Wireshark"],
      "Network Security": ["pfSense", "Cisco ASA", "Fortinet", "Suricata", "Snort"],
    },
  },
  ITSupport: {
    subcategories: ["System Administration", "Helpdesk", "Network Administration"],
    techStacks: ["Linux", "Windows Server", "Active Directory"],
    tools: {
      Linux: ["Bash", "Cron", "Systemd", "FirewallD", "SSH"],
      "Windows Server": ["PowerShell", "Active Directory", "Group Policy", "IIS", "Hyper-V"],
      "Network Administration": ["Cisco CLI", "MikroTik", "VLAN", "VPN"],
    },
  },
  QA: {
    subcategories: ["Manual Testing", "Automation Testing", "Performance Testing", "Security Testing"],
    techStacks: ["Selenium", "Cypress", "Jest", "Postman", "JMeter", "TestRail", "Appium"],
    tools: {
      Selenium: ["WebDriver", "Grid", "IDE", "Page Object Model", "TestNG"],
      Cypress: ["Test Runner", "Dashboard", "Plugins", "Custom Commands", "Fixtures"],
      Jest: ["Mocking", "Snapshots", "Coverage", "Matchers", "Setup"],
      Postman: ["Collections", "Environments", "Tests", "Monitors", "Mock Servers"],
      Appium: ["Mobile Testing", "UIAutomator", "XCUITest", "Espresso", "Cloud Testing"],
    },
  },
  Marketing: {
    subcategories: [
      "Digital Marketing",
      "SEO",
      "Content Marketing",
      "Social Media Marketing",
      "Email Marketing",
      "Paid Ads",
    ],
    techStacks: ["Google Ads", "Facebook Ads", "HubSpot", "Hootsuite", "Buffer", "Mailchimp"],
    tools: {
      "Google Ads": ["Keyword Planner", "Ad Extensions", "Smart Bidding", "Conversion Tracking"],
      HubSpot: ["CRM", "Marketing Automation", "Landing Pages", "Workflows", "Lead Scoring"],
      Mailchimp: ["Campaigns", "A/B Testing", "Segmentation", "Automations"],
    },
  },
  Content: {
    subcategories: ["Copywriting", "Blog Writing", "Technical Writing", "Script Writing", "Proofreading"],
    techStacks: ["Grammarly", "Hemingway", "SurferSEO", "Google Docs"],
    tools: {
      Grammarly: ["Grammar Check", "Plagiarism Check", "Tone Adjustment"],
      Hemingway: ["Readability", "Clarity", "Sentence Structure"],
      SurferSEO: ["Content Editor", "Keyword Analysis", "Audit"],
    },
  },
  Video: {
    subcategories: ["Video Editing", "Animation", "YouTube Editing", "Short Videos", "Corporate Videos"],
    techStacks: ["Adobe Premiere Pro", "Final Cut Pro", "After Effects", "DaVinci Resolve"],
    tools: {
      "Adobe Premiere Pro": ["Transitions", "Effects", "Color Correction", "Audio Sync"],
      "Final Cut Pro": ["Magnetic Timeline", "Motion Graphics", "Color Grading"],
    },
  },
  Business: {
    subcategories: [
      "Virtual Assistance",
      "Project Management",
      "Customer Support",
      "Data Entry",
      "Finance & Accounting",
    ],
    techStacks: ["Asana", "Trello", "Slack", "QuickBooks", "Excel"],
    tools: {
      Asana: ["Tasks", "Timelines", "Workflows", "Automation"],
      Trello: ["Boards", "Power-Ups", "Labels", "Checklists"],
    },
  },
}

type SelectFilterOption = {
  label: string;
  value: string;
};

const mainCategoryOptions = [
  "Tech",
  "Design",
  "Non-Tech",
];

type SelectFilterProps = {
  label: string;
  value: string | undefined | number;
  onChange: (value: string) => void;
  options: (string | SelectFilterOption)[];
  placeholder?: string;
};

const SelectFilter = ({ label, value, onChange, options, placeholder }: SelectFilterProps) => (
  <div className="space-y-4">
    <label className="block text-sm font-semibold text-[#FFE01B]">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFE01B] transition-colors duration-300"
    >
      <option value="">{placeholder || `All ${label}`}</option>
      {options.map((opt) => {
        const optionValue = typeof opt === "string" ? opt : opt.value;
        const optionLabel = typeof opt === "string" ? opt : opt.label;

        return (
          <option key={optionValue} value={optionValue} className="bg-[#241C15]">
            {optionLabel}
          </option>
        );
      })}
    </select>
  </div>
);

// 🎓 Passing Year options
const passingYearOptions: string[] = [
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
  "2027",
  "2028",
  "2029",
  "2030",
];

// 🧑‍💻 Experience Year options
const experienceYearOptions: string[] = [
  "0",
  "1",
  "2",
  "3",
  "5",
];

// 🧰 Tech Stack options
const techStackOptions: string[] = [
  "React",
  "Vue",
  "Angular",
  "Node.js",
  "Python",
  "Java",
  "PHP",
  "Flutter",
  "React Native",
  "C++",
  "C#",
  "Rust",
  "Go",
];

// 🛠 Tools options
const toolsOptions: string[] = [
  "Git",
  "Docker",
  "Kubernetes",
  "VS Code",
  "Postman",
  "Figma",
  "Firebase",
  "Jira",
  "AWS",
  "GCP",
  "Vercel",
  "Netlify",
];

const categoryOptionss: Record<string, string[]> = {
  "Software Development": [
    "Full Stack Development",
    "Full-Stack Development",
    "Fullstack Development",
    "Frontend Development",
    "Front-End Development",
    "Backend Development",
    "Web Development",
    "MERN Stack Development",
    "Machine Learning",
    "Machine Learning and AI",
    "AI and Machine Learning",
    "AI Development",
    "Data Science",
    "Data Analytics",
    "Data Science & Development",
    "Embedded Systems",
    "Computer Vision",
    "MLOps and Cloud",
    "Quality Assurance",
    "Java Development",
    "DevOps",
    "Not Mentioned",
  ],
  // "Data Science": [
  //   "Machine Learning",
  //   "Data Analysis",
  //   "Data Engineering",
  //   "Not Mentioned",
  // ],
  // "Data Analysis": [
  //   "Data Analytics",
  //   "Data Engineering",
  //   "Business Analysis",
  // ],
  // "Machine Learning": [
  //   "AI Engineering",
  //   "Computer Vision",
  //   "Data Analysis",
  // ],
  // "Machine Learning & AI": [
  //   "MLOps",
  //   "AI Development",
  //   "Data Science",
  // ],
  "Artificial Intelligence": [
    "Machine Learning",
    "AI Engineering",
  ],
  // "Bioinformatics": [
  //   "Machine Learning",
  // ],
  "Marketing & Content": [
    "Digital Marketing",
    "Performance Marketing",
    "Media Buying",
    "PPC Management",
  ],
  "E-commerce Marketing": [
    "Digital Marketing",
  ],
  // "AI Automation": [
  //   "Automation Development",
  // ],
  // "Customer Support Automation": [
  //   "Workflow Automation",
  // ],
  // "Operations Management": [
  //   "Operational Efficiency",
  // ],
  // "Accounting": [
  //   "Bookkeeping",
  // ],
  // "Lead Generation": [
  //   "Not Mentioned",
  // ],
  // "Cybersecurity": [
  //   "Web Application Security",
  // ],
  "Video Editing": [
    "Video Production",
    "Content Creation",
    "Motion Graphics",
    "Social Media Management",
    "Visual Effects",
    "Editing",
    "Film Production",
    "Not Mentioned",
  ],
  "Content Creation": [
    "Video Production",
    "Video Editing",
  ],
  "Design": [
    "Graphic Design",
    "Branding",
    "UI/UX Design",
    "Digital Art",
    "Portfolio Presentation",
    "Illustration",
    "Design",
  ],
  "Graphic Design": [
    "Visual Design",
    "Portfolio Design",
    "Visual Arts",
    "Illustration",
    "Design",
    "Not Mentioned",
  ],
  "Visual Design": [
    "Brand Identity",
    "Web Design",
  ],
  // "Web Design": [
  //   "UI/UX Design",
  // ],
  // "Web Development": [
  //   "Portfolio Creation",
  // ],
  // "Portfolio Development": [
  //   "Web Design",
  //   "Web Development",
  //   "Graphic Design",
  //   "Design",
  //   "Visual Design",
  // ],
  // "Portfolio Design": [
  //   "Graphic Design",
  //   "Web Design",
  // ],
  // "Portfolio Creation": [
  //   "Graphic Design",
  //   "Web Development",
  //   "Design",
  // ],
  // "Portfolio Presentation": [
  //   "Not Mentioned",
  // ],
  // "Portfolio": [
  //   "Design",
  //   "Graphic Design",
  //   "Not Mentioned",
  // ],
  // "Custom Portfolio Development": [
  //   "Web Development",
  // ],
  // "Digital Portfolio": [
  //   "Design",
  // ],
  "Creative": [
    "Social Media Management",
  ],
  "Creative Portfolio": [
    "Design",
  ],
  "Consulting": [
    "Management",
  ],
  "DevOps": [
    "Cloud Automation",
  ],
  "Data Engineering": [
    "Data Pipeline Design",
  ],
  "Photography": [
    "Not Mentioned",
  ],
  "Video Production": [
    "Not Mentioned",
  ],
  "Not Mentioned": ["Not Mentioned"],
};

// ⭐ Rating options
const ratingOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((r) => ({
  label: r.toString(),
  value: r.toString(), // keep value as string
}))


export default function AdminPanel() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<"freelancers" | "forms">("freelancers")

  // Freelancer search state
  const [filters, setFilters] = useState<SearchFilters>({
    category: "",
    experience_level: "",
    search_text: "",
    subcategory: "",
    main_category: "",
    years_experience: "",
    passing_year: "",
    tech_stack: [],
    tools: [],
    profile_rating: "",
  })
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form management state
  const [forms, setForms] = useState<Form[]>([])
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([])
  const [selectedForm, setSelectedForm] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newForm, setNewForm] = useState({
    form_id: "",
    form_name: "",
    form_description: "",
    industry: "",
    category: "",
    subcategory: [] as string[],
    tech_stack: [] as string[],
    tools: [] as string[],
  })

  const [createFormLoading, setCreateFormLoading] = useState(false)
  const [copiedFormId, setCopiedFormId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [selectedTechStack, setSelectedTechStack] = useState("")
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([])
  const [availableTechStacks, setAvailableTechStacks] = useState<string[]>([])
  const [availableTools, setAvailableTools] = useState<string[]>([])

  // Other options state
  const [showOtherCategory, setShowOtherCategory] = useState(false)
  const [showOtherSubcategory, setShowOtherSubcategory] = useState(false)
  const [showOtherTechStack, setShowOtherTechStack] = useState(false)
  const [showOtherTools, setShowOtherTools] = useState(false)
  const [emailMessage, setEmailMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([])
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [dashboard, setDashboard] = useState<string>("")
  const [selectedRequiredFields, setSelectedRequiredFields] = useState<string[]>([
    "name",
    "email",
    "phone",
    "resume_link",
  ])
  const [customQuestions, setCustomQuestions] = useState<
    Array<{
      id: string
      type: "text" | "textarea" | "select" | "radio" | "checkbox"
      label: string
      required: boolean
      options?: string[]
    }>
  >([])

  const [editingForm, setEditingForm] = useState<Form | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)

  const [submissionFilters, setSubmissionFilters] = useState<{
    formTextId: string
    category: string
    subcategory: string
  }>({
    formTextId: "",
    category: "",
    subcategory: "",
  })

  const uniqueSubcategoriess = Array.from(
    new Set(Object.values(categoryOptionss).flat())
  );

  const [filterType, setFilterType] = useState<"all" | "selected" | "not_selected">("all");

  const toggleCandidateSelection = async (submissionId: string, isSelected: boolean) => {
    try {
      // Attempt to get current user's id from supabase auth (supporting both new and older clients)
      let clientId: string | null = null;
      try {
        if (supabase && typeof (supabase as any).auth?.getUser === "function") {
          const { data } = await (supabase as any).auth.getUser();
          clientId = data?.user?.id ?? null;
        } else if ((supabase as any).auth?.user) {
          // older supabase client API
          const user = (supabase as any).auth.user?.();
          clientId = user?.id ?? null;
        }
      } catch (err) {
        console.warn("Could not determine client id from supabase auth:", err);
        clientId = null;
      }

      const res = await fetch("/api/client/select-candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission_id: submissionId,
          is_selected: isSelected,
          selected_by: clientId, // may be null if not authenticated
        }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(`Candidate ${isSelected ? "selected" : "unselected"} successfully`);
        setFormSubmissions((prev) =>
          prev.map((sub) =>
            sub.id === submissionId
              ? {
                ...sub,
                is_selected: isSelected,
                selection_date: new Date().toISOString(),
                selected_by: clientId,
              }
              : sub
          )
        );
      } else {
        toast.error("Failed to update selection");
      }
    } catch (err) {
      console.error("Error updating selection:", err);
      toast.error("An error occurred while updating selection");
    }
  };



  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      if (activeTab === "freelancers") {
        loadAllFreelancers()
      } else {
        loadForms()
      }
    }
  }, [mounted, activeTab])

  const handleSendEmails = async () => {
    if (!emailMessage.trim()) {
      toast.error("Please enter a message before sending.")
      return
    }

    if (!freelancers.length) {
      toast.error("No freelancers found to send emails to.")
      return
    }

    setSending(true)

    try {
      const res = await fetch("/api/send-bulk-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freelancers: freelancers.map((f) => ({
            email: f.email,
            name: f.full_name,
          })),
          message: emailMessage,
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success(`✅ Emails sent: ${data.sent}, Failed: ${data.failed}`)
        setEmailMessage("")
      } else {
        toast.error("❌ Some emails failed to send.")
      }
    } catch (err) {
      console.error("Email send error:", err)
      toast.error("Something went wrong while sending emails.")
    } finally {
      setSending(false)
    }
  }

  const availableStandardFields = [
    { key: "name", label: "Full Name" },
    { key: "email", label: "Email Address" },
    { key: "phone", label: "Phone Number" },
    { key: "portfolio_link", label: "Portfolio URL" },
    { key: "github_link", label: "GitHub URL" },
    { key: "resume_link", label: "Resume URL" },
    { key: "years_experience", label: "Years of Experience" },
    { key: "proposal_link", label: "Proposal/Cover Letter" },
  ]

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#241C15] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#FFE01B] border-t-transparent rounded-full"
        />
      </div>
    )
  }

  const handleSearch = async () => {
    if (typeof window === "undefined") return;

    setLoading(true);
    setError(null);

    try {
      if (!supabase) {
        setError("Database client is not initialized.");
        setFreelancers([]);
        setLoading(false);
        return;
      }

      let query = supabase.from("all-freelancer").select("*");

      if (filters.category) {
        query = query.eq("category", filters.category);
      }

      if (filters.main_category) {
        query = query.eq("main_category", filters.main_category);
      }

      if (filters.subcategory) {
        query = query.contains("sub_category", [filters.subcategory]);
      }

      if (filters.passing_year) {
        query = query.eq("passing_year", filters.passing_year);
      }

      if (filters.years_experience) {
        query = query.eq("years_experience", filters.years_experience);
      }

      if (filters.tech_stack.length > 0) {
        query = query.contains("tech_stack", filters.tech_stack);
      }

      if (filters.tools.length > 0) {
        query = query.contains("tools", filters.tools);
      }

      if (filters.profile_rating && filters.profile_rating !== "All") {
        query = query.eq("profile_rating", Number(filters.profile_rating))
      }



      if (filters.search_text.trim()) {
        query = query.or(
          `full_name.ilike.%${filters.search_text}%,email.ilike.%${filters.search_text}%`
        );
      }

      const { data, error } = await query
        .range(0, 2000)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching freelancers:", error);
        setError("Error fetching data from database: " + error.message);
        setFreelancers([]);
      } else {
        setFreelancers(data || []);
        if (!data || data.length === 0) setError("No freelancers found matching your criteria");
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError("Unexpected error occurred: " + (err.message || "Unknown error"));
      setFreelancers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    setDashboard(path)
    router.push(path)
  }

  const loadAllFreelancers = async () => {
    if (typeof window === "undefined") return

    setLoading(true)
    setError(null)
    try {
      if (!supabase) {
        setError("Database client is not initialized.")
        setFreelancers([])
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from("all-freelancer")
        .select("*")
        .limit(10000)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading freelancers:", error)
        setError("Error loading freelancers: " + error.message)
        setFreelancers([])
      } else {
        if (data && data.length > 0) {
          setFreelancers(data)
        } else {
          setFreelancers([])
          setError("No freelancers found in the database")
        }
      }
    } catch (err: any) {
      console.error("Unexpected error:", err)
      setError("Unexpected error occurred: " + (err.message || "Unknown error"))
      setFreelancers([])
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setFilters({
      category: "",
      main_category: "",
      subcategory: "",
      passing_year: "",
      years_experience: "",
      tech_stack: [],
      tools: [],
      profile_rating: "",
      search_text: "",
      experience_level: "",
    })
  };

  const downloadCSV = () => {
    if (freelancers.length === 0) {
      toast.error("No data to download.")
      return
    }

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Category",
      "Employment Status",
      "Experience Level",
      "Domains",
      "Tech Stack",
      "Tools",
      "Portfolio",
      "LinkedIn",
      "Resume",
      "Created At",
    ]
    const rows = [headers.join(",")]
    freelancers.forEach((f) => {
      const row = [
        `"${f.full_name || ""}"`,
        `"${f.email || ""}"`,
        `"${f.phone || ""}"`,
        `"${f.category || ""}"`,
        `"${f.employment_status || ""}"`,
        `"${f.experience_level || ""}"`,
        `"${Array.isArray(f.domains) ? f.domains.join(", ") : ""}"`,
        `"${Array.isArray(f.tech_stack) ? f.tech_stack.join(", ") : ""}"`,
        `"${Array.isArray(f.tools) ? f.tools.join(", ") : ""}"`,
        `"${f.portfolio_url || ""}"`,
        `"${f.linkedin_url || ""}"`,
        `"${f.resume_url || ""}"`,
        `"${new Date(f.created_at).toLocaleDateString()}"`,
      ]
      rows.push(row.join(","))
    })
    const blob = new Blob([rows.join("\n")], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "freelancers.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCategoryChange = (category: string) => {
    if (category === "other") {
      setShowOtherCategory(true)
      setSelectedCategory("")
      setAvailableSubcategories([])
      setAvailableTechStacks([])
      setAvailableTools([])
      return
    }

    setShowOtherCategory(false)
    setSelectedCategory(category)
    setNewForm((prev) => ({ ...prev, category, subcategory: [], tech_stack: [], tools: [] }))

    if (categoryOptions[category]) {
      setAvailableSubcategories(categoryOptions[category]?.subcategories || [])
      setAvailableTechStacks(categoryOptions[category]?.techStacks || [])
    }
    setAvailableTools([])
    setSelectedSubcategory("")
    setSelectedTechStack("")
  }

  const handleSubcategoryChange = (value: string) => {
    if (value === "other") {
      setShowOtherSubcategory(true)
    } else {
      setSelectedSubcategories((prev) =>
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
      )
      setNewForm((prev) => ({
        ...prev,
        subcategory: selectedSubcategories.includes(value)
          ? selectedSubcategories.filter((item) => item !== value)
          : [...selectedSubcategories, value],
      }))
    }
  }

  const handleTechStackChange = (value: string) => {
    if (value === "other") {
      setShowOtherTechStack(true)
    } else {
      const newTechStacks = selectedTechStacks.includes(value)
        ? selectedTechStacks.filter((item) => item !== value)
        : [...selectedTechStacks, value]

      setSelectedTechStacks(newTechStacks)
      setNewForm((prev) => ({
        ...prev,
        tech_stack: newTechStacks,
      }))

      if (selectedCategory && categoryOptions[selectedCategory]) {
        const toolsForTech = categoryOptions[selectedCategory].tools[value] || []
        setAvailableTools(toolsForTech)
      }
    }
  }

  const handleToolsChange = (value: string) => {
    if (value === "other") {
      setShowOtherTools(true)
    } else {
      setSelectedTools((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
      setNewForm((prev) => ({
        ...prev,
        tools: prev.tools.includes(value) ? prev.tools.filter((item) => item !== value) : [...prev.tools, value],
      }))
    }
  }

  const validateFormCreation = () => {
    const missingFields: string[] = []

    if (!newForm.form_id.trim()) missingFields.push("Form ID")
    if (!newForm.form_name.trim()) missingFields.push("Form Name")
    if (!newForm.form_description.trim()) missingFields.push("Form Description")
    if (!newForm.industry.trim()) missingFields.push("Industry")
    if (!newForm.category.trim()) missingFields.push("Category")
    if (!selectedSubcategories.length) missingFields.push("At least one Subcategory")
    if (!selectedTechStacks.length) missingFields.push("At least one Tech Stack")
    if (!selectedTools.length) missingFields.push("At least one Tool")

    return missingFields
  }

  const handleCreateForm = async () => {
    const missingFields = validateFormCreation();

    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }

    setCreateFormLoading(true);
    setError(null);

    try {
      const payload = {
        form_id: newForm.form_id, // Admin can set manually
        form_name: newForm.form_name,
        form_description: newForm.form_description,
        industry: newForm.industry,
        category: newForm.category,
        subcategory: selectedSubcategories.join(", "),
        tech_stack: selectedTechStacks.join(", "),
        tools: selectedTools.join(", "),
        required_fields: selectedRequiredFields,
        custom_questions: customQuestions,
      };

      const res = await fetch("/api/forms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to create form.");

      setForms((prev) => [{ ...result.data, submission_count: 0 }, ...prev]);
      resetFormFields();
      await loadForms();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreateFormLoading(false);
    }
  };

  // helper
  const resetFormFields = () => {
    setNewForm({
      form_id: "",
      form_name: "",
      form_description: "",
      industry: "",
      category: "",
      subcategory: [],
      tech_stack: [],
      tools: [],
    });
    setSelectedRequiredFields(["name", "email", "phone", "resume_link"]);
    setCustomQuestions([]);
    setShowCreateForm(false);
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedTechStack("");
    setSelectedSubcategories([]);
    setSelectedTechStacks([]);
    setSelectedTools([]);
  };


  const addCustomQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      type: "text" as const,
      label: "",
      required: false,
      options: [],
    }
    setCustomQuestions((prev) => [...prev, newQuestion])
  }

  const updateCustomQuestion = (id: string, updates: Partial<(typeof customQuestions)[0]>) => {
    setCustomQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  const removeCustomQuestion = (id: string) => {
    setCustomQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const handleRequiredFieldChange = (fieldKey: string) => {
    setSelectedRequiredFields((prev) =>
      prev.includes(fieldKey) ? prev.filter((f) => f !== fieldKey) : [...prev, fieldKey],
    )
  }

  // Form management functions
  const loadForms = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabaseAdmin
        .from("forms")
        .select(`
          *,
          freelancer_submissions(count)
        `)
        .order("created_at", { ascending: false })

      if (error) {
        setError("Error loading forms: " + error.message)
        setForms([])
      } else {
        const formsWithCounts =
          data?.map((form) => ({
            ...form,
            submission_count: form.freelancer_submissions?.[0]?.count || 0,
          })) || []
        setForms(formsWithCounts)
      }
    } catch (err: any) {
      setError("Error loading forms: " + err.message)
      setForms([])
    } finally {
      setLoading(false)
    }
  }
  // Fetch submissions for a form
  const loadFormSubmissions = async (formId: string) => {
    setLoading(true)
    setError(null)

    try {
      console.log("Loading submissions for form ID:", formId)

      const { data: formData, error: formError } = await supabaseAdmin
        .from("forms")
        .select("id")
        .eq("id", formId)
        .single()

      if (formError || !formData) {
        setError("Form not found")
        setFormSubmissions([])
        return
      }

      const { data, error } = await supabaseAdmin
        .from("freelancer_submissions")
        .select("*")
        .eq("form_id", formData.id)
        .order("created_at", { ascending: false })

      if (error) {
        setError("Error loading submissions: " + error.message)
        setFormSubmissions([])
      } else {
        setFormSubmissions(data || [])
      }
    } catch (err: any) {
      setError("Error loading submissions: " + err.message)
      setFormSubmissions([])
    } finally {
      setLoading(false)
    }
  }

  // Updated CSV download function with filter support
  const downloadCSVForForm = (formId: string, filter: "all" | "selected" | "not_selected" = "all") => {
    if (!formSubmissions.length) {
      alert("No submissions available to download")
      return
    }

    // Apply filter
    const filteredSubmissions = formSubmissions.filter((sub) =>
      filter === "selected"
        ? sub.is_selected
        : filter === "not_selected"
          ? !sub.is_selected
          : true
    )

    if (!filteredSubmissions.length) {
      alert(`No ${filter} submissions to download`)
      return
    }

    // Define the CSV fields you want to include
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Portfolio Link",
      "GitHub Link",
      "Resume Link",
      "Years Experience",
      "Profile Rating",
      "Is Selected",
      "Selection Date",
      "Selected By",
    ]

    const rows = filteredSubmissions.map((s) => [
      s.name || "",
      s.email || "",
      s.phone || "",
      s.portfolio_link || "",
      s.github_link || "",
      s.resume_link || "",
      s.years_experience ?? "",
      s.profile_rating ?? "",
      s.is_selected ? "Yes" : "No",
      s.selection_date ? new Date(s.selection_date).toLocaleString() : "",
      s.selected_by || "",
    ])

    // Build CSV string
    const csvContent =
      headers.join(",") +
      "\n" +
      rows
        .map((row) =>
          row
            .map((value) =>
              typeof value === "string" && value.includes(",")
                ? `"${value.replace(/"/g, '""')}"`
                : value
            )
            .join(",")
        )
        .join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `form_${formId}_${filter}_submissions.csv`
    link.click()
    URL.revokeObjectURL(url)
  }




  const copyFormLink = async (formId: string) => {
    const url = `${window.location.origin}/form/${formId}`
    await navigator.clipboard.writeText(url)
    setCopiedFormId(formId)
    setTimeout(() => setCopiedFormId(null), 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "student":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30"
      case "fresher":
        return "bg-green-500/20 text-green-400 border border-green-500/30"
      case "full time":
        return "bg-purple-500/20 text-purple-400 border border-purple-500/30"
      case "part time":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30"
    }
  }

  const getExperienceColor = (level: string) => {
    if (!level) return "bg-gray-500/20 text-gray-400"

    if (level.includes("Less than 1")) {
      return "bg-blue-500/20 text-blue-400"
    } else if (level.includes("1-2")) {
      return "bg-yellow-500/20 text-yellow-400"
    } else if (level.includes("3-5")) {
      return "bg-orange-500/20 text-orange-400"
    } else if (level.includes("5+")) {
      return "bg-green-500/20 text-green-400"
    } else if (level.toLowerCase().includes("fresher")) {
      return "bg-purple-500/20 text-purple-400"
    } else {
      return "bg-gray-500/20 text-gray-400"
    }
  }

  const handleDeleteForm = async (formId: string, formName: string) => {
    if (
      !confirm(`Are you sure you want to delete "${formName}"? This will also delete all submissions for this form.`)
    ) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/forms?id=${formId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete form")
      }

      setForms((prev) => prev.filter((form) => form.id !== formId))

      if (selectedForm === formId) {
        setSelectedForm(null)
      }
    } catch (err: any) {
      setError("Error deleting form: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFormStatus = async (form: Form) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/forms", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: form.id,
          form_id: form.form_id,
          form_name: form.form_name,
          form_description: form.form_description,
          category: form.category ?? "",
          subcategory: form.subcategory,
          industry: form.industry,
          tech_stack: form.tech_stack,
          tools: form.tools,
          is_active: !form.is_active,
          required_fields: form.required_fields,
          custom_questions: form.custom_questions,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update form status")
      }

      setForms((prev) => prev.map((f) => (f.id === form.id ? { ...f, is_active: !f.is_active } : f)))
    } catch (err: any) {
      setError("Error updating form status: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditForm = (form: Form) => {
    setEditingForm(form)
    setNewForm({
      form_id: form.form_id,
      form_name: form.form_name,
      form_description: form.form_description || "",
      industry: form.industry,
      category: form.category,
      subcategory: typeof form.subcategory === "string" ? form.subcategory.split(", ") : [],
      tech_stack: typeof form.tech_stack === "string" ? form.tech_stack.split(", ") : [],
      tools: typeof form.tools === "string" ? form.tools.split(", ") : [],
    })
    setSelectedCategory(form?.category)
    setSelectedSubcategories(typeof form.subcategory === "string" ? form.subcategory.split(", ") : [])
    setSelectedTechStacks(typeof form.tech_stack === "string" ? form.tech_stack.split(", ") : [])
    setSelectedTools(typeof form.tools === "string" ? form.tools.split(", ") : [])
    setSelectedRequiredFields(form.required_fields || ["name", "email", "phone", "resume_link"])
    setCustomQuestions(form.custom_questions || [])
    setShowEditForm(true)
  }

  const handleUpdateForm = async () => {
    if (!editingForm) return

    const missingFields = validateFormCreation()

    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(", ")}`)
      return
    }

    setCreateFormLoading(true)
    setError(null)

    try {
      const formData = {
        id: editingForm.id,
        form_id: newForm.form_id,
        form_name: newForm.form_name,
        form_description: newForm.form_description,
        industry: newForm.industry,
        category: newForm.category,
        subcategory: selectedSubcategories.join(", "),
        tech_stack: selectedTechStacks.join(", "),
        tools: selectedTools.join(", "),
        is_active: editingForm.is_active,
        required_fields: selectedRequiredFields,
        custom_questions: customQuestions,
      }

      const response = await fetch("/api/forms", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update form")
      }

      setForms((prev) =>
        prev.map((f) => (f.id === editingForm.id ? { ...data.form, submission_count: f.submission_count } : f)),
      )

      setNewForm({
        form_id: "",
        form_name: "",
        form_description: "",
        industry: "",
        category: "",
        subcategory: [],
        tech_stack: [],
        tools: [],
      })
      setSelectedRequiredFields(["name", "email", "phone", "resume_link"])
      setCustomQuestions([])
      setShowEditForm(false)
      setEditingForm(null)
      setSelectedCategory("")
      setSelectedSubcategory("")
      setSelectedTechStack("")
      setSelectedSubcategories([])
      setSelectedTechStacks([])
      setSelectedTools([])
    } catch (err: any) {
      setError("Error updating form: " + err.message)
    } finally {
      setCreateFormLoading(false)
    }
  }

  const formIdOptions = Array.from(new Set(forms.map((f) => f.form_id))).sort()
  const subcategoryOptions: string[] = Array.from(
    new Set(
      forms
        .map((f) => f.subcategory)
        .filter((s): s is string => typeof s === "string" && s !== "")
    )
  ).sort()

  const loadFilteredSubmissions = async () => {
    try {
      if (!supabase) return

      let query = supabase
        .from("freelancer_submissions")
        .select(
          `
        *,
        forms:form_id (
          id,
          form_id,
          category,
          subcategory,
          form_name
        )
      `,
        )
        .order("created_at", { ascending: false })

      const { formTextId, category, subcategory } = submissionFilters

      if (formTextId) {
        const match = forms.find((f) => f.form_id === formTextId)
        if (match) {
          query = query.eq("form_id", match.id)
        } else {
          setFormSubmissions([])
          return
        }
      }

      if (category) {
        const categoryFormIds = forms.filter((f) => f.category === category).map((f) => f.id)
        if (categoryFormIds.length > 0) {
          query = query.in("form_id", categoryFormIds)
        } else {
          setFormSubmissions([])
          return
        }
      }

      if (subcategory) {
        const subFormIds = forms.filter((f) => f.subcategory === subcategory).map((f) => f.id)
        if (subFormIds.length > 0) {
          query = query.in("form_id", subFormIds)
        } else {
          setFormSubmissions([])
          return
        }
      }

      const { data, error } = await query
      if (error) {
        console.error("[v0] Error filtering submissions:", error)
        setFormSubmissions([])
        setError("Error filtering submissions: " + error.message)
        return
      }
      setFormSubmissions(data || [])
    } catch (e: any) {
      console.error("[v0] loadFilteredSubmissions error:", e)
      setError("Error filtering submissions: " + e.message)
    }
  }

  const resetSubmissionFilters = () => {
    setSubmissionFilters({
      formTextId: "",
      category: "",
      subcategory: "",
    })
    loadFilteredSubmissions()
  }

  const handleAgreementAutomation = () => {
    window.location.href = "/admin-panel/agreements"
  }

  const handleFormDashboard = () => {
    window.location.href = "/admin-form-creation/dashboard"
  }

  function Field({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) {
    return (
      <div>
        <p className="text-gray-400 text-sm mb-1">{label}:</p>
        <p className={`text-white ${highlight ? "font-semibold text-yellow-400" : ""}`}>{value}</p>
      </div>
    )
  }

  function FieldLink({ label, href }: { label: string; href: string }) {
    return (
      <div>
        <p className="text-gray-400 text-sm mb-1">{label}:</p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition-colors break-all"
        >
          View {label}
        </a>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-[#241C15] text-white overflow-hidden pt-[50px] sm:pt-[80px] lg:pt-[100px]">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-[#FFE01B] opacity-10 rounded-full"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="absolute top-1/2 -left-40 w-64 h-64 bg-[#FFE01B] opacity-10 rounded-full"
        />
        <motion.div
          animate={{
            rotate: 180,
            scale: [1, 1.3, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FFE01B] opacity-10 rounded-full"
        />
      </div>

      {/* Header Section */}
      <section className="relative py-20 px-4 z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#241C15] via-[#2a1f16] to-[#241C15]" />

        <motion.div
          className="relative max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="text-center space-y-8">
            <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <motion.div
                className="w-12 h-12 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30"
                whileHover={{ scale: 1.1, rotate: 10 }}
              >
                <Settings className="w-6 h-6 text-[#FFE01B]" />
              </motion.div>
              <span className="text-[#FFE01B] font-semibold text-lg">Admin Panel</span>
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-5xl lg:text-7xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-white to-[#FFE01B] bg-clip-text text-transparent">
                Management Dashboard
              </span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Manage freelancer database and create custom gig forms
            </motion.p>

            {/* Tab Navigation */}
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <button
                onClick={() => setActiveTab("freelancers")}
                className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 w-full text-left 
      ${activeTab === "freelancers"
                    ? "bg-[#FFE01B] text-[#241C15]"
                    : "bg-white/10 text-white hover:bg-white/20"
                  }`}
              >
                <Users className="w-5 h-5 shrink-0" />
                Freelancer Search
              </button>

              <button
                onClick={() => setActiveTab("forms")}
                className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 w-full text-left 
      ${activeTab === "forms"
                    ? "bg-[#FFE01B] text-[#241C15]"
                    : "bg-white/10 text-white hover:bg-white/20"
                  }`}
              >
                <FileText className="w-5 h-5 shrink-0" />
                Form Management
              </button>

              <button
                onClick={() => handleNavigation("/admin-form-creation/dashboard")}
                className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 w-full text-left 
      ${dashboard === "/admin-form-creation/dashboard"
                    ? "bg-[#FFE01B] text-[#241C15]"
                    : "bg-white/10 text-white hover:bg-white/20"
                  }`}
              >
                <FileText className="w-5 h-5 shrink-0" />
                Form Dashboard
              </button>

              <button
                onClick={handleAgreementAutomation}
                className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 w-full text-left 
      ${dashboard === "/admin-panel/agreements"
                    ? "bg-[#FFE01B] text-[#241C15]"
                    : "bg-white/10 text-white hover:bg-white/20"
                  }`}
              >
                <FileCheck className="w-5 h-5 shrink-0" />
                Agreement Automation
              </button>

              <button
                onClick={() => handleNavigation("/admin-panel/notifications")}
                className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 w-full text-left 
      ${dashboard === "/admin-panel/notifications"
                    ? "bg-[#FFE01B] text-[#241C15]"
                    : "bg-white/10 text-white hover:bg-white/20"
                  }`}
              >
                <Bell className="w-5 h-5 shrink-0" />
                Notifications
              </button>

              <button
                onClick={() => handleNavigation("/analyze")}
                className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 w-full text-left 
      ${dashboard === "/analyze"
                    ? "bg-[#FFE01B] text-[#241C15]"
                    : "bg-white/10 text-white hover:bg-white/20"
                  }`}
              >
                <BarChart3 className="w-5 h-5 shrink-0" />
                Analyze
              </button>

              <button
                onClick={() => handleNavigation("/admin-panel/generate-form")}
                className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 w-full text-left 
    ${dashboard === "/admin-panel/generate-form"
                    ? "bg-[#FFE01B] text-[#241C15]"
                    : "bg-white/10 text-white hover:bg-white/20"
                  }`}
              >
                <FileText className="w-5 h-5 shrink-0" />
                Form Generation
              </button>

              <button
                onClick={() => handleNavigation("/email-personalize")}
                className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 w-full text-left 
    ${dashboard === "/email-personalize"
                    ? "bg-[#FFE01B] text-[#241C15]"
                    : "bg-white/10 text-white hover:bg-white/20"
                  }`}
              >
                <Mail className="w-5 h-5 shrink-0" />
                Email Personalization
              </button>

              <button
                onClick={() => handleNavigation("/admin-panel/bulk-mail-send")}
                className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 w-full text-left 
    ${dashboard === "/admin-panel/bulk-mail-send"
                    ? "bg-[#FFE01B] text-[#241C15]"
                    : "bg-white/10 text-white hover:bg-white/20"
                  }`}
              >
                <Mail className="w-5 h-5 shrink-0" />
                Bulk Mail Sending
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mt-12"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                initial="hidden"
                animate="visible"
                variants={scaleIn}
              >
                <div className="flex items-center justify-center mb-3">
                  <Users className="w-8 h-8 text-[#FFE01B]" />
                </div>
                <h3 className="text-2xl font-bold text-white">{freelancers.length}</h3>
                <p className="text-gray-400 text-sm">Total Freelancers</p>
              </motion.div>

              <motion.div
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                initial="hidden"
                animate="visible"
                variants={scaleIn}
              >
                <div className="flex items-center justify-center mb-3">
                  <FileText className="w-8 h-8 text-[#FFE01B]" />
                </div>
                <h3 className="text-2xl font-bold text-white">{forms.length}</h3>
                <p className="text-gray-400 text-sm">Active Forms</p>
              </motion.div>

              <motion.div
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                initial="hidden"
                animate="visible"
                variants={scaleIn}
              >
                <div className="flex items-center justify-center mb-3">
                  <BarChart3 className="w-8 h-8 text-[#FFE01B]" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {forms.reduce((sum, form) => sum + (form.submission_count || 0), 0)}
                </h3>
                <p className="text-gray-400 text-sm">Total Submissions</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Content based on active tab */}
      {activeTab === "freelancers" ? (
        <>
          {/* Search Filters Section */}
          <section className="relative py-12 px-4 z-10">
            <motion.div
              className="max-w-7xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{ hidden: {}, visible: {} }}
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <motion.div className="space-y-8">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div
                      className="w-10 h-10 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Filter className="w-5 h-5 text-[#FFE01B]" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-white">Search Filters</h2>
                  </div>

                  {/* Filters Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <SelectFilter
                      label="Main Category"
                      value={filters.main_category || ""}
                      onChange={(v) => setFilters({ ...filters, main_category: v })}
                      options={mainCategoryOptions}
                      placeholder="Main Categories"
                    />

                    <SelectFilter
                      label="Category"
                      value={filters.category || ""}
                      onChange={(v) => setFilters({ ...filters, category: v })}
                      options={Object.keys(categoryOptionss)}
                      placeholder="Categories"
                    />



                    <SelectFilter
                      label="Subcategory"
                      value={filters.subcategory || ""}
                      onChange={(v) => setFilters({ ...filters, subcategory: v })}
                      options={uniqueSubcategoriess}
                      placeholder="Subcategories"
                    />

                    <SelectFilter
                      label="Passing Year"
                      value={filters.passing_year || ""}
                      onChange={(v) => setFilters({ ...filters, passing_year: v })}
                      options={passingYearOptions}
                      placeholder="Passout Years"
                    />

                    <SelectFilter
                      label="Years of Experience"
                      value={filters.years_experience || ""}
                      onChange={(v) => setFilters({ ...filters, years_experience: v })}
                      options={experienceYearOptions}
                      placeholder="Experience Levels"
                    />

                    <MultiSelectFilter
                      label="Tech Stack"
                      value={filters.tech_stack}
                      onChange={(vals) => setFilters({ ...filters, tech_stack: vals })}
                      options={techStackOptions}
                    />

                    <MultiSelectFilter
                      label="Tools"
                      value={filters.tools}
                      onChange={(vals) => setFilters({ ...filters, tools: vals })}
                      options={toolsOptions}
                    />

                    <SelectFilter
                      label="Profile Rating"
                      value={filters.profile_rating || ""}
                      onChange={(v) => setFilters({ ...filters, profile_rating: v })}
                      options={ratingOptions}
                      placeholder="All Ratings"
                    />
                  </div>

                  {/* Search Input */}
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-[#FFE01B]">Search</label>
                    <input
                      type="text"
                      value={filters.search_text}
                      onChange={(e) => setFilters({ ...filters, search_text: e.target.value })}
                      placeholder="Search by name or email..."
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFE01B] transition-colors duration-300"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                    <motion.button
                      onClick={handleSearch}
                      disabled={loading}
                      className="flex-1 bg-[#FFE01B] hover:bg-yellow-300 text-[#241C15] font-bold py-4 px-8 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-[#241C15] border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <Search className="w-5 h-5" /> Search Freelancers
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      onClick={resetFilters}
                      className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 border border-white/20 hover:border-white/40"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Reset Filters
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* Error Message */}
          {error && (
            <section className="relative py-6 px-4 z-10">
              <motion.div
                className="max-w-6xl mx-auto bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-red-300">{error}</p>
              </motion.div>
            </section>
          )}

          {/* Results */}
          {freelancers.length > 0 ? (
            <section className="relative py-12 px-4 z-10">
              <motion.div className="max-w-7xl mx-auto">
                {/* Send Email Section */}
                {freelancers.length > 0 && (
                  <motion.div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30">
                        <Mail className="w-5 h-5 text-[#FFE01B]" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Send Email to Filtered Freelancers</h3>
                    </div>

                    <p className="text-gray-400 mb-4 text-sm">
                      Type your message below and click "Send Email". This will send to all freelancers currently shown in the list.
                    </p>

                    <textarea
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                      placeholder="Write your message here..."
                      className="w-full bg-white/10 border border-white/20 text-white rounded-2xl p-4 mb-6 focus:outline-none focus:border-[#FFE01B] transition-colors duration-300 placeholder-gray-400"
                      rows={5}
                    />

                    <motion.button
                      onClick={handleSendEmails}
                      disabled={sending}
                      className="w-full sm:w-auto bg-[#FFE01B] hover:bg-yellow-300 text-[#241C15] font-bold py-4 px-10 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      whileHover={{ scale: sending ? 1 : 1.03, y: sending ? 1 : -2 }}
                      whileTap={{ scale: sending ? 1 : 0.97 }}
                    >
                      {sending ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-[#241C15] border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <Send className="w-5 h-5" /> Send Email
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                )}
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                  <div className="flex items-center gap-3 mb-4 sm:mb-0">
                    <div className="w-10 h-10 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30">
                      <Eye className="w-5 h-5 text-[#FFE01B]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Search Results</h2>
                      <p className="text-gray-400">Found {freelancers.length} matching freelancers</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={downloadCSV}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-5 h-5" /> Download CSV
                  </motion.button>
                </div>

                {/* Freelancer Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {freelancers.map((f, i) => (
                    <motion.div
                      key={f.id}
                      className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 hover:border-[#FFE01B]/50 transition-all duration-500"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -10, scale: 1.02 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FFE01B]/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white group-hover:text-[#FFE01B] truncate">
                              {f.full_name}
                            </h3>
                            <p className="text-gray-400 text-sm truncate">{f.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-3 h-3 text-gray-500" />
                              <span className="text-gray-500 text-xs">{new Date(f.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              f.employment_status || "N/A"
                            )}`}
                          >
                            {f.employment_status || "N/A"}
                          </div>
                        </div>

                        {/* Category & Experience */}
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-[#FFE01B]/20 text-[#FFE01B] text-xs rounded-lg border border-[#FFE01B]/30">
                            {f.category}
                          </span>
                          {f.experience_level && (
                            <span className={`px-2 py-1 text-xs rounded-lg ${getExperienceColor(f.experience_level)}`}>
                              {f.experience_level}
                            </span>
                          )}
                        </div>

                        {/* Skills */}
                        <div className="space-y-2">
                          {f.domains && f.domains.length > 0 && (
                            <div>
                              <p className="text-gray-400 text-xs mb-1">Domains:</p>
                              <div className="flex flex-wrap gap-1">
                                {f.domains.slice(0, 3).map((d, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20">
                                    {d}
                                  </span>
                                ))}
                                {f.domains.length > 3 && (
                                  <span className="px-2 py-1 bg-white/10 text-gray-400 text-xs rounded">
                                    +{f.domains.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          {f.tech_stack && f.tech_stack.length > 0 && (
                            <div>
                              <p className="text-gray-400 text-xs mb-1">Tech:</p>
                              <div className="flex flex-wrap gap-1">
                                {f.tech_stack.slice(0, 3).map((t, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded border border-green-500/20">
                                    {t}
                                  </span>
                                ))}
                                {f.tech_stack.length > 3 && (
                                  <span className="px-2 py-1 bg-white/10 text-gray-400 text-xs rounded">
                                    +{f.tech_stack.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Contact */}
                        <div className="space-y-2 pt-4 border-t border-white/10">
                          {f.phone && (
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                              <Phone className="w-4 h-4" /> <span className="truncate">{f.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <Mail className="w-4 h-4" /> <span className="truncate">{f.email}</span>
                          </div>
                        </div>

                        {/* Links */}
                        <div className="flex gap-2 pt-2">
                          {f.portfolio_url && (
                            <motion.a
                              href={f.portfolio_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-semibold py-2 px-3 rounded-xl border border-blue-500/30 text-center text-sm flex items-center justify-center gap-1"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <ExternalLink className="w-3 h-3" /> Portfolio
                            </motion.a>
                          )}
                          {f.linkedin_url && (
                            <motion.a
                              href={f.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 font-semibold py-2 px-3 rounded-xl border border-blue-600/30 text-center text-sm flex items-center justify-center gap-1"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Linkedin className="w-3 h-3" /> LinkedIn
                            </motion.a>
                          )}
                          {f.resume_url && (
                            <motion.a
                              href={f.resume_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 font-semibold py-2 px-3 rounded-xl border border-green-500/30 text-center text-sm flex items-center justify-center gap-1"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <FileDown className="w-3 h-3" /> Resume
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>


              </motion.div>
            </section>
          ) : (
            !loading && (
              <section className="relative py-20 px-4 z-10">
                <motion.div className="max-w-2xl mx-auto text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="w-20 h-20 bg-[#FFE01B]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-[#FFE01B]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">No Freelancers Found</h3>
                  <p className="text-gray-400 mb-8">{error || "Try adjusting your search filters."}</p>
                  <motion.button
                    onClick={resetFilters}
                    className="bg-[#FFE01B] hover:bg-yellow-300 text-[#241C15] font-bold px-6 py-3 rounded-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Reset Filters
                  </motion.button>
                </motion.div>
              </section>
            )
          )}
        </>
      ) : (
        <>
          {/* Form Management Section */}
          <section className="relative py-12 px-4 z-10">
            <motion.div
              className="max-w-6xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
            >
              {/* Create Form Button */}
              <motion.div
                className="flex justify-between items-center mb-8"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 bg-[#FFE01B]/20 rounded-xl flex items-center justify-center border border-[#FFE01B]/30"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <FileText className="w-5 h-5 text-[#FFE01B]" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white">Form Management</h2>
                </div>

                <motion.button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="bg-[#FFE01B] hover:bg-yellow-300 text-[#241C15] font-bold px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-5 h-5" />
                  Create New Form
                </motion.button>
              </motion.div>

              {(showCreateForm || showEditForm) && (
                <motion.div
                  className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-8"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <h3 className="text-xl font-bold text-white mb-6">
                    {showEditForm ? "Edit Form" : "Create New Form"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#FFE01B] mb-2">Form ID</label>
                      <input
                        type="text"
                        value={newForm.form_id}
                        onChange={(e) => setNewForm((prev) => ({ ...prev, form_id: e.target.value }))}
                        placeholder="e.g., reactjs1, nodejs2"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFE01B] transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#FFE01B] mb-2">Form Name</label>
                      <input
                        type="text"
                        value={newForm.form_name}
                        onChange={(e) => setNewForm((prev) => ({ ...prev, form_name: e.target.value }))}
                        placeholder="e.g., React.js Developer Position"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFE01B] transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#FFE01B] mb-2">Form Description</label>
                      <input
                        type="text"
                        value={newForm.form_description}
                        onChange={(e) => setNewForm((prev) => ({ ...prev, form_description: e.target.value }))}
                        placeholder=""
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFE01B] transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#FFE01B] mb-2">Industry</label>
                      <input
                        type="text"
                        value={newForm.industry}
                        onChange={(e) => setNewForm((prev) => ({ ...prev, industry: e.target.value }))}
                        placeholder="e.g., Technology, Healthcare, Finance"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFE01B] transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#FFE01B] mb-2">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFE01B] transition-colors duration-300"
                      >
                        <option value="" className="bg-[#241C15] text-white">
                          Select Category
                        </option>
                        {Object.keys(categoryOptions).map((category) => (
                          <option key={category} value={category} className="bg-[#241C15] text-white">
                            {category}
                          </option>
                        ))}
                        <option value="other" className="bg-[#241C15] text-white">
                          Other
                        </option>
                      </select>
                      {showOtherCategory && (
                        <input
                          type="text"
                          value={newForm.category}
                          onChange={(e) => setNewForm((prev) => ({ ...prev, category: e.target.value }))}
                          placeholder="Enter custom category"
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFE01B] transition-colors duration-300 mt-2"
                        />
                      )}
                    </div>
                    {/* Updated form interface to show multiple selections with checkboxes */}
                    <div>
                      <label className="block text-sm font-semibold text-[#FFE01B] mb-2">
                        Subcategories (Select Multiple)
                      </label>
                      <div className="bg-white/10 border border-white/20 rounded-xl p-4 max-h-40 overflow-y-auto">
                        {availableSubcategories.map((subcategory) => (
                          <label key={subcategory} className="flex items-center space-x-2 mb-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedSubcategories.includes(subcategory)}
                              onChange={() => handleSubcategoryChange(subcategory)}
                              className="w-4 h-4 text-[#FFE01B] bg-transparent border-white/20 rounded focus:ring-[#FFE01B]"
                            />
                            <span className="text-white text-sm">{subcategory}</span>
                          </label>
                        ))}
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showOtherSubcategory}
                            onChange={() => setShowOtherSubcategory(!showOtherSubcategory)}
                            className="w-4 h-4 text-[#FFE01B] bg-transparent border-white/20 rounded focus:ring-[#FFE01B]"
                          />
                          <span className="text-white text-sm">Other</span>
                        </label>
                      </div>
                      {selectedSubcategories.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedSubcategories.map((item) => (
                            <span key={item} className="bg-[#FFE01B] text-black px-2 py-1 rounded-lg text-xs">
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                      {showOtherSubcategory && (
                        <input
                          type="text"
                          placeholder="Enter custom subcategory and press Enter"
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && e.currentTarget.value.trim()) {
                              const customValue = e.currentTarget.value.trim()
                              setSelectedSubcategories((prev) => [...prev, customValue])
                              setNewForm((prev) => ({
                                ...prev,
                                subcategory: [...(prev.subcategory || []), customValue],
                              }))
                              e.currentTarget.value = ""
                            }
                          }}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFE01B] transition-colors duration-300 mt-2"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#FFE01B] mb-2">
                        Tech Stack (Select Multiple)
                      </label>
                      <div className="bg-white/10 border border-white/20 rounded-xl p-4 max-h-40 overflow-y-auto">
                        {availableTechStacks.map((techStack) => (
                          <label key={techStack} className="flex items-center space-x-2 mb-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedTechStacks.includes(techStack)}
                              onChange={() => handleTechStackChange(techStack)}
                              className="w-4 h-4 text-[#FFE01B] bg-transparent border-white/20 rounded focus:ring-[#FFE01B]"
                            />
                            <span className="text-white text-sm">{techStack}</span>
                          </label>
                        ))}
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showOtherTechStack}
                            onChange={() => setShowOtherTechStack(!showOtherTechStack)}
                            className="w-4 h-4 text-[#FFE01B] bg-transparent border-white/20 rounded focus:ring-[#FFE01B]"
                          />
                          <span className="text-white text-sm">Other</span>
                        </label>
                      </div>
                      {selectedTechStacks.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedTechStacks.map((item) => (
                            <span key={item} className="bg-[#FFE01B] text-black px-2 py-1 rounded-lg text-xs">
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                      {showOtherTechStack && (
                        <input
                          type="text"
                          placeholder="Enter custom tech stack and press Enter"
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && e.currentTarget.value.trim()) {
                              const customValue = e.currentTarget.value.trim()
                              const newTechStacks = [...selectedTechStacks, customValue]
                              setSelectedTechStacks(newTechStacks)
                              setNewForm((prev) => ({
                                ...prev,
                                tech_stack: newTechStacks,
                              }))
                              e.currentTarget.value = ""
                            }
                          }}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFE01B] transition-colors duration-300 mt-2"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#FFE01B] mb-2">Tools (Select Multiple)</label>
                      <div className="bg-white/10 border border-white/20 rounded-xl p-4 max-h-40 overflow-y-auto">
                        {availableTools.map((tool) => (
                          <label key={tool} className="flex items-center space-x-2 mb-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedTools.includes(tool)}
                              onChange={() => handleToolsChange(tool)}
                              className="w-4 h-4 text-[#FFE01B] bg-transparent border-white/20 rounded focus:ring-[#FFE01B]"
                            />
                            <span className="text-white text-sm">{tool}</span>
                          </label>
                        ))}
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showOtherTools}
                            onChange={() => setShowOtherTools(!showOtherTools)}
                            className="w-4 h-4 text-[#FFE01B] bg-transparent border-white/20 rounded focus:ring-[#FFE01B]"
                          />
                          <span className="text-white text-sm">Other</span>
                        </label>
                      </div>
                      {selectedTools.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedTools.map((item) => (
                            <span key={item} className="bg-[#FFE01B] text-black px-2 py-1 rounded-lg text-xs">
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                      {showOtherTools && (
                        <input
                          type="text"
                          placeholder="Enter custom tool and press Enter"
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && e.currentTarget.value.trim()) {
                              const customValue = e.currentTarget.value.trim()
                              setSelectedTools((prev) => [...prev, customValue])
                              setNewForm((prev) => ({
                                ...prev,
                                tools: [...(prev.tools || []), customValue],
                              }))
                              e.currentTarget.value = ""
                            }
                          }}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFE01B] transition-colors duration-300 mt-2"
                        />
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-[#FFE01B] mb-2">
                        Required Standard Fields
                      </label>
                      <div className="bg-white/10 border border-white/20 rounded-xl p-4">
                        <div className="grid grid-cols-2 gap-2">
                          {availableStandardFields.map((field) => (
                            <label key={field.key} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedRequiredFields.includes(field.key)}
                                onChange={() => handleRequiredFieldChange(field.key)}
                                className="w-4 h-4 text-[#FFE01B] bg-transparent border-white/20 rounded focus:ring-[#FFE01B]"
                              />
                              <span className="text-white text-sm">{field.label}</span>
                            </label>
                          ))}
                        </div>
                        {selectedRequiredFields.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {selectedRequiredFields.map((fieldKey) => {
                              const field = availableStandardFields.find((f) => f.key === fieldKey)
                              return (
                                <span key={fieldKey} className="bg-[#FFE01B] text-black px-2 py-1 rounded-lg text-xs">
                                  {field?.label}
                                </span>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-semibold text-[#FFE01B]">Custom Questions</label>
                        <motion.button
                          onClick={addCustomQuestion}
                          className="bg-[#FFE01B] hover:bg-yellow-300 text-[#241C15] font-semibold px-4 py-2 rounded-lg transition-all duration-300 text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Plus className="w-4 h-4 inline mr-1" />
                          Add Question
                        </motion.button>
                      </div>

                      {customQuestions.length > 0 && (
                        <div className="space-y-4">
                          {customQuestions.map((question, index) => (
                            <div key={question.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-white font-semibold">Question {index + 1}</span>
                                <button
                                  onClick={() => removeCustomQuestion(question.id)}
                                  className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-xs text-gray-300 mb-1">Question Type</label>
                                  <select
                                    value={question.type}
                                    onChange={(e) =>
                                      updateCustomQuestion(question.id, {
                                        type: e.target.value as any,
                                        options:
                                          e.target.value === "select" ||
                                            e.target.value === "radio" ||
                                            e.target.value === "checkbox"
                                            ? [""]
                                            : undefined,
                                      })
                                    }
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FFE01B]"
                                  >
                                    <option value="text" className="bg-[#241C15]">
                                      Text Input
                                    </option>
                                    <option value="textarea" className="bg-[#241C15]">
                                      Textarea
                                    </option>
                                    <option value="select" className="bg-[#241C15]">
                                      Dropdown
                                    </option>
                                    <option value="radio" className="bg-[#241C15]">
                                      Radio Buttons
                                    </option>
                                    <option value="checkbox" className="bg-[#241C15]">
                                      Checkboxes
                                    </option>
                                  </select>
                                </div>

                                <div className="md:col-span-2">
                                  <label className="block text-xs text-gray-300 mb-1">Question Label</label>
                                  <input
                                    type="text"
                                    value={question.label}
                                    onChange={(e) => updateCustomQuestion(question.id, { label: e.target.value })}
                                    placeholder="Enter your question..."
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FFE01B]"
                                  />
                                </div>
                              </div>

                              {(question.type === "select" ||
                                question.type === "radio" ||
                                question.type === "checkbox") && (
                                  <div className="mt-3">
                                    <label className="block text-xs text-gray-300 mb-2">Options (one per line)</label>
                                    <textarea
                                      value={question.options?.join("\n") || ""}
                                      onChange={(e) =>
                                        updateCustomQuestion(question.id, {
                                          options: e.target.value.split("\n").filter((opt) => opt.trim()),
                                        })
                                      }
                                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                                      rows={3}
                                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FFE01B]"
                                    />
                                  </div>
                                )}

                              <div className="mt-3">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={question.required}
                                    onChange={(e) => updateCustomQuestion(question.id, { required: e.target.checked })}
                                    className="w-4 h-4 text-[#FFE01B] bg-transparent border-white/20 rounded focus:ring-[#FFE01B]"
                                  />
                                  <span className="text-white text-sm">Required field</span>
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <motion.button
                      onClick={showEditForm ? handleUpdateForm : handleCreateForm}
                      disabled={createFormLoading}
                      className="bg-[#FFE01B] hover:bg-yellow-300 text-[#241C15] font-bold px-6 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                      whileHover={{ scale: createFormLoading ? 1 : 1.05 }}
                      whileTap={{ scale: createFormLoading ? 1 : 0.95 }}
                    >
                      {createFormLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="w-4 h-4 border-2 border-[#241C15] border-t-transparent rounded-full"
                          />
                          {showEditForm ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          {showEditForm ? "Update Form" : "Create Form"}
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setShowCreateForm(false)
                        setShowEditForm(false)
                        setEditingForm(null)
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-center mb-8"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-red-300">{error}</p>
                </motion.div>
              )}

              {/* Forms List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {forms.map((form, index) => (
                  <motion.div
                    key={form.id}
                    initial="hidden"
                    animate="visible"
                    variants={scaleIn}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 hover:border-[#FFE01B]/50 transition-all duration-500"
                    whileHover={{ y: -10, scale: 1.02 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFE01B]/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white group-hover:text-[#FFE01B] transition-colors duration-300">
                            {form.form_name}
                          </h3>
                          <p className="text-gray-400 text-sm">ID: {form.form_id}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-500 text-xs">
                              {new Date(form.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="px-3 py-1 bg-[#FFE01B]/40 text-[#FFE01B] text-xs rounded-full border border-[#FFE01B]/30">
                            {form.submission_count || 0} submissions
                          </div>
                          <div
                            className={`px-3 py-1 text-xs rounded-full border ${form.is_active
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                              }`}
                          >
                            {form.is_active ? "Active" : "Inactive"}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs rounded border font-medium ${form.created_by === "admin"
                            ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            : "bg-pink-500/20 text-pink-400 border-pink-500/30"
                            }`}
                        >
                          {form.created_by === "admin" ? "Created By Admin" : "Created By Client"}
                        </span>
                      </div>


                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30">
                            {form.category}
                          </span>
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30">
                            {form.subcategory}
                          </span>
                        </div>
                        <div>
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded border border-purple-500/30">
                            {form.industry}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-white/10">
                        <motion.button
                          onClick={() => copyFormLink(form.id)}
                          className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-semibold py-2 px-3 rounded-xl transition-all duration-300 border border-blue-500/30 hover:border-blue-500 text-center text-sm flex items-center justify-center gap-1"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {copiedFormId === form.id ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy Link
                            </>
                          )}
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            setSelectedForm(form.id)
                            loadFormSubmissions(form.id)
                          }}
                          className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 font-semibold py-2 px-3 rounded-xl transition-all duration-300 border border-green-500/30 hover:border-green-500 text-center text-sm flex items-center justify-center gap-1"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </motion.button>
                      </div>

                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => handleToggleFormStatus(form)}
                          className={`flex-1 font-semibold py-2 px-3 rounded-xl transition-all duration-300 text-center text-sm flex items-center justify-center gap-1 ${form.is_active
                            ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500"
                            : "bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 hover:border-green-500"
                            }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {form.is_active ? (
                            <>
                              <X className="w-3 h-3" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Activate
                            </>
                          )}
                        </motion.button>
                        <motion.button
                          onClick={() => handleEditForm(form)}
                          className="flex-1 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 font-semibold py-2 px-3 rounded-xl transition-all duration-300 border border-yellow-500/30 hover:border-yellow-500 text-center text-sm flex items-center justify-center gap-1"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteForm(form.id, form.form_name)}
                          className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold py-2 px-3 rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-500 text-center text-sm flex items-center justify-center gap-1"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Form Submissions Modal/Section */}
              {selectedForm && (
                <motion.div
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSelectedForm(null)}
                >
                  <motion.div
                    className="bg-[#1E1810] rounded-3xl p-8 max-w-6xl w-full max-h-[85vh] overflow-y-auto border border-white/10 shadow-2xl"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between mb-8 border-b border-white/10 pb-4 gap-3">
                      <h3 className="text-2xl font-bold text-white">📄 Form Submissions</h3>

                      <div className="flex flex-wrap items-center gap-3">
                        {/* Filter Dropdown */}
                        <select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value as "all" | "selected" | "not_selected")}
                          className="bg-white/10 text-black px-3 py-2 rounded-md border border-white/20 focus:outline-none"
                        >
                          <option value="all">All</option>
                          <option value="selected">Selected</option>
                          <option value="not_selected">Not Selected</option>
                        </select>

                        {/* CSV Buttons */}
                        <button
                          onClick={() => downloadCSVForForm(selectedForm, "selected")}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-all"
                        >
                          <Download size={16} /> Selected CSV
                        </button>

                        <button
                          onClick={() => downloadCSVForForm(selectedForm, "not_selected")}
                          className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md transition-all"
                        >
                          <Download size={16} /> Not Selected CSV
                        </button>


                        <button
                          onClick={() => setSelectedForm(null)}
                          className="text-gray-400 hover:text-white text-xl transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Filtered Submissions */}
                    {formSubmissions.filter((sub) =>
                      filterType === "selected"
                        ? sub.is_selected
                        : filterType === "not_selected"
                          ? !sub.is_selected
                          : true
                    ).length > 0 ? (
                      <div className="space-y-6">
                        {formSubmissions
                          .filter((sub) =>
                            filterType === "selected"
                              ? sub.is_selected
                              : filterType === "not_selected"
                                ? !sub.is_selected
                                : true
                          )
                          .map((submission, index) => (
                            <motion.div
                              key={submission.id}
                              className={`rounded-2xl p-6 border transition-all duration-300 ${submission.is_selected
                                ? "bg-green-900/30 border-green-500/30"
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                                }`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              {/* Header */}
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-white">
                                  Submission {index + 1}
                                </h4>
                                <span className="text-xs text-gray-400">
                                  {new Date(submission.created_at).toLocaleString()}
                                </span>
                              </div>

                              {/* Candidate Info */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Field label="Name" value={submission.name} />
                                <Field label="Email" value={submission.email} />
                                <Field label="Phone" value={submission.phone || "N/A"} />

                                {submission.years_experience != null && (
                                  <Field
                                    label="Years of Experience"
                                    value={submission.years_experience}
                                  />
                                )}

                                {submission.profile_rating && (
                                  <Field
                                    label="Profile Rating"
                                    value={`⭐ ${submission.profile_rating.toFixed(1)} / 10`}
                                    highlight
                                  />
                                )}

                                {submission.portfolio_link && (
                                  <FieldLink label="Portfolio" href={submission.portfolio_link} />
                                )}

                                {submission.github_link && (
                                  <FieldLink label="GitHub" href={submission.github_link} />
                                )}

                                {submission.resume_link && (
                                  <FieldLink label="Resume" href={submission.resume_link} />
                                )}
                              </div>

                              {/* Proposal */}
                              {submission.proposal_link && (
                                <div className="mt-4">
                                  <p className="text-gray-400 text-sm mb-1">Proposal:</p>
                                  <p className="text-white break-words">{submission.proposal_link}</p>
                                </div>
                              )}

                              {/* Custom Responses */}
                              {submission.custom_responses &&
                                Object.keys(submission.custom_responses).length > 0 && (
                                  <div className="mt-5 border-t border-white/10 pt-4">
                                    <p className="text-gray-400 text-sm mb-2">Custom Responses:</p>
                                    <div className="space-y-1">
                                      {Object.entries(submission.custom_responses).map(([key, value]) => (
                                        <p key={key} className="text-white text-sm">
                                          <span className="text-gray-400">{key}:</span>{" "}
                                          {String(value)}
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                )}

                              {/* Selection Button */}
                              <div className="mt-5 flex justify-between items-center border-t border-white/10 pt-4">
                                <span
                                  className={`text-sm ${submission.is_selected
                                    ? "text-green-400"
                                    : "text-gray-400"
                                    }`}
                                >
                                  {submission.is_selected
                                    ? `✅ Selected on ${submission.selection_date ? new Date(submission.selection_date).toLocaleDateString() : "Unknown date"}`
                                    : "❌ Not Selected"}
                                </span>

                                <button
                                  onClick={() =>
                                    toggleCandidateSelection(
                                      submission.id,
                                      !submission.is_selected
                                    )
                                  }
                                  className={`px-4 py-2 rounded-md font-medium transition-all ${submission.is_selected
                                    ? "bg-red-600 hover:bg-red-700 text-white"
                                    : "bg-green-600 hover:bg-green-700 text-white"
                                    }`}
                                >
                                  {submission.is_selected ? "Unselect" : "Select Candidate"}
                                </button>
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-gray-400 text-sm">
                        No submissions found for this filter.
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}


            </motion.div>
          </section>
        </>
      )}
      <Toaster />
    </div>
  )
}

