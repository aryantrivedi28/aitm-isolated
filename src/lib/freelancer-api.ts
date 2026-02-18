// lib/freelancer-api.ts

interface ApiResponse<T = any> {
  success?: boolean
  error?: string
  profile?: T
  message?: string
  imageUrl?: string
  imagePath?: string
  case_studies?: any[]
  work_experience?: any[]
  testimonials?: any[]
  [key: string]: any
}

export const freelancerApi = {
  // Get complete profile
  async getProfile(): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      credentials: 'include'
    })
    return response.json()
  },

  // Update basic profile info
  async updateProfile(updates: any): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'update_profile', data: updates }),
    })
    return response.json()
  },

  // Work Experience methods
  async addWorkExperience(experience: any): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'add_work_experience', data: experience }),
    })
    return response.json()
  },

  async updateWorkExperience(id: string, experience: any): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'update_work_experience', data: { id, ...experience } }),
    })
    return response.json()
  },

  async deleteWorkExperience(id: string): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'delete_work_experience', data: { id } }),
    })
    return response.json()
  },

  // Testimonials methods
  async addTestimonial(testimonial: any): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'add_testimonial', data: testimonial }),
    })
    return response.json()
  },

  async updateTestimonial(id: string, testimonial: any): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'update_testimonial', data: { id, ...testimonial } }),
    })
    return response.json()
  },

  async deleteTestimonial(id: string): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'delete_testimonial', data: { id } }),
    })
    return response.json()
  },

  // Case Studies methods
  async addCaseStudy(caseStudy: any): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'add_case_study', data: caseStudy }),
    })
    return response.json()
  },

  async updateCaseStudy(id: string, caseStudy: any): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'update_case_study', data: { id, ...caseStudy } }),
    })
    return response.json()
  },

  async deleteCaseStudy(id: string): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'delete_case_study', data: { id } }),
    })
    return response.json()
  },

  // Skills methods
  async addSkill(skill: string): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'add_skill', data: { skill } }),
    })
    return response.json()
  },

  async removeSkill(skill: string): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'remove_skill', data: { skill } }),
    })
    return response.json()
  },

  // Tools methods
  async addTool(tool: string): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'add_tool', data: { tool } }),
    })
    return response.json()
  },

  async removeTool(tool: string): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'remove_tool', data: { tool } }),
    })
    return response.json()
  },

  // Languages methods
  async addLanguage(language: string): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'add_language', data: { language } }),
    })
    return response.json()
  },

  async removeLanguage(language: string): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'remove_language', data: { language } }),
    })
    return response.json()
  },

  // Certifications methods
  async addCertification(certification: string): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'add_certification', data: { certification } }),
    })
    return response.json()
  },

  async removeCertification(certification: string): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'remove_certification', data: { certification } }),
    })
    return response.json()
  },

  // Education methods
  async addEducation(education: any): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'add_education', data: education }),
    })
    return response.json()
  },

  async updateEducation(id: string, education: any): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'update_education', data: { id, ...education } }),
    })
    return response.json()
  },

  async deleteEducation(id: string): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'delete_education', data: { id } }),
    })
    return response.json()
  },

  // Image Upload methods for Case Studies
  async uploadCaseStudyImage(itemId: string, file: File): Promise<ApiResponse> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('itemId', itemId)

    const response = await fetch('/api/freelancer/profile/image', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
    return response.json()
  },

  async deleteCaseStudyImage(imagePath: string, itemId: string): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile/image', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ imagePath, itemId }),
    })
    return response.json()
  },

  // Profile Photo Upload methods
  async uploadProfilePhoto(file: File): Promise<ApiResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/freelancer/profile/photo', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
    return response.json()
  },

  async deleteProfilePhoto(): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile/photo', {
      method: 'DELETE',
      credentials: 'include',
    })
    return response.json()
  },

  // Resume Upload methods
  async uploadResume(file: File): Promise<ApiResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/freelancer/profile/resume', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
    return response.json()
  },

  async deleteResume(): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile/resume', {
      method: 'DELETE',
      credentials: 'include',
    })
    return response.json()
  },

  // Portfolio Links methods
  async addPortfolioLink(link: string): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'add_portfolio_link', data: { link } }),
    })
    return response.json()
  },

  async removePortfolioLink(link: string): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'remove_portfolio_link', data: { link } }),
    })
    return response.json()
  },

  // Projects methods
  async addProject(project: any): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'add_project', data: project }),
    })
    return response.json()
  },

  async updateProject(id: string, project: any): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'update_project', data: { id, ...project } }),
    })
    return response.json()
  },

  async deleteProject(id: string): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'delete_project', data: { id } }),
    })
    return response.json()
  },

  // Submit for review
  async submitForReview(): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'submit_for_review' }),
    })
    return response.json()
  },

  // Get review status
  async getReviewStatus(): Promise<ApiResponse> {
    const response = await this.getProfile()
    if (response.profile) {
      return {
        status: response.profile.review_status,
        verified: response.profile.verified,
        rating: response.profile.profile_rating,
        submitted_at: response.profile.submitted_at,
        verified_at: response.profile.verified_at,
        admin_notes: response.profile.admin_notes
      }
    }
    return response
  },

  // Delete account (with caution)
  async deleteAccount(): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'delete_account' }),
    })
    return response.json()
  },

  // Bulk update multiple sections at once
  async bulkUpdate(updates: Record<string, any>): Promise<ApiResponse> {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'bulk_update', data: updates }),
    })
    return response.json()
  },

  // Check if profile is complete
  async checkProfileCompleteness(): Promise<ApiResponse> {
    const response = await this.getProfile()
    if (!response.profile) return { success: false, error: 'No profile found' }

    const profile = response.profile
    const completeness = {
      basicInfo: !!(profile.name && profile.title && profile.bio),
      skills: (profile.skills?.length || 0) > 0,
      experience: (profile.work_experience?.length || 0) > 0,
      caseStudies: (profile.case_studies?.length || 0) > 0,
      testimonials: (profile.testimonials?.length || 0) > 0,
      social: !!(profile.github_url || profile.linkedin_url || profile.portfolio_url),
    }

    const totalFields = Object.keys(completeness).length
    const completedFields = Object.values(completeness).filter(Boolean).length
    const percentage = Math.round((completedFields / totalFields) * 100)

    return {
      success: true,
      completeness,
      percentage,
      missingFields: Object.entries(completeness)
        .filter(([_, value]) => !value)
        .map(([key]) => key)
    }
  }
}