import { TruckElectric } from "lucide-react"
import puppeteer, { Browser } from "puppeteer"

export class PortfolioScrapingService {
  private browser: Browser | null = null

  async initialize() {
    try {
      this.browser = await puppeteer.launch({ headless: true })
      return true
    } catch (err) {
      console.error("❌ Failed to launch browser:", err)
      return false
    }
  }

  async parsePortfolio(url: string): Promise<string> {
    if (!this.browser) throw new Error("Browser not initialized")

    const page = await this.browser.newPage()

    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 })
      const content = await page.evaluate(() => {
        const bodyText = document.body?.innerText || ""
        return bodyText.trim()
      })
      return content
    } catch (err) {
      console.error("❌ Error scraping portfolio:", err)
      throw err
    } finally {
      await page.close()
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close()
    }
  }
}
