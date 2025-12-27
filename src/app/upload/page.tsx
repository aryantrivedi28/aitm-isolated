'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, User, Briefcase, Wrench, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react'

interface ProcessingStep {
  step: number
  title: string
  description: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
}

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [tempId, setTempId] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  const [metadata, setMetadata] = useState({
    projectTitle: '',
    role: '',
    serviceType: '',
    toolsUsed: '',
    shortDescription: ''
  })

  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { step: 1, title: 'Upload PDF', description: 'Upload your portfolio PDF', status: 'pending' },
    { step: 2, title: 'Extract Text', description: 'AI extracts text and structure', status: 'pending' },
    { step: 3, title: 'Structure Content', description: 'Organize into case study format', status: 'pending' },
    { step: 4, title: 'Save to Database', description: 'Store structured data', status: 'pending' },
  ])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file)
      setError(null)
    } else {
      setError('Please select a PDF file')
    }
  }

  const updateStepStatus = (stepIndex: number, status: ProcessingStep['status']) => {
    setProcessingSteps(prev => prev.map((step, idx) => 
      idx === stepIndex ? { ...step, status } : step
    ))
  }

  const handleUpload = async () => {
    if (!uploadedFile) {
      setError('Please select a PDF file first')
      return
    }

    setIsUploading(true)
    setError(null)
    updateStepStatus(0, 'processing')

    const formData = new FormData()
    formData.append('pdf', uploadedFile)
    formData.append('projectTitle', metadata.projectTitle)
    formData.append('role', metadata.role)
    formData.append('serviceType', metadata.serviceType)
    formData.append('toolsUsed', metadata.toolsUsed)
    formData.append('shortDescription', metadata.shortDescription)

    try {
      const response = await fetch('/api/case-study/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      updateStepStatus(0, 'completed')
      setTempId(data.tempId)
      
      // Automatically start processing
      await handleProcess(data.tempId)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      updateStepStatus(0, 'failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleProcess = async (tempIdToProcess: string) => {
    setIsProcessing(true)
    setError(null)
    
    // Update steps 2-4 to processing
    updateStepStatus(1, 'processing')
    updateStepStatus(2, 'processing')
    updateStepStatus(3, 'processing')

    try {
      const response = await fetch('/api/case-study/process-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempId: tempIdToProcess }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Processing failed')
      }

      // Update all steps to completed
      updateStepStatus(1, 'completed')
      updateStepStatus(2, 'completed')
      updateStepStatus(3, 'completed')
      
      setResult(data.portfolio)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed')
      updateStepStatus(1, 'failed')
      updateStepStatus(2, 'failed')
      updateStepStatus(3, 'failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const resetForm = () => {
    setUploadedFile(null)
    setTempId(null)
    setResult(null)
    setError(null)
    setMetadata({
      projectTitle: '',
      role: '',
      serviceType: '',
      toolsUsed: '',
      shortDescription: ''
    })
    setProcessingSteps(steps => steps.map(step => ({ ...step, status: 'pending' })))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-[#faf4e5] p-4 md:p-8">
      <div className="max-w-6xl mx-auto pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#050504] mb-2">
            PDF Portfolio Processor
          </h1>
          <p className="text-[#31302f] text-lg">
            Upload your PDF portfolio and let AI extract and structure it automatically
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Upload Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              {/* <h2 className="text-2xl font-bold text-[#050504] mb-6">
                Step A1: Upload PDF & Metadata
              </h2> */}

              {/* File Upload Area */}
              <div className="mb-8">
                <label className="block text-[#31302f] font-medium mb-3">
                  PDF Portfolio File
                </label>
                <div 
                  className="border-3 border-dashed border-[#f0eadd] rounded-xl p-8 text-center cursor-pointer hover:bg-[#faf4e5] transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload className="w-12 h-12 mx-auto text-[#f7af00] mb-4" />
                  <div className="text-[#31302f]">
                    <span className="font-semibold text-[#f7af00]">Click to upload</span> or drag and drop
                    <p className="text-sm text-[#31302f]/70 mt-2">PDF files only, max 10MB</p>
                  </div>
                  {uploadedFile && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-[#f0eadd] px-4 py-2 rounded-lg">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm font-medium">{uploadedFile.name}</span>
                      <span className="text-xs text-[#31302f]/70">
                        ({(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata Form */}
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-[#31302f] font-medium mb-2">
                    <FileText className="w-4 h-4" />
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={metadata.projectTitle}
                    onChange={(e) => setMetadata({...metadata, projectTitle: e.target.value})}
                    className="w-full p-3 border border-[#f0eadd] rounded-lg focus:ring-2 focus:ring-[#f7af00] focus:border-transparent bg-white"
                    placeholder="e.g., E-commerce Website Redesign"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-[#31302f] font-medium mb-2">
                      <User className="w-4 h-4" />
                      Your Role
                    </label>
                    <input
                      type="text"
                      value={metadata.role}
                      onChange={(e) => setMetadata({...metadata, role: e.target.value})}
                      className="w-full p-3 border border-[#f0eadd] rounded-lg bg-white"
                      placeholder="e.g., Lead UI/UX Designer"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[#31302f] font-medium mb-2">
                      <Briefcase className="w-4 h-4" />
                      Service Type
                    </label>
                    <input
                      type="text"
                      value={metadata.serviceType}
                      onChange={(e) => setMetadata({...metadata, serviceType: e.target.value})}
                      className="w-full p-3 border border-[#f0eadd] rounded-lg bg-white"
                      placeholder="e.g., UI/UX Design & Development"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[#31302f] font-medium mb-2">
                    <Wrench className="w-4 h-4" />
                    Tools Used (comma separated)
                  </label>
                  <input
                    type="text"
                    value={metadata.toolsUsed}
                    onChange={(e) => setMetadata({...metadata, toolsUsed: e.target.value})}
                    className="w-full p-3 border border-[#f0eadd] rounded-lg bg-white"
                    placeholder="e.g., Figma, React, Tailwind CSS, Node.js"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[#31302f] font-medium mb-2">
                    <MessageSquare className="w-4 h-4" />
                    Short Description
                  </label>
                  <textarea
                    value={metadata.shortDescription}
                    onChange={(e) => setMetadata({...metadata, shortDescription: e.target.value})}
                    className="w-full p-3 border border-[#f0eadd] rounded-lg h-32 bg-white"
                    placeholder="Brief overview of the project, goals, and outcomes..."
                  />
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">Error</p>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleUpload}
                  disabled={isUploading || !uploadedFile || isProcessing}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    isUploading || !uploadedFile || isProcessing
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-[#f7af00] hover:bg-[#e09e00] text-white'
                  }`}
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload & Process PDF'
                  )}
                </button>
                
                {(result || error) && (
                  <button
                    onClick={resetForm}
                    className="py-3 px-6 border-2 border-[#f0eadd] text-[#31302f] rounded-lg font-semibold hover:bg-[#f0eadd] transition-colors"
                  >
                    Start New Upload
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Processing Steps */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 sticky top-8">
              <h3 className="text-xl font-bold text-[#050504] mb-6">
                Processing Steps
              </h3>
              
              <div className="space-y-6">
                {processingSteps.map((step, index) => (
                  <div key={step.step} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                      ${step.status === 'completed' ? 'bg-green-100 text-green-600' :
                        step.status === 'processing' ? 'bg-[#f7af00]/20 text-[#f7af00] animate-pulse' :
                        step.status === 'failed' ? 'bg-red-100 text-red-600' :
                        'bg-[#f0eadd] text-[#31302f]/50'}`}
                    >
                      {step.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="font-bold">{step.step}</span>
                      )}
                    </div>
                    
                    <div>
                      <h4 className={`font-medium ${
                        step.status === 'completed' ? 'text-green-700' :
                        step.status === 'processing' ? 'text-[#f7af00]' :
                        step.status === 'failed' ? 'text-red-700' :
                        'text-[#31302f]'
                      }`}>
                        {step.title}
                      </h4>
                      <p className="text-sm text-[#31302f]/70 mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Result Display */}
              {result && (
                <div className="mt-8 pt-6 border-t border-[#f0eadd]">
                  <h4 className="font-bold text-[#050504] mb-4">Processing Complete!</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-[#31302f]/70">Project Title</p>
                      <p className="font-medium text-[#050504]">{result.projectTitle}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-[#31302f]/70">Summary</p>
                      <p className="italic text-[#31302f]">{result.summary}</p>
                    </div>
                    
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 text-sm font-medium">
                        ✓ Data saved to Supabase database
                      </p>
                      <p className="text-green-600 text-xs mt-1">
                        Record ID: {result.id}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Result Details */}
        {result && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-2xl font-bold text-[#050504] mb-6">
              Extracted & Structured Data
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-[#050504] mb-2 text-lg">Challenge</h4>
                  <p className="text-[#31302f] bg-[#faf4e5] p-4 rounded-lg">{result.challenge}</p>
                </div>
                
                <div>
                  <h4 className="font-bold text-[#050504] mb-2 text-lg">Solution</h4>
                  <p className="text-[#31302f] bg-[#faf4e5] p-4 rounded-lg">{result.solution}</p>
                </div>
                
                <div>
                  <h4 className="font-bold text-[#050504] mb-2 text-lg">Process</h4>
                  <p className="text-[#31302f] bg-[#faf4e5] p-4 rounded-lg">{result.process}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-[#050504] mb-2 text-lg">Deliverables</h4>
                  <p className="text-[#31302f] bg-[#faf4e5] p-4 rounded-lg whitespace-pre-line">{result.deliverables}</p>
                </div>
                
                <div>
                  <h4 className="font-bold text-[#050504] mb-2 text-lg">Results</h4>
                  <p className="text-[#31302f] bg-[#faf4e5] p-4 rounded-lg">{result.results}</p>
                </div>
                
                <div className="p-4 bg-[#f0eadd] rounded-lg">
                  <h4 className="font-bold text-[#050504] mb-2">Database Status</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#31302f]">Record ID:</span>
                    <code className="text-xs bg-white px-2 py-1 rounded">{result.id}</code>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-[#31302f]">Status:</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      {result.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}