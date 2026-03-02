'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Star,
  MoreVertical
} from 'lucide-react'

import { CaseStudy } from '../../../../types/freelancer2'

interface Props {
  caseStudies: CaseStudy[]
  loading: boolean
  onStatusUpdate: (id: string, status: string) => Promise<void>
  onFeatureToggle: (id: string, isFeatured: boolean) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function AdminCaseStudyTable({
  caseStudies,
  loading,
  onStatusUpdate,
  onFeatureToggle,
  onDelete
}: Props) {

  const [openMenuId, setOpenMenuId] =
    useState<string | null>(null)



  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }



  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-50 border-b">

            <tr>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Case Study
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Freelancer
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Featured
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Views
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Created
              </th>

              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>

            </tr>

          </thead>



          <tbody className="divide-y divide-gray-200">

            {caseStudies.map((study) => {

              // ✅ Safe image fallback
              const imageSrc =
                study.image_url && study.image_url.trim() !== ""
                  ? study.image_url
                  : "/placeholder.png"



              return (

                <tr
                  key={study.id}
                  className="hover:bg-gray-50"
                >

                  {/* Case Study */}

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-3">

                      <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">

                        <Image
                          src={imageSrc}
                          alt={study.title || "Case Study"}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />

                      </div>


                      <div>

                        <div className="font-medium text-gray-900">
                          {study.title}
                        </div>

                        <div className="text-sm text-gray-500">
                          {study.slug}
                        </div>

                      </div>

                    </div>

                  </td>



                  {/* Freelancer */}

                  <td className="px-6 py-4">

                    <div className="text-sm">

                      <div className="font-medium text-gray-900">
                        {study.freelancer?.name || "Unknown"}
                      </div>

                      <div className="text-gray-500">
                        {study.freelancer?.title || "-"}
                      </div>

                    </div>

                  </td>



                  {/* Category */}

                  <td className="px-6 py-4 text-sm">

                    <div>{study.category}</div>

                    <div className="text-gray-500">
                      {study.industry}
                    </div>

                  </td>



                  {/* Status */}

                  <td className="px-6 py-4">

                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full font-medium

                        ${study.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : ''}

                        ${study.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : ''}

                        ${study.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : ''}

                        ${study.status === 'draft'
                          ? 'bg-gray-100 text-gray-800'
                          : ''}
                      `}
                    >

                      {study.status}

                    </span>

                  </td>



                  {/* Featured */}

                  <td className="px-6 py-4">

                    <button
                      onClick={() =>
                        onFeatureToggle(
                          study.id,
                          study.is_featured
                        )
                      }
                      className="p-1"
                    >

                      <Star
                        className={`h-5 w-5

                          ${study.is_featured
                            ? "text-yellow-500"
                            : "text-gray-400"}
                        `}
                        fill={
                          study.is_featured
                            ? "currentColor"
                            : "none"
                        }
                      />

                    </button>

                  </td>



                  {/* Views */}

                  <td className="px-6 py-4 text-sm text-gray-500">

                    {study.view_count || 0}

                  </td>



                  {/* Created */}

                  <td className="px-6 py-4 text-sm text-gray-500">

                    {new Date(
                      study.created_at
                    ).toLocaleDateString()}

                  </td>



                  {/* Actions */}

                  <td className="px-6 py-4 text-right relative">

                    <button
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === study.id
                            ? null
                            : study.id
                        )
                      }
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >

                      <MoreVertical className="h-5 w-5 text-gray-500" />

                    </button>



                    {openMenuId === study.id && (

                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">

                        <Link
                          href={`/freelancer-case-studies/${study.slug}`}
                          target="_blank"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                        >

                          <Eye className="h-4 w-4" />
                          View

                        </Link>



                        <Link
                          href={`/admin-panel/freelancer-case-studies/${study.id}/edit`}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                        >

                          <Edit className="h-4 w-4" />
                          Edit

                        </Link>



                        {study.status === "pending" && (

                          <>

                            <button
                              onClick={() =>
                                onStatusUpdate(
                                  study.id,
                                  "approved"
                                )
                              }
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                            >

                              <CheckCircle className="h-4 w-4" />
                              Approve

                            </button>


                            <button
                              onClick={() =>
                                onStatusUpdate(
                                  study.id,
                                  "rejected"
                                )
                              }
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >

                              <XCircle className="h-4 w-4" />
                              Reject

                            </button>

                          </>

                        )}



                        <button
                          onClick={() => {

                            if (
                              confirm(
                                "Delete this case study?"
                              )
                            ) {

                              onDelete(
                                study.id
                              )

                            }

                            setOpenMenuId(null)

                          }}

                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t"
                        >

                          <Trash2 className="h-4 w-4" />
                          Delete

                        </button>

                      </div>

                    )}

                  </td>

                </tr>

              )

            })}

          </tbody>

        </table>

      </div>



      {caseStudies.length === 0 && (

        <div className="text-center py-12 text-gray-500">

          No case studies found

        </div>

      )}

    </div>

  )

}