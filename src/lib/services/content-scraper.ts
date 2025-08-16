import { DriveService } from "./drive-service"

export class ContentScraper {
  private driveService: DriveService

  constructor() {
    this.driveService = new DriveService()
  }

  async scrapeContent(url: string, type: "portfolio" | "github" | "resume" | "proposal"): Promise<string> {
    if (!url || url.trim() === "") {
      return ""
    }

    try {
      // Handle Google Drive links
      if (url.includes("drive.google.com") || url.includes("docs.google.com")) {
        return await this.driveService.extractContent(url)
      }

      // Handle GitHub links
      if (url.includes("github.com")) {
        return await this.scrapeGitHub(url)
      }

      // Handle regular websites (portfolios)
      if (type === "portfolio") {
        return await this.scrapeWebsite(url)
      }

      return ""
    } catch (error) {
      console.error(`Error scraping ${type} content from ${url}:`, error)
      return ""
    }
  }

  private async scrapeGitHub(url: string): Promise<string> {
    try {
      // Extract username and repo from GitHub URL
      const match = url.match(/github\.com\/([^/]+)(?:\/([^/]+))?/)
      if (!match) return ""

      const [, username, repo] = match
      let content = ""

      // Get user profile
      const userResponse = await fetch(`https://api.github.com/users/${username}`)
      if (userResponse.ok) {
        const userData = await userResponse.json()
        content += `GitHub Profile: ${userData.name || username}\n`
        content += `Bio: ${userData.bio || "No bio available"}\n`
        content += `Public Repos: ${userData.public_repos}\n`
        content += `Followers: ${userData.followers}\n`
        content += `Following: ${userData.following}\n\n`
      }

      // Get repositories
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`)
      if (reposResponse.ok) {
        const repos = await reposResponse.json()
        content += "Recent Repositories:\n"
        repos.forEach((repo: any) => {
          content += `- ${repo.name}: ${repo.description || "No description"}\n`
          content += `  Language: ${repo.language || "Not specified"}\n`
          content += `  Stars: ${repo.stargazers_count}, Forks: ${repo.forks_count}\n`
        })
      }

      // If specific repo, get README
      if (repo) {
        const readmeResponse = await fetch(`https://api.github.com/repos/${username}/${repo}/readme`)
        if (readmeResponse.ok) {
          const readmeData = await readmeResponse.json()
          const readmeContent = Buffer.from(readmeData.content, "base64").toString("utf-8")
          content += `\nREADME for ${repo}:\n${readmeContent.substring(0, 2000)}`
        }
      }

      return content
    } catch (error) {
      console.error("GitHub scraping error:", error)
      return ""
    }
  }

  private async scrapeWebsite(url: string): Promise<string> {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      })

      if (!response.ok) {
        return ""
      }

      const html = await response.text()

      // Extract text content from HTML
      const textContent = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()

      // Limit content length
      return textContent.substring(0, 3000)
    } catch (error) {
      console.error("Website scraping error:", error)
      return ""
    }
  }

  async scrapeAllContent(freelancer: any): Promise<{
    portfolio: string
    github: string
    resume: string
    proposal: string
  }> {
    const [portfolio, github, resume, proposal] = await Promise.all([
      this.scrapeContent(freelancer.portfolio_link, "portfolio"),
      this.scrapeContent(freelancer.github_link, "github"),
      this.scrapeContent(freelancer.resume_link, "resume"),
      this.scrapeContent(freelancer.proposal_link, "proposal"),
    ])

    return { portfolio, github, resume, proposal }
  }
}
