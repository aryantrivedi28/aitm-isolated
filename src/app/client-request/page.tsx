'use client';

console.log('🚀 LOADED client-request/page.tsx')
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { matchFreelancerToClient } from '../../lib/matchmaker';

export default function ClientRequestForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    services: [] as string[],
    requirement: '',
    budget: '',
    timeline: '',
    notes: ''
  });

  const [progress, setProgress] = useState(0);

  const serviceOptions = [
    'UI/UX Design', 'Graphic Design', 'Video Editing',
    'Frontend Development', 'Backend Development', 'Fullstack Development',
    'Automation (RPA)', 'Prompt Engineering', 'AI Chatbots / LLMs',
    'AI API Integration', 'AI Agent Creation',
    'Content Writing', 'SEO / Blogs', 'Performance Marketing',
    'Social Media', 'Business Automation', 'MLOps / Model Tuning'
  ];

  useEffect(() => {
    let filled = 0;
    if (form.fullName) filled++;
    if (form.email) filled++;
    if (form.phone) filled++;
    if (form.services.length) filled++;
    if (form.requirement) filled++;
    setProgress(Math.round((filled / 5) * 100));
  }, [form]);

  const toggleService = (option: string) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(option)
        ? prev.services.filter(item => item !== option)
        : [...prev.services, option]
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      full_name: form.fullName,
      email: form.email,
      phone: form.phone,
      company: form.company,
      services: form.services,
      requirement: form.requirement,
      budget: form.budget,
      timeline: form.timeline,
      notes: form.notes,
      status: 'pending'
    };

    const { data: inserted, error: insertError } = await supabase
      .from('client_requests')
      .insert([payload])
      .select()
      .single();

    if (insertError) {
      console.error('Insert failed:', insertError);
      alert('Submission failed. Please try again.');
      return;
    }

    const { data: freelancers = [], error: fetchError } = await supabase
      .from('ai_freelancers')
      .select('*');

    if (fetchError) {
      console.error('Fetch freelancers error:', fetchError);
    }

    const match = matchFreelancerToClient(payload, freelancers);
    if (match) {
      await supabase
        .from('client_requests')
        .update({ status: 'matched', assigned_freelancer_id: match.id })
        .eq('id', inserted.id);
    }

    router.push('/client-request/thank-you');
  };

  return (
    <main className="min-h-screen bg-[#241C15] text-white">
      <header className="py-4 text-center text-lg font-bold">Client Project Request</header>
      <div className="max-w-3xl mx-auto p-6 pb-24">
        <div className="mb-6">
          <div className="h-2 w-full bg-gray-700 rounded-full">
            <div className="h-full bg-[#FFE01B] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-sm text-right mt-1">{progress}% completed</div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 bg-[#241C15] rounded-xl shadow p-8">
          <input type="text" name="fullName" required placeholder="Full Name*" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
          <input type="email" name="email" required placeholder="Email*" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
          <input type="text" name="phone" required placeholder="WhatsApp Number*" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
          <input type="text" name="company" placeholder="Company Name (optional)" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-black" />

          <div>
            <label className="block mb-2">Preferred Services*</label>
            <div className="flex flex-wrap gap-2">
              {serviceOptions.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleService(option)}
                  className={`border border-white px-4 py-1 rounded-full text-sm transition-colors duration-200 ${
                    form.services.includes(option)
                      ? 'bg-yellow-400 text-black'
                      : 'text-white hover:bg-yellow-400 hover:text-white'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <textarea name="requirement" required placeholder="Project Requirement*" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-black" rows={4} />
          <input type="text" name="budget" placeholder="Budget (optional)" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
          <input type="text" name="timeline" placeholder="Timeline (optional)" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-black" />
          <textarea name="notes" placeholder="Additional Notes (optional)" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-black" rows={3} />

          <div className="flex justify-end">
            <button type="submit" className="bg-[#FFE01B] text-black px-6 py-2 rounded hover:bg-yellow-300">Submit</button>
          </div>
        </form>
      </div>
    </main>
  );
}
