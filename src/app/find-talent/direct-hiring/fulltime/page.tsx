"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen flex items-center justify-center bg-[#241C15] text-white">
      <div className="bg-white text-black rounded-2xl shadow-xl p-8 w-[600px]">
        {/* Step 1 */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold mb-4">Step 1: Client Details</h2>
            {Object.entries(clientDetails).map(([key, value]) => (
              <input
                key={key}
                className="border p-2 w-full mb-3"
                placeholder={key.replace("_", " ").toUpperCase()}
                value={value}
                onChange={(e) =>
                  setClientDetails({ ...clientDetails, [key]: e.target.value })
                }
              />
            ))}
            <button
              onClick={handleClientSubmit}
              className="bg-[#FFE01B] hover:bg-yellow-300 px-4 py-2 rounded w-full font-bold"
            >
              Next → Hiring Details
            </button>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-bold mb-4">Step 2: Hiring Request</h2>

            <div className="mb-3 p-2 border rounded bg-gray-100">
              Role Type: <b>{hiringDetails.role_type}</b>
            </div>

            <input
              className="border p-2 w-full mb-3"
              placeholder="Job Title"
              value={hiringDetails.job_title}
              onChange={(e) =>
                setHiringDetails({ ...hiringDetails, job_title: e.target.value })
              }
            />
            <textarea
              className="border p-2 w-full mb-3"
              placeholder="Job Description"
              value={hiringDetails.description}
              onChange={(e) =>
                setHiringDetails({ ...hiringDetails, description: e.target.value })
              }
            />
            <input
              className="border p-2 w-full mb-3"
              placeholder="Budget Range"
              value={hiringDetails.budget_range}
              onChange={(e) =>
                setHiringDetails({ ...hiringDetails, budget_range: e.target.value })
              }
            />

            {/* Categories Multi-select */}
            <label className="block mb-1 font-semibold">Categories</label>
            <div className="mb-3 flex flex-wrap gap-2">
              {Object.keys(categoryOptions).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() =>
                    setHiringDetails({
                      ...hiringDetails,
                      categories: toggleSelect(hiringDetails.categories, cat),
                    })
                  }
                  className={`px-2 py-1 border rounded ${
                    hiringDetails.categories.includes(cat) ? "bg-yellow-300" : ""
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                type="button"
                onClick={() =>
                  setHiringDetails({
                    ...hiringDetails,
                    categories: toggleSelect(hiringDetails.categories, "Other"),
                  })
                }
                className={`px-2 py-1 border rounded ${
                  hiringDetails.categories.includes("Other") ? "bg-yellow-300" : ""
                }`}
              >
                Other
              </button>
            </div>
            {hiringDetails.categories.includes("Other") && (
              <input
                className="border p-2 w-full mb-3"
                placeholder="Enter custom categories (comma separated)"
                value={hiringDetails.otherCategories.join(",")}
                onChange={(e) =>
                  setHiringDetails({
                    ...hiringDetails,
                    otherCategories: e.target.value.split(","),
                  })
                }
              />
            )}

            {/* Subcategories Multi-select */}
            {getAvailableSubcategories().length > 0 && (
              <>
                <label className="block mb-1 font-semibold">Subcategories</label>
                <div className="mb-3 flex flex-wrap gap-2">
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
                      className={`px-2 py-1 border rounded ${
                        hiringDetails.subcategories.includes(sub) ? "bg-yellow-300" : ""
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setHiringDetails({
                        ...hiringDetails,
                        subcategories: toggleSelect(hiringDetails.subcategories, "Other"),
                      })
                    }
                    className={`px-2 py-1 border rounded ${
                      hiringDetails.subcategories.includes("Other") ? "bg-yellow-300" : ""
                    }`}
                  >
                    Other
                  </button>
                </div>
                {hiringDetails.subcategories.includes("Other") && (
                  <input
                    className="border p-2 w-full mb-3"
                    placeholder="Enter custom subcategories (comma separated)"
                    value={hiringDetails.otherSubcategories.join(",")}
                    onChange={(e) =>
                      setHiringDetails({
                        ...hiringDetails,
                        otherSubcategories: e.target.value.split(","),
                      })
                    }
                  />
                )}
              </>
            )}

            {/* Tools + TechStacks Merged */}
            {getAvailableToolsMerged().length > 0 && (
              <>
                <label className="block mb-1 font-semibold">Tools / Tech Stacks</label>
                <div className="mb-3 flex flex-wrap gap-2">
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
                      className={`px-2 py-1 border rounded ${
                        hiringDetails.tools.includes(tool) ? "bg-yellow-300" : ""
                      }`}
                    >
                      {tool}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setHiringDetails({
                        ...hiringDetails,
                        tools: toggleSelect(hiringDetails.tools, "Other"),
                      })
                    }
                    className={`px-2 py-1 border rounded ${
                      hiringDetails.tools.includes("Other") ? "bg-yellow-300" : ""
                    }`}
                  >
                    Other
                  </button>
                </div>
                {hiringDetails.tools.includes("Other") && (
                  <input
                    className="border p-2 w-full mb-3"
                    placeholder="Enter custom tools (comma separated)"
                    value={hiringDetails.otherTools.join(",")}
                    onChange={(e) =>
                      setHiringDetails({
                        ...hiringDetails,
                        otherTools: e.target.value.split(","),
                      })
                    }
                  />
                )}
              </>
            )}

            <button
              onClick={handleHiringSubmit}
              className="bg-[#FFE01B] hover:bg-yellow-300 px-4 py-2 rounded w-full font-bold"
            >
              Submit Request
            </button>
          </>
        )}
      </div>
    </div>
  );
}
