"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Briefcase,
  FileText,
  DollarSign,
  Layers,
  Wrench,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

type CategoryOptionsType = typeof categoryOptions;

const categoryOptions = {
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
} as const;

export default function ClientFormPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const router = useRouter();

  const [clientDetails, setClientDetails] = useState({
    name: "",
    company_name: "",
    website: "",
    industry: "",
    phone: "",
  });

  const [hiringDetails, setHiringDetails] = useState({
    role_type: "freelancer",
    job_title: "",
    description: "",
    budget_range: "",
    categories: [] as string[],
    otherCategories: [] as string[],
    subcategories: [] as string[],
    otherSubcategories: [] as string[],
    tools: [] as string[],
    otherTools: [] as string[],
  });

useEffect(() => {
  async function fetchClient() {
    try {
      const res = await fetch("/api/client/me", { credentials: "include" });
      const data = await res.json();

      if (data?.client) {
        setClientDetails({
          name: data.client.name || "",
          company_name: data.client.company_name || "",
          website: data.client.website || "",
          industry: data.client.industry || "",
          phone: data.client.phone || "",
        });
      }

      // Only move to step 2 if profile is complete
      if (data?.exists) setStep(2);
    } catch (err) {
      console.error("Error fetching client:", err);
    }
  }
  fetchClient();
}, []);


  const handleClientSubmit = async () => {
    try {
      const res = await fetch("/api/client/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientDetails),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("client_id", data.client.id);
        setStep(2);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleHiringSubmit = async () => {
    try {
      const client_id = localStorage.getItem("client_id");
      if (!client_id) return alert("Client ID missing");

      const payload = {
        client_id,
        role_type: hiringDetails.role_type,
        job_title: hiringDetails.job_title,
        description: hiringDetails.description,
        budget_range: hiringDetails.budget_range,
        category: [
          ...hiringDetails.categories.filter((c) => c !== "Other"),
          ...hiringDetails.otherCategories,
        ],
        subcategory: [
          ...hiringDetails.subcategories.filter((s) => s !== "Other"),
          ...hiringDetails.otherSubcategories,
        ],
        tools: [
          ...hiringDetails.tools.filter((t) => t !== "Other"),
          ...hiringDetails.otherTools,
        ],
      };

      const res = await fetch("/api/client/hiring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) router.push("/find-talent/thank-you");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSelect = (arr: string[], value: string) => {
    if (arr.includes(value)) return arr.filter((v) => v !== value);
    return [...arr, value];
  };

  const getAvailableSubcategories = () =>
    hiringDetails.categories.length === 1 && hiringDetails.categories[0] !== "Other"
      ? categoryOptions[hiringDetails.categories[0] as keyof CategoryOptionsType].subcategories
      : [];

  const getAvailableToolsMerged = () => {
    if (hiringDetails.categories.length === 1 && hiringDetails.categories[0] !== "Other") {
      const cat = hiringDetails.categories[0] as keyof CategoryOptionsType;
      const { techStacks, tools } = categoryOptions[cat];
      const merged: string[] = [...techStacks];
      Object.values(tools).forEach((arr) => merged.push(...arr));
      return Array.from(new Set(merged));
    }
    return [];
  };

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }

        .animate-float { animation: float 20s ease-in-out infinite; }
      `}</style>

      <div className="client-form min-h-screen flex items-center justify-center bg-[#fbf5e5] px-4 py-8 relative overflow-hidden pt-[100px] sm:pt-[120px]">
        
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-10 w-64 h-64 bg-[#FFE01B]/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#FCD34D]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '5s' }} />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-3xl border-2 border-[#241C15]/10 relative overflow-hidden">
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[#241C15]/70">Step {step} of 2</span>
              <span className="text-sm font-semibold text-[#241C15]/70">{step === 1 ? '50%' : '100%'}</span>
            </div>
            <div className="h-2 bg-[#241C15]/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] transition-all duration-500 ease-out"
                style={{ width: step === 1 ? '50%' : '100%' }}
              />
            </div>
          </div>

          {/* Step 1: Client Details */}
          {step === 1 && (
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#241C15] px-4 py-2 rounded-full mb-6">
                <User className="w-4 h-4 text-[#FFE01B]" />
                <span className="text-sm font-semibold text-[#fbf5e5]">Client Information</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 text-[#241C15]">
                Tell Us About
                <span className="block bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] bg-clip-text text-transparent mt-1">
                  Your Company
                </span>
              </h2>
              <p className="text-[#241C15]/70 mb-8 text-sm sm:text-base font-medium">
                We need some basic information to get started
              </p>

              <div className="space-y-5">
                {Object.entries(clientDetails).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-[#241C15] text-sm font-semibold mb-2">
                      {key.replace("_", " ").toUpperCase()}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      className="border-2 border-[#241C15]/20 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-[#FFE01B] focus:border-[#FFE01B] outline-none transition-all bg-[#fbf5e5] text-[#241C15]"
                      placeholder={`Enter your ${key.replace("_", " ")}`}
                      value={value}
                      onChange={(e) =>
                        setClientDetails({
                          ...clientDetails,
                          [key]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleClientSubmit}
                className="mt-8 bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] text-[#241C15] px-8 py-4 rounded-xl font-bold w-full flex items-center justify-center gap-2 transition transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl"
              >
                Continue to Job Details <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 2: Hiring Details */}
          {step === 2 && (
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#241C15] px-4 py-2 rounded-full mb-6">
                <Briefcase className="w-4 h-4 text-[#FFE01B]" />
                <span className="text-sm font-semibold text-[#fbf5e5]">Job Requirements</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 text-[#241C15]">
                Describe Your
                <span className="block bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] bg-clip-text text-transparent mt-1">
                  Hiring Needs
                </span>
              </h2>
              <p className="text-[#241C15]/70 mb-8 text-sm sm:text-base font-medium">
                Help us match you with the perfect talent
              </p>

              {/* Role Type Display */}
              <div className="mb-6 p-4 border-2 border-[#FFE01B]/30 rounded-xl bg-[#FFE01B]/10 flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#241C15]" />
                <div>
                  <span className="text-sm text-[#241C15]/70 font-medium">Role Type:</span>
                  <span className="ml-2 font-bold text-[#241C15]">{hiringDetails.role_type}</span>
                </div>
              </div>

              <div className="space-y-5 mb-6">
                {/* Job Title */}
                <div>
                  <label className="block text-[#241C15] text-sm font-semibold mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="border-2 border-[#241C15]/20 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-[#FFE01B] focus:border-[#FFE01B] outline-none transition-all bg-[#fbf5e5] text-[#241C15]"
                    placeholder="e.g. Senior React Developer"
                    value={hiringDetails.job_title}
                    onChange={(e) =>
                      setHiringDetails({
                        ...hiringDetails,
                        job_title: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[#241C15] text-sm font-semibold mb-2">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="border-2 border-[#241C15]/20 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-[#FFE01B] focus:border-[#FFE01B] outline-none transition-all bg-[#fbf5e5] text-[#241C15] resize-none"
                    placeholder="Describe the role, responsibilities, and requirements..."
                    rows={4}
                    value={hiringDetails.description}
                    onChange={(e) =>
                      setHiringDetails({
                        ...hiringDetails,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-[#241C15] text-sm font-semibold mb-2">
                    Budget Range <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#241C15]/40 w-5 h-5" />
                    <input
                      className="border-2 border-[#241C15]/20 rounded-xl pl-11 pr-4 py-3 w-full focus:ring-2 focus:ring-[#FFE01B] focus:border-[#FFE01B] outline-none transition-all bg-[#fbf5e5] text-[#241C15]"
                      placeholder="e.g. $3000 - $5000/month"
                      value={hiringDetails.budget_range}
                      onChange={(e) =>
                        setHiringDetails({
                          ...hiringDetails,
                          budget_range: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="mb-3 font-bold text-[#241C15] flex items-center gap-2 text-base">
                  <Layers className="w-5 h-5 text-[#FFE01B]" /> Select Category
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(categoryOptions).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() =>
                        setHiringDetails({
                          ...hiringDetails,
                          categories: toggleSelect(hiringDetails.categories, cat),
                          subcategories: [],
                          tools: [],
                        })
                      }
                      className={`px-4 py-2.5 rounded-xl border-2 transition-all font-semibold text-sm ${
                        hiringDetails.categories.includes(cat)
                          ? "bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] text-[#241C15] border-[#FFE01B] shadow-md scale-105"
                          : "bg-white text-[#241C15]/70 border-[#241C15]/20 hover:border-[#FFE01B] hover:bg-[#fbf5e5]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategories */}
              {getAvailableSubcategories().length > 0 && (
                <div className="mb-6">
                  <label className="mb-3 font-bold text-[#241C15] flex items-center gap-2 text-base">
                    <Wrench className="w-5 h-5 text-[#FFE01B]" /> Specialization
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {getAvailableSubcategories().map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() =>
                          setHiringDetails({
                            ...hiringDetails,
                            subcategories: toggleSelect(hiringDetails.subcategories, sub),
                          })
                        }
                        className={`px-4 py-2 rounded-xl border-2 transition-all font-medium text-sm ${
                          hiringDetails.subcategories.includes(sub)
                            ? "bg-[#FFE01B] text-[#241C15] border-[#FFE01B]"
                            : "bg-white text-[#241C15]/70 border-[#241C15]/20 hover:border-[#FFE01B] hover:bg-[#fbf5e5]"
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools */}
              {getAvailableToolsMerged().length > 0 && (
                <div className="mb-6">
                  <label className="mb-3 font-bold text-[#241C15] flex items-center gap-2 text-base">
                    <Wrench className="w-5 h-5 text-[#FFE01B]" /> Required Skills / Tech Stack
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-2 bg-[#fbf5e5] rounded-xl border-2 border-[#241C15]/10">
                    {getAvailableToolsMerged().map((tool) => (
                      <button
                        key={tool}
                        type="button"
                        onClick={() =>
                          setHiringDetails({
                            ...hiringDetails,
                            tools: toggleSelect(hiringDetails.tools, tool),
                          })
                        }
                        className={`px-3 py-2 rounded-lg border-2 transition-all font-medium text-sm ${
                          hiringDetails.tools.includes(tool)
                            ? "bg-[#FFE01B] text-[#241C15] border-[#FFE01B]"
                            : "bg-white text-[#241C15]/70 border-[#241C15]/20 hover:border-[#FFE01B]"
                        }`}
                      >
                        {tool}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-[#241C15]/20 text-[#241C15] font-semibold transition hover:bg-[#fbf5e5] hover:border-[#241C15]/40 active:scale-95"
                >
                  <ArrowLeft className="w-5 h-5" /> Back
                </button>
                <button
                  onClick={handleHiringSubmit}
                  className="w-full flex-1 bg-gradient-to-r from-[#FFE01B] to-[#FCD34D] text-[#241C15] px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl"
                >
                  Submit Request <CheckCircle2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
