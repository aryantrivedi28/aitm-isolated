"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ClientFormPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [clientDetails, setClientDetails] = useState({
    name: "",
    company_name: "",
    website: "",
    industry: "",
    phone: "",
  });
  const [hiringDetails, setHiringDetails] = useState({
    role_type: "Full-Time", // will be auto-filled from URL
    job_title: "",
    description: "",
    budget_range: "",
    category: "",
    subcategory: "",
    tools: [] as string[],
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const roleTypeFromUrl = searchParams.get("role"); // freelancer | intern | fulltime

  // ✅ Always set role_type from URL once
  useEffect(() => {
    if (roleTypeFromUrl) {
      setHiringDetails((prev) => ({ ...prev, role_type: roleTypeFromUrl }));
    }
  }, [roleTypeFromUrl]);

  // ✅ Skip client step if already exists (check Supabase user)
// ✅ Skip client step if already exists (check via cookie)
useEffect(() => {
  async function fetchClient() {
    try {
      const res = await fetch("/api/client/me", { credentials: "include" });
      const data = await res.json();

      console.log("Fetched client data:", data);

      if (data?.exists) {
        setStep(2);
      }
    } catch (err) {
      console.error("Error fetching client:", err);
    }
  }
  fetchClient();
}, []);


  // ✅ Step 1 submit
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
      } else {
        console.error("Failed to save client:", data.error);
      }
    } catch (err) {
      console.error("Client submit error:", err);
    }
  };

  // ✅ Step 2 submit
  const handleHiringSubmit = async () => {
    try {
      const client_id = localStorage.getItem("client_id");
      if (!client_id) {
        alert("Client ID missing, please complete Step 1.");
        return;
      }

      const payload = { ...hiringDetails, client_id };
      console.log("📤 Submitting hiring request:", payload);

      const res = await fetch("/api/client/hiring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/find-talent/thank-you");
      } else {
        console.error("Hiring request failed:", data.error);
      }
    } catch (err) {
      console.error("Hiring submit error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#241C15] text-white">
      <div className="bg-white text-black rounded-2xl shadow-xl p-8 w-[500px]">
        {/* ✅ Step 1: Client details */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold mb-4">Step 1: Client Details</h2>
            <input
              className="border p-2 w-full mb-3"
              placeholder="Name"
              value={clientDetails.name}
              onChange={(e) =>
                setClientDetails({ ...clientDetails, name: e.target.value })
              }
            />
            <input
              className="border p-2 w-full mb-3"
              placeholder="Company Name"
              value={clientDetails.company_name}
              onChange={(e) =>
                setClientDetails({
                  ...clientDetails,
                  company_name: e.target.value,
                })
              }
            />
            <input
              className="border p-2 w-full mb-3"
              placeholder="Website"
              value={clientDetails.website}
              onChange={(e) =>
                setClientDetails({
                  ...clientDetails,
                  website: e.target.value,
                })
              }
            />
            <input
              className="border p-2 w-full mb-3"
              placeholder="Industry"
              value={clientDetails.industry}
              onChange={(e) =>
                setClientDetails({
                  ...clientDetails,
                  industry: e.target.value,
                })
              }
            />
            <input
              className="border p-2 w-full mb-3"
              placeholder="Phone"
              value={clientDetails.phone}
              onChange={(e) =>
                setClientDetails({ ...clientDetails, phone: e.target.value })
              }
            />
            <button
              onClick={handleClientSubmit}
              className="bg-[#FFE01B] hover:bg-yellow-300 px-4 py-2 rounded w-full font-bold"
            >
              Next → Hiring Details
            </button>
          </>
        )}

        {/* ✅ Step 2: Hiring details */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-bold mb-4">Step 2: Hiring Request</h2>

            {/* role_type locked from URL */}
            <div className="mb-3 p-2 border rounded bg-gray-100">
              Role Type: <b>{hiringDetails.role_type}</b>
            </div>

            <input
              className="border p-2 w-full mb-3"
              placeholder="Job Title"
              value={hiringDetails.job_title}
              onChange={(e) =>
                setHiringDetails({
                  ...hiringDetails,
                  job_title: e.target.value,
                })
              }
            />
            <textarea
              className="border p-2 w-full mb-3"
              placeholder="Job Description"
              value={hiringDetails.description}
              onChange={(e) =>
                setHiringDetails({
                  ...hiringDetails,
                  description: e.target.value,
                })
              }
            />
            <input
              className="border p-2 w-full mb-3"
              placeholder="Budget Range"
              value={hiringDetails.budget_range}
              onChange={(e) =>
                setHiringDetails({
                  ...hiringDetails,
                  budget_range: e.target.value,
                })
              }
            />
            <input
              className="border p-2 w-full mb-3"
              placeholder="Category (optional)"
              value={hiringDetails.category}
              onChange={(e) =>
                setHiringDetails({
                  ...hiringDetails,
                  category: e.target.value,
                })
              }
            />
            <input
              className="border p-2 w-full mb-3"
              placeholder="Subcategory (optional)"
              value={hiringDetails.subcategory}
              onChange={(e) =>
                setHiringDetails({
                  ...hiringDetails,
                  subcategory: e.target.value,
                })
              }
            />
            <input
              className="border p-2 w-full mb-3"
              placeholder="Tools (comma separated, optional)"
              onChange={(e) =>
                setHiringDetails({
                  ...hiringDetails,
                  tools: e.target.value.split(","),
                })
              }
            />
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
