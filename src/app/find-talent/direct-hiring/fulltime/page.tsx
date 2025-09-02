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
    role_type: "fulltime",
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
    <div className="min-h-screen flex items-center justify-center bg-[#241C15] text-white px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white text-black rounded-2xl shadow-2xl p-8 w-full max-w-2xl"
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[#241C15]">
                <User className="w-6 h-6 text-[#FFE01B]" />
                Step 1: Client Details
              </h2>

              {Object.entries(clientDetails).map(([key, value]) => (
                <div key={key} className="mb-4">
                  <label className="block text-gray-600 text-sm mb-1">
                    {key.replace("_", " ").toUpperCase()}
                  </label>
                  <input
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#FFE01B] outline-none"
                    placeholder={key.replace("_", " ")}
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

              <button
                onClick={handleClientSubmit}
                className="mt-4 bg-[#FFE01B] text-black px-6 py-3 rounded-xl font-bold w-full flex items-center justify-center gap-2 transition transform hover:scale-105 hover:bg-[#FCD34D] active:scale-95"
              >
                Next <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[#241C15]">
                <Briefcase className="w-6 h-6 text-[#FFE01B]" />
                Step 2: Hiring Request
              </h2>

              {/* Role Type Display */}
              <div className="mb-4 p-3 border rounded-lg bg-gray-50 flex items-center gap-2 text-gray-700">
                <FileText className="w-5 h-5 text-[#241C15]" />
                Role Type: <b>{hiringDetails.role_type}</b>
              </div>

              {/* Job Title */}
              <input
                className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-4 focus:ring-2 focus:ring-[#FFE01B] outline-none"
                placeholder="Job Title"
                value={hiringDetails.job_title}
                onChange={(e) =>
                  setHiringDetails({
                    ...hiringDetails,
                    job_title: e.target.value,
                  })
                }
              />

              {/* Description */}
              <textarea
                className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-4 focus:ring-2 focus:ring-[#FFE01B] outline-none"
                placeholder="Job Description"
                rows={4}
                value={hiringDetails.description}
                onChange={(e) =>
                  setHiringDetails({
                    ...hiringDetails,
                    description: e.target.value,
                  })
                }
              />

              {/* Budget */}
              <div className="relative mb-4">
                <DollarSign className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  className="border border-gray-300 rounded-lg pl-10 pr-3 py-2 w-full focus:ring-2 focus:ring-[#FFE01B] outline-none"
                  placeholder="Budget Range"
                  value={hiringDetails.budget_range}
                  onChange={(e) =>
                    setHiringDetails({
                      ...hiringDetails,
                      budget_range: e.target.value,
                    })
                  }
                />
              </div>

              {/* Categories */}
              <label className="mb-2 font-semibold text-[#241C15] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#FFE01B]" /> Categories
              </label>
              <div className="mb-4 flex flex-wrap gap-2">
                {Object.keys(categoryOptions).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() =>
                      setHiringDetails({
                        ...hiringDetails,
                        categories: toggleSelect(
                          hiringDetails.categories,
                          cat
                        ),
                      })
                    }
                    className={`px-3 py-1 rounded-full border transition ${hiringDetails.categories.includes(cat)
                        ? "bg-[#FFE01B] text-black"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Subcategories */}
              {getAvailableSubcategories().length > 0 && (
                <>
                  <label className="mb-2 font-semibold text-[#241C15] flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-[#FFE01B]" /> Subcategories
                  </label>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {getAvailableSubcategories().map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() =>
                          setHiringDetails({
                            ...hiringDetails,
                            subcategories: toggleSelect(
                              hiringDetails.subcategories,
                              sub
                            ),
                          })
                        }
                        className={`px-3 py-1 rounded-full border transition ${hiringDetails.subcategories.includes(sub)
                            ? "bg-[#FFE01B] text-black"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Tools */}
              {getAvailableToolsMerged().length > 0 && (
                <>
                  <label className="mb-2 font-semibold text-[#241C15] flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-[#FFE01B]" /> Tools / Tech
                    Stacks
                  </label>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {getAvailableToolsMerged().map((tool) => (
                      <button
                        key={tool}
                        type="button"
                        onClick={() =>
                          setHiringDetails({
                            ...hiringDetails,
                            tools: toggleSelect(
                              hiringDetails.tools,
                              tool
                            ),
                          })
                        }
                        className={`px-3 py-1 rounded-full border transition ${hiringDetails.tools.includes(tool)
                            ? "bg-[#FFE01B] text-black"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                      >
                        {tool}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between gap-4 mt-6">
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold transition hover:bg-gray-300 active:scale-95"
                >
                  <ArrowLeft className="w-5 h-5" /> Back
                </button>
                <button
                  onClick={handleHiringSubmit}
                  className="bg-[#FFE01B] text-black px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition transform hover:scale-105 hover:bg-[#FCD34D] active:scale-95"
                >
                  Submit Request <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
