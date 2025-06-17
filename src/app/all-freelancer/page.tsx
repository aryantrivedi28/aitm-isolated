'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

type Payload = {
  full_name: string;
  email: string;
  phone: string;
  linkedin_url: string;
  resume_url: string;
  portfolio_url: string;
  category: string;
  category_other: string;
  domains: string[];
  domains_other: string;
  tech_stack: string[];
  tech_other: string;
  tools: string[];
  tools_other: string;
  employment_status: string;
  employment_other: string;
  experience_level: string;
  experience_other: string;
};

export default function AdminABCPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [payload, setPayload] = useState<Payload>({
    full_name: '',
    email: '',
    phone: '',
    linkedin_url: '',
    resume_url: '',
    portfolio_url: '',
    category: '',
    category_other: '',
    domains: [],
    domains_other: '',
    tech_stack: [],
    tech_other: '',
    tools: [],
    tools_other: '',
    employment_status: '',
    employment_other: '',
    experience_level: '',
    experience_other: '',
  });

  // Mappings
  const categoryOptions = ['Developers','Growth','Designers','AI','Other'];
  const domainMap: Record<string,string[]> = {
    Developers: ['Frontend','Backend','Fullstack','Mobile','DevOps','Other'],
    Growth:     ['SEO','Content','Paid Ads','Email Marketing','Analytics','Other'],
    Designers:  ['UI/UX','Graphic','Motion / Video Editor','Illustration','Product','Other'],
    AI:         ['Prompt Engineering','Agent Dev','ML Ops','Data','NLP','Other'],
  };
  const techMap: Record<string,string[]> = {
    Developers: [
      'React','Next.js','Vue','Angular','Svelte','Ember',
      'Node.js','Django','Ruby on Rails','Laravel','Spring Boot','Go',
      'Other'
    ],
    AI: [
      'OpenAI API','LangChain','HuggingFace Transformers','Stable Diffusion','DALL·E',
      'Midjourney','Runway ML','ElevenLabs','TensorFlow','PyTorch','Other'
    ],
  };
  const toolMap: Record<string,string[]> = {
    Developers: [
      'VS Code','Webpack','Babel','ESLint','Prettier',
      'Postman','Prisma','Redis','RabbitMQ','REST Client',
      'Docker','Kubernetes','Terraform','Ansible',
      'Jenkins','GitLab CI','CircleCI','Prometheus','Grafana',
      'Other'
    ],
    Growth: [
      'Ahrefs','SEMrush','Moz','Screaming Frog','Google Search Console',
      'WordPress','Medium','Notion','Google Docs','Grammarly',
      'Google Ads','Facebook Ads Manager','LinkedIn Ads','Twitter Ads','TikTok Ads',
      'Mailchimp','HubSpot','SendGrid','ConvertKit','ActiveCampaign',
      'Google Analytics','Mixpanel','Amplitude','Hotjar','Tableau',
      'Other'
    ],
    Designers: [
      'InVision','Zeplin','Miro','Marvel',
      'Canva','Affinity Designer','CorelDRAW',
      'Frame.io','Vimeo','Adobe Media Encoder',
      'Wacom Tablet','iPad Pro','Adobe Fresco',
      'Jira','Confluence','Abstract',
      'Other'
    ],
    AI: [
      'ChatGPT','GPT-4 Playground','LangChain','AutoGPT','RAG Frameworks',
      'Jupyter','Colab','Weights & Biases','Airflow','Label Studio',
      'Other'
    ],
  };
  const employmentOptions = ['Student','Full-time Employee','Full-time Freelancer','Other'];
  const experienceOptions = ['Less than 1 Year of Experience','1-3 Years of Experience','3-5 Years of Experience','5+ Years of Experience'];

  // Progress state
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let filled = 0;
    if (payload.full_name)        filled++;
    if (payload.email)            filled++;
    if (payload.phone)            filled++;
    if (payload.category)         filled++;
    // domains
    if (payload.category === 'Other'
        ? Boolean(payload.domains_other)
        : payload.domains.length > 0
    ) filled++;
    // tech for Dev/AI
    if (['Developers','AI'].includes(payload.category)) {
      if (
        payload.tech_stack.includes('Other')
          ? Boolean(payload.tech_other)
          : payload.tech_stack.length > 0
      ) filled++;
    }
    if (payload.employment_status) filled++;
    if (payload.experience_level)  filled++;

    // calculate total fields
    let total = 3 /*name,email,phone*/ + 1 /*category*/ + 1 /*domains*/ + 2 /*employment,experience*/;
    if (['Developers','AI'].includes(payload.category))    total++;
    setProgress(Math.round((filled / total) * 100));
  }, [payload]);

  // Helpers
  const toggle = (key: keyof Payload, val: string) => {
    setPayload(p => {
      const arr = p[key] as string[];
      return {
        ...p,
        [key]: arr.includes(val)
          ? arr.filter(x => x !== val)
          : [...arr, val],
      };
    });
  };
  const change = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPayload(p => ({
      ...p,
      [name]: value,
    }));
  };

  // Submit
  const submit = async () => {
    const record = {
      ...payload,
      category: payload.category === 'Other' ? payload.category_other : payload.category,
      domains: payload.domains.includes('Other') ? [payload.domains_other] : payload.domains,
      tech_stack: payload.tech_stack.includes('Other') ? [payload.tech_other] : payload.tech_stack,
      tools: payload.tools.includes('Other') ? [payload.tools_other] : payload.tools,
      employment_status: payload.employment_status === 'Other'
        ? payload.employment_other
        : payload.employment_status,
    };
    const { error } = await supabase.from('all-freelancer').insert([record]);
    if (error) alert(error.message);
    else router.push('/thank-you');
  };

  return (
    <main className="min-h-screen bg-[#241C15] p-6 text-white">
      <div className="max-w-2xl mx-auto bg-[#241C15] p-8 rounded-lg shadow">
        <h1 className="text-xl font-bold mb-4">Freelancer Onboarding</h1>

        {/* Progress */}
        <div className="mb-6">
          <div className="h-2 w-full bg-gray-700 rounded-full">
            <div
              className="h-full bg-[#FFE01B] rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-right mt-1">Progress: {progress}%</div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <input
              name="full_name"
              required
              value={payload.full_name}
              onChange={change}
              placeholder="Full Name*"
              className="w-full border rounded px-3 py-2 bg-transparent text-white"
            />
            <input
              name="email"
              type="email"
              required
              value={payload.email}
              onChange={change}
              placeholder="Email*"
              className="w-full border rounded px-3 py-2 bg-transparent text-white"
            />
            <input
              name="phone"
              required
              value={payload.phone}
              onChange={change}
              placeholder="Phone Number*"
              className="w-full border rounded px-3 py-2 bg-transparent text-white"
            />
            <input
              name="linkedin_url"
              value={payload.linkedin_url}
              onChange={change}
              placeholder="LinkedIn URL"
              className="w-full border rounded px-3 py-2 bg-transparent text-white"
            />
            <input
              name="portfolio_url"
              value={payload.portfolio_url}
              onChange={change}
              placeholder="Portfolio URL"
              className="w-full border rounded px-3 py-2 bg-transparent text-white"
            />
            <input
              name="resume_url"
              type="url"
              value={payload.resume_url}
              onChange={change}
              placeholder="Resume URL"
              className="w-full border rounded px-3 py-2 bg-transparent text-white"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="bg-yellow-400 text-black px-4 py-2 rounded"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Category */}
            <select
              name="category"
              required
              value={payload.category}
              onChange={change}
              className="w-full border rounded px-3 py-2 bg-white text-black"
            >
              <option value="">Select Category*</option>
              {categoryOptions.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            {payload.category === 'Other' && (
              <input
                name="category_other"
                value={payload.category_other}
                onChange={change}
                placeholder="Enter other category"
                className="w-full border rounded px-3 py-2 bg-transparent text-white"
              />
            )}

            {/* Domains */}
            {payload.category !== 'Other' && domainMap[payload.category] && (
              <div>
                <label className="block mb-1">Domains*</label>
                <div className="flex flex-wrap gap-2">
                  {domainMap[payload.category]!.map(d => (
                    <button
                      key={d}
                      onClick={() => toggle('domains', d)}
                      className={`border px-3 py-1 rounded-full ${
                        payload.domains.includes(d) ? 'bg-yellow-400 text-black' : 'text-white'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                {payload.domains.includes('Other') && (
                  <input
                    name="domains_other"
                    value={payload.domains_other}
                    onChange={change}
                    placeholder="Enter other domain"
                    className="w-full border rounded px-3 py-2 bg-transparent text-white mt-2"
                  />
                )}
              </div>
            )}
            {payload.category === 'Other' && (
              <input
                name="domains_other"
                required
                value={payload.domains_other}
                onChange={change}
                placeholder="Enter domain"
                className="w-full border rounded px-3 py-2 bg-transparent text-white"
              />
            )}

            {/* Tech Stack */}
            {['Developers','AI'].includes(payload.category) && techMap[payload.category] && (
              <div>
                <label className="block mb-1">Tech Stack*</label>
                <div className="flex flex-wrap gap-2">
                  {techMap[payload.category]!.map(t => (
                    <button
                      key={t}
                      onClick={() => toggle('tech_stack', t)}
                      className={`border px-3 py-1 rounded-full ${
                        payload.tech_stack.includes(t) ? 'bg-yellow-400 text-black' : 'text-white'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {payload.tech_stack.includes('Other') && (
                  <input
                    name="tech_other"
                    value={payload.tech_other}
                    onChange={change}
                    placeholder="Enter other tech"
                    className="w-full border rounded px-3 py-2 bg-transparent text-white mt-2"
                  />
                )}
              </div>
            )}

            {/* Tools */}
            {payload.category && toolMap[payload.category] && (
              <div>
                <label className="block mb-1">Tools</label>
                <div className="flex flex-wrap gap-2">
                  {toolMap[payload.category]!.map(t => (
                    <button
                      key={t}
                      onClick={() => toggle('tools', t)}
                      className={`border px-3 py-1 rounded-full ${
                        payload.tools.includes(t) ? 'bg-yellow-400 text-black' : 'text-white'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {payload.tools.includes('Other') && (
                  <input
                    name="tools_other"
                    value={payload.tools_other}
                    onChange={change}
                    placeholder="Enter other tool"
                    className="w-full border rounded px-3 py-2 bg-transparent text-white mt-2"
                  />
                )}
              </div>
            )}

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="text-gray-400">Back</button>
              <button onClick={() => setStep(3)} className="bg-yellow-400 text-black px-4 py-2 rounded">
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">

            <select
              name="employment_status"
              required
              value={payload.employment_status}
              onChange={change}
              className="w-full border rounded px-3 py-2 bg-white text-black"
            >
              <option value="">Employment Status*</option>
              {employmentOptions.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            {payload.employment_status === 'Other' && (
              <input
                name="employment_other"
                value={payload.employment_other}
                onChange={change}
                placeholder="Enter other status"
                className="w-full border rounded px-3 py-2 bg-transparent text-white"
              />
            )}

            <select
              name="experience_level"
              required
              value={payload.experience_level}
              onChange={change}
              className="w-full border rounded px-3 py-2 bg-white text-black"
            >
              <option value="">Experience Level*</option>
              {experienceOptions.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            {payload.experience_level === 'Other' && (
              <input
                name="employment_other"
                value={payload.experience_other}
                onChange={change}
                placeholder="Enter other experience"
                className="w-full border rounded px-3 py-2 bg-transparent text-white"
              />
            )}
            {payload.experience_level === 'Other' && (
              <input
                name="experience_other"                   
                value={payload.experience_other}
                onChange={change}
                placeholder="Enter other experience"
                className="w-full border rounded px-3 py-2 bg-transparent text-white"
              />
            )}

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="text-gray-400">Back</button>
              <button onClick={submit} className="bg-yellow-400 text-black px-4 py-2 rounded">Submit</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
