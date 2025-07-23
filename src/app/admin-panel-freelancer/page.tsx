'use client';

import { useState } from 'react';
// import supabase from '@/lib/supabaseClient';

type Freelancer = {
  id: string;
  name: string;
  skills: string[];
  tags: string[];
  experience_years: number;
  rate: number;
  whatsapp: string;
  status: string;
  [key: string]: any;
};

export default function AdminQueryPanel() {
  const [prompt, setPrompt] = useState('');
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(false);

//   const parsePrompt = (text: string) => {
//     const lower = text.toLowerCase();
//     const skillsList = ["java", "seo", "react", "next.js", "node.js", "python", "django", "typescript", "mongodb", "express", "sql", "wordpress", "figma", "illustrator", "adobe", "tailwind"];
//     const skills = skillsList.filter(skill => lower.includes(skill));
//     const expMatch = lower.match(/(\d+)\+?\s*years?/);
//     const minExperience = expMatch ? parseInt(expMatch[1]) : 0;
//     return { skills, minExperience };
//   };

  const handleSearch = async () => {
//     setLoading(true);
//     const { skills, minExperience } = parsePrompt(prompt);
//     const { data, error } = await supabase
//       .from('freelancers')
//       .select('*')
//       .contains('skills', skills.length > 0 ? skills : [''])
//       .gte('experience_years', minExperience)
//       .limit(30);

//     if (error) console.error(error);
//     else setFreelancers(data as Freelancer[]);
//     setLoading(false);
  };

  const downloadCSV = () => {
//     if (freelancers.length === 0) return alert('No data to download.');
//     const headers = Object.keys(freelancers[0]);
//     const rows = [headers.join(',')];
//     freelancers.forEach(f => {
//       const row = headers.map(h => Array.isArray(f[h]) ? `"${f[h].join(', ')}"` : `"${f[h] ?? ''}"`);
//       rows.push(row.join(','));
//     });
//     const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'freelancers.csv';
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Freelancer Search</h1>
      <textarea
        className="w-full border rounded p-2 mb-2"
        rows={3}
        placeholder="Type your prompt here (e.g., Looking for Java, SEO, 2+ years experience)"
      //   value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Searching...' : 'Search Freelancers'}
      </button>
      {freelancers.length > 0 && (
        <>
          <button
            onClick={downloadCSV}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4"
          >
            Download CSV
          </button>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border text-sm">
              <thead>
                <tr>
                  {Object.keys(freelancers[0]).map((header) => (
                    <th key={header} className="border px-2 py-1 text-left bg-gray-100">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {freelancers.map((freelancer, idx) => (
                  <tr key={idx}>
                    {Object.values(freelancer).map((val, i) => (
                      <td key={i} className="border px-2 py-1">
                        {Array.isArray(val) ? val.join(', ') : String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
