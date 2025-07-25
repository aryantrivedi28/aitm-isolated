'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/SupabaseAuthClient'
import { useRouter } from 'next/navigation';

export default function AIFreelancerOnboarding() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    company: '',
    college: '',
    projects: '',
    otherDomain: '',
    otherTool: ''
  });
  const [step, setStep] = useState(1);
  const [domains, setDomains] = useState<string[]>([]);
  const [tools, setTools]   = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const domainOptions = [
    'Frontend Development', 'Backend Development', 'Fullstack Development', 'Prompt Engineering',
    'Data Annotation', 'MLOps & Deployment', 'Model Fine-tuning', 'Chatbot/Conversational AI',
    'UI/UX Design', 'Graphic Design', 'Video Editing', 'Motion Graphics', '3D Design & Animation',
    'Content Writing & Copywriting', 'SEO Content & Optimization', 'Voiceover & Audio', 'RPA & Automation',
    'Business Automation', 'Computer Vision', 'NLP Applications', 'Finance & Compliance Automation',
    'Healthcare AI', 'Education AI'
  ];

  const toolOptions = [
    'OpenAI API', 'ChatGPT / GPT-4', 'LangChain', 'LlamaIndex', 'Hugging Face Transformers',
    'Stable Diffusion', 'DALL·E', 'Midjourney', 'Runway ML', 'ElevenLabs', 'Murf AI', 'Descript',
    'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'OpenCV', 'spaCy', 'n8n', 'Zapier', 'Make.com',
    'Streamlit', 'Gradio', 'Pinecone', 'Weaviate', 'Jupyter / Colab', 'AWS SageMaker', 'Google Vertex AI',
    'Figma AI plugins', 'Uizard', 'Adobe Firefly', 'Synthesia'
  ];

  const toggleSelection = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    option: string
  ) => {
    if (list.includes(option)) {
      setList(list.filter((item) => item !== option));
    } else {
      setList([...list, option]);
    }
  };
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!supabase) {
      alert('Supabase client is not initialized.');
      return;
    }

    const { error } = await supabase.from('ai_freelancers').insert([
      {
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        linkedin: form.linkedin,
        portfolio: form.portfolio,
        company: form.company,
        college: form.college,
        projects: form.projects,
        domains,
        other_domain: form.otherDomain,
        tools,
        other_tool: form.otherTool,
      },
    ]);

    if (error) {
      console.error('Submission error:', error.message);
      alert('Something went wrong! Check the console.');
    } else {
      router.push('/thank-you');
    }
  };

  useEffect(() => {
    const required: Array<keyof typeof form> = ['fullName','email','phone'];
    let filled = required.filter(key => Boolean(form[key])).length;
    if (domains.length || form.otherDomain) filled++;
    if (tools.length   || form.otherTool)   filled++;
    setProgress(Math.round((filled / 5) * 100));
  }, [form, domains, tools]);
  
  return (
    <main className="min-h-screen bg-[#241C15] text-white">
      <header className="bg-[#241C15] text-white py-4 text-center text-lg font-bold">
        AI Freelancer Onboarding
      </header>
      <div className="max-w-3xl mx-auto p-6 pb-24">
        <div className="bg-[#241C15] rounded-xl shadow p-8">
          <div className="mb-6">
            <div className="h-2 w-full bg-gray-700 rounded-full">
              <div
                className="h-full bg-[#FFE01B] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-sm text-right mt-1">Step {step} of 3</div>
          </div>

          {step === 1 && (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
              <input type="text" name="fullName" required placeholder="Full Name*" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-white placeholder-gray-400 bg-transparent" />
              <input type="email" name="email" required placeholder="Email*" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-white placeholder-gray-400 bg-transparent" />
              <input type="text" name="phone" required placeholder="Phone Number (WhatsApp preferred)*" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-white placeholder-gray-400 bg-transparent" />
              <input type="text" name="linkedin" placeholder="LinkedIn Profile (optional)" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-white placeholder-gray-400 bg-transparent" />
              <input type="text" name="portfolio" placeholder="Portfolio (optional but highly recommended)" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-white placeholder-gray-400 bg-transparent" />
              <input type="text" name="company" placeholder="Company (optional)" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-white placeholder-gray-400 bg-transparent" />
              <input type="text" name="college" placeholder="College (optional)" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-white placeholder-gray-400 bg-transparent" />
              <input type="text" name="projects" placeholder="Have you done any AI-related projects? (briefly describe)" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-white placeholder-gray-400 bg-transparent"/>
              <div className="flex justify-end">
                <button type="submit" className="bg-yellow-400 text-black px-6 py-2 rounded hover:bg-yellow-300">Next</button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
              <div>
                <label className="block mb-2">Domain Specializations*</label>
                <div className="flex flex-wrap gap-2">
                  {domainOptions.map((option) => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => toggleSelection(domains, setDomains, option)}
                      className={`border border-white px-4 py-1 rounded-full text-sm transition-colors duration-200 ${
                        domains.includes(option)
                          ? 'bg-yellow-400 text-black'
                          : 'text-white hover:bg-yellow-400 hover:text-white'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <input type="text" name="otherDomain" placeholder="Other domain (if not listed)" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 mt-2 text-white placeholder-gray-400 bg-transparent" />
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(1)} type="button" className="text-sm text-gray-400">Back</button>
                <button type="submit" className="bg-yellow-400 text-black px-6 py-2 rounded hover:bg-yellow-300">Next</button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2">Tools & Frameworks*</label>
                <div className="flex flex-wrap gap-2">
                  {toolOptions.map((option) => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => toggleSelection(tools, setTools, option)}
                      className={`border border-white px-4 py-1 rounded-full text-sm transition-colors duration-200 ${
                        tools.includes(option)
                          ? 'bg-yellow-400 text-black'
                          : 'text-white hover:bg-yellow-400 hover:text-white'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <input type="text" name="otherTool" placeholder="Other tool (if not listed)" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 mt-2 text-white placeholder-gray-400 bg-transparent" />
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(2)} type="button" className="text-sm text-gray-400">Back</button>
                <button type="submit" className="bg-yellow-400 text-black px-6 py-2 rounded hover:bg-yellow-300">Submit</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
