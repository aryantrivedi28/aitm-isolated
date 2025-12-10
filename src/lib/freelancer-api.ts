// lib/freelancer-api.ts
export const freelancerApi = {
  // Profile
  async getProfile() {
    const response = await fetch('/api/freelancer/profile')
    return response.json()
  },

  async updateProfile(updates: any) {
    const response = await fetch('/api/freelancer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    return response.json()
  },

  // Work Experience
  async getWorkExperience() {
    const response = await fetch('/api/freelancer/work-experience')
    return response.json()
  },

  async addWorkExperience(experience: any) {
    const response = await fetch('/api/freelancer/work-experience', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(experience),
    })
    return response.json()
  },

  async deleteWorkExperience(id: string) {
    const response = await fetch('/api/freelancer/work-experience', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    return response.json()
  },

  // Case Studies
  async getCaseStudies() {
    const response = await fetch('/api/freelancer/case-studies')
    return response.json()
  },

  async addCaseStudy(caseStudy: any) {
    const response = await fetch('/api/freelancer/case-studies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseStudy),
    })
    return response.json()
  },

  async deleteCaseStudy(id: string) {
    const response = await fetch('/api/freelancer/case-studies', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    return response.json()
  },

  // Image Upload
  async uploadCaseStudyImage(itemId: string, file: File) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('itemId', itemId)

    const response = await fetch('/api/freelancer/case-studies/upload', {
      method: 'POST',
      body: formData,
    })
    return response.json()
  },

  async deleteCaseStudyImage(imagePath: string, itemId: string) {
    const response = await fetch('/api/freelancer/case-studies/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagePath, itemId }),
    })
    return response.json()
  },
}