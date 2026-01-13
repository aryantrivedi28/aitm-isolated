'use client'

import { useState } from 'react'
import { AlertTriangle, ArrowRight, Loader2 } from 'lucide-react'

/* -------------------- Types -------------------- */

interface AdditionalField {
  fieldType: 'select' | 'checkbox' | 'radio' | 'text' | 'textarea'
  label: string
  name: string
  required?: boolean
  options?: string[]
  placeholder?: string
}

interface FormConfig {
  _id: string
  name: string
  title?: string
  description?: string
  type: 'ghl' | 'shopify' | 'general'
  additionalFields?: AdditionalField[]
}

interface FormFieldsProps {
  formConfig: FormConfig
  onSubmit: (data: Record<string, any>) => void
  isSubmitting: boolean
  submitStatus: 'success' | 'error' | null
  submitMessage: string
}

/* -------------------- Component -------------------- */

export default function FormFields({
  formConfig,
  onSubmit,
  isSubmitting,
  submitStatus,
  submitMessage,
}: FormFieldsProps) {
  const [formData, setFormData] = useState<Record<string, any>>({
    name: '',
    email: '',
    phone: '',
    business: '',
    website: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  /* -------------------- Common Fields -------------------- */

  const commonFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', type: 'tel', required: true },
    { name: 'business', label: 'Your Business Name', type: 'text' },
    { name: 'website', label: 'Web URL', type: 'url' },
  ]

  /* -------------------- Helpers -------------------- */

  const updateField = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    // Validate common fields
    for (const field of commonFields) {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`
      }
    }

    // Validate dynamic fields
    formConfig.additionalFields?.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`
      }
    })

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData)
    }
  }

  /* -------------------- Field Renderer -------------------- */

  const renderField = (field: any) => {
    const name = field.name
    const label = field.label
    const value = formData[name]
    const error = errors[name]

    const baseClass =
      'w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 focus:border-[#f7af00] focus:ring-2 focus:ring-[#f7af00]'

    switch (field.fieldType || field.type) {
      case 'select':
        return (
          <>
            <label className="block mb-2 text-sm font-medium">{label}</label>
            <select
              value={value || ''}
              onChange={e => updateField(name, e.target.value)}
              className={baseClass}
            >
              <option value="">Select an option</option>
              {field.options?.map((opt: string) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </>
        )

      case 'radio':
        return (
          <>
            <label className="block mb-2 text-sm font-medium">{label}</label>
            <div className="space-y-2">
              {field.options?.map((opt: string) => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={value === opt}
                    onChange={() => updateField(name, opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </>
        )

      case 'checkbox':
        return (
          <>
            <label className="block mb-2 text-sm font-medium">{label}</label>
            <div className="space-y-2">
              {field.options?.map((opt: string) => {
                const arr = Array.isArray(value) ? value : []
                return (
                  <label key={opt} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={arr.includes(opt)}
                      onChange={() =>
                        updateField(
                          name,
                          arr.includes(opt)
                            ? arr.filter((v: string) => v !== opt)
                            : [...arr, opt]
                        )
                      }
                    />
                    {opt}
                  </label>
                )
              })}
            </div>
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </>
        )

      case 'textarea':
        return (
          <>
            <label className="block mb-2 text-sm font-medium">{label}</label>
            <textarea
              value={value || ''}
              onChange={e => updateField(name, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className={baseClass}
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </>
        )

      default:
        return (
          <>
            <label className="block mb-2 text-sm font-medium">{label}</label>
            <input
              type={field.type || 'text'}
              value={value || ''}
              onChange={e => updateField(name, e.target.value)}
              placeholder={field.placeholder}
              className={baseClass}
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </>
        )
    }
  }

  /* -------------------- JSX -------------------- */

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Common Fields */}
      {commonFields.map(field => (
        <div key={`common-${field.name}`}>
          {renderField(field)}
        </div>
      ))}

      {/* Dynamic Fields */}
      {formConfig.additionalFields?.map(field => (
        <div key={`dynamic-${field.name}`}>
          {renderField(field)}
        </div>
      ))}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-[#f7af00] text-[#050504] font-bold rounded-lg hover:bg-[#e09e00] disabled:opacity-70"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <ArrowRight className="w-5 h-5" />
            Submit Now
          </span>
        )}
      </button>
    </form>
  )
}
