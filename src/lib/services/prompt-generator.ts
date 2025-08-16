export class PromptGenerator {
  generateAnalysisPrompt(
    freelancer: any,
    content: any,
    category: string,
    techStack: string,
    customPrompt?: string,
  ): string {
    const basePrompt = `
You are an expert technical recruiter analyzing a freelancer's profile for a ${category} position requiring ${techStack} skills.

FREELANCER PROFILE:
- Name: ${freelancer.name}
- Email: ${freelancer.email}
- Years of Experience: ${freelancer.years_experience}
- Category: ${category}
- Tech Stack Required: ${techStack}

CONTENT ANALYSIS:
${content.portfolio ? `PORTFOLIO CONTENT:\n${content.portfolio}\n\n` : ""}
${content.github ? `GITHUB PROFILE:\n${content.github}\n\n` : ""}
${content.resume ? `RESUME CONTENT:\n${content.resume}\n\n` : ""}
${content.proposal ? `PROPOSAL CONTENT:\n${content.proposal}\n\n` : ""}

EVALUATION CRITERIA:
1. Technical Skills Match (${techStack})
2. Experience Level and Quality
3. Portfolio/Project Quality
4. Code Quality (from GitHub)
5. Communication Skills (from proposal)
6. Professional Presentation

${customPrompt ? `ADDITIONAL REQUIREMENTS:\n${customPrompt}\n\n` : ""}

Please provide:
1. OVERALL RATING: Score from 1-10
2. DETAILED REVIEW: 2-3 paragraphs covering strengths, weaknesses, and fit for the role
3. TECHNICAL ASSESSMENT: Specific evaluation of technical skills
4. RECOMMENDATION: Hire/Consider/Pass with reasoning

Format your response as:
RATING: [1-10]
REVIEW: [Detailed review]
TECHNICAL: [Technical assessment]
RECOMMENDATION: [Hire/Consider/Pass - Reasoning]
`

    return basePrompt.trim()
  }

  generateCategorySpecificCriteria(category: string, techStack: string): string {
    const criteriaMap: Record<string, string> = {
      "Web Development": `
- Frontend frameworks (React, Vue, Angular)
- Backend technologies (Node.js, Python, PHP)
- Database management (SQL, NoSQL)
- API development and integration
- Responsive design and cross-browser compatibility
      `,
      "Mobile Development": `
- Native development (iOS/Android)
- Cross-platform frameworks (React Native, Flutter)
- App store deployment experience
- Mobile UI/UX best practices
- Performance optimization
      `,
      "Data Science": `
- Programming languages (Python, R, SQL)
- Machine learning frameworks
- Data visualization tools
- Statistical analysis skills
- Big data technologies
      `,
      DevOps: `
- Cloud platforms (AWS, Azure, GCP)
- Containerization (Docker, Kubernetes)
- CI/CD pipeline setup
- Infrastructure as Code
- Monitoring and logging
      `,
      "AI/ML": `
- Machine learning algorithms
- Deep learning frameworks (TensorFlow, PyTorch)
- Data preprocessing and feature engineering
- Model deployment and scaling
- MLOps practices
      `,
    }

    return (
      criteriaMap[category] ||
      `
- Proficiency in ${techStack}
- Problem-solving abilities
- Code quality and best practices
- Project management skills
- Communication and collaboration
    `
    )
  }
}
