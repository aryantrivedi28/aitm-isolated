'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import AdminCaseStudyTable from './components/AdminCaseStudyTable'
import FilterShareLink from './components/FilterShareLink'

export default function AdminFreelancerCaseStudies() {

  const [caseStudies, setCaseStudies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [filter, setFilter] = useState('all')

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  })



  /* ---------------- FETCH ---------------- */

  const fetchCaseStudies = async () => {

    setLoading(true)

    try {

      const res =
        await fetch(
          `/api/admin/case-studies?status=${filter}&page=${pagination.page}&limit=${pagination.limit}`,
          { credentials: "include" }
        )

      const json = await res.json()

      setCaseStudies(json.data || [])

      setPagination(json.pagination)

    }
    catch (err) {

      console.error("Fetch error:", err)

    }

    setLoading(false)

  }



  useEffect(() => {

    fetchCaseStudies()

  }, [filter, pagination.page])



  /* ---------------- STATUS UPDATE ---------------- */

  const handleStatusUpdate = async (
    id: string,
    status: string
  ) => {

    await fetch(
      `/api/admin/case-studies/${id}`,
      {
        method: "PATCH",

        credentials: "include",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          status,
          is_verified:
            status === "approved"

        })
      }
    )

    fetchCaseStudies()

  }



  /* ---------------- FEATURE ---------------- */

  const handleFeatureToggle = async (
    id: string,
    isFeatured: boolean
  ) => {

    await fetch(
      `/api/admin/case-studies/${id}`,
      {
        method: "PATCH",

        credentials: "include",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          is_featured:
            !isFeatured

        })
      }
    )

    fetchCaseStudies()

  }



  /* ---------------- DELETE ---------------- */

  const handleDelete = async (
    id: string
  ) => {

    await fetch(
      `/api/admin/case-studies/${id}`,
      {
        method: "DELETE",
        credentials: "include"
      }
    )

    fetchCaseStudies()

  }



  /* ---------------- STATS ---------------- */

  const stats = {

    total:
      pagination.total,

    approved:
      caseStudies.filter(
        c => c.status === "approved"
      ).length,

    pending:
      caseStudies.filter(
        c => c.status === "pending"
      ).length,

    draft:
      caseStudies.filter(
        c => c.status === "draft"
      ).length,

    rejected:
      caseStudies.filter(
        c => c.status === "rejected"
      ).length
  }



  return (

    <div className="container mx-auto px-4 py-8">


      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-2xl font-bold">
            Freelancer Case Studies
          </h1>

          <p className="text-gray-600 mt-1">
            Review and approve freelancer case studies
          </p>

        </div>


        <div className="flex gap-3">

          <FilterShareLink />


          <Link
            href="/admin-panel/freelancer-case-studies/new/edit"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4"/>
            New Case Study
          </Link>


        </div>

      </div>



      {/* STATS */}

      <div className="grid grid-cols-5 gap-4 mb-8">

        <StatCard label="Total" value={stats.total}/>
        <StatCard label="Approved" value={stats.approved}/>
        <StatCard label="Pending" value={stats.pending}/>
        <StatCard label="Draft" value={stats.draft}/>
        <StatCard label="Rejected" value={stats.rejected}/>

      </div>



      {/* FILTER */}

      <div className="flex gap-2 mb-6 border-b">

        {[
          "all",
          "pending",
          "approved",
          "rejected",
          "draft"

        ].map(tab => (

          <button

            key={tab}

            onClick={() => {

              setFilter(tab)

              setPagination({
                ...pagination,
                page: 1
              })

            }}

            className={`px-4 py-2 text-sm font-medium

            ${
              filter === tab
              ? "text-blue-600"
              : "text-gray-600"
            }`}

          >

            {tab.toUpperCase()}

          </button>

        ))}

      </div>



      {/* TABLE */}

      <AdminCaseStudyTable

        caseStudies={caseStudies}

        loading={loading}

        onStatusUpdate={handleStatusUpdate}

        onFeatureToggle={handleFeatureToggle}

        onDelete={handleDelete}

      />



      {/* PAGINATION */}

      <div className="flex justify-center gap-4 mt-8">

        <button

          disabled={pagination.page === 1}

          onClick={() =>
            setPagination({
              ...pagination,
              page: pagination.page - 1
            })
          }

          className="px-4 py-2 border rounded"

        >
          Prev
        </button>



        <span>

          Page {pagination.page}
          /
          {pagination.totalPages}

        </span>



        <button

          disabled={
            pagination.page
            ===
            pagination.totalPages
          }

          onClick={() =>
            setPagination({
              ...pagination,
              page: pagination.page + 1
            })
          }

          className="px-4 py-2 border rounded"

        >
          Next
        </button>


      </div>



    </div>

  )

}



/* ---------------- STAT CARD ---------------- */


function StatCard(
  {
    label,
    value
  }:
  {
    label:string,
    value:number
  }
){

  return(

    <div className="bg-white rounded-xl shadow-sm p-4">

      <div className="text-2xl font-bold">

        {value}

      </div>

      <div className="text-sm text-gray-600">

        {label}

      </div>

    </div>

  )

}