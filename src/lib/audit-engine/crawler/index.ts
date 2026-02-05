import puppeteer, { Browser, Page } from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
import { CrawlResult } from '../types'

export class AdvancedCrawler {
  private browser: Browser | null = null
  private page: Page | null = null

  async initialize() {
    console.log('🕷️ [Crawler] Initializing browser...')

    const browserlessKey = process.env.BROWSERLESS_API_KEY
    const isServerless = !!process.env.VERCEL

    try {
      if (browserlessKey) {
        // ✅ Browserless
        this.browser = await puppeteer.connect({
          browserWSEndpoint: `wss://chrome.browserless.io?token=${browserlessKey}`,
        })
      }
      else if (isServerless) {
        // ✅ Vercel / serverless
        this.browser = await puppeteer.launch({
          args: chromium.args,
          executablePath: await chromium.executablePath(),
        })
      }
      else {
        // ✅ Local machine
        this.browser = await puppeteer.launch({
          headless: true,
          executablePath: await chromium.executablePath(),
        })
      }

      this.page = await this.browser.newPage()

      await this.page.setViewport({ width: 1920, height: 1080 })
      await this.page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
      )

      console.log('✅ [Crawler] Browser initialized')
    } catch (error) {
      console.error('❌ [Crawler] Initialization failed:', error)
      throw error
    }
  }

  async crawl(url: string): Promise<CrawlResult> {
    if (!this.page) throw new Error('Crawler not initialized')

    console.log(`🌐 [Crawler] Crawling: ${url}`)
    const startTime = Date.now()

    try {
      // 🚀 Faster + safer navigation
      const response = await this.page.goto(url, {
        waitUntil: 'domcontentloaded', // ✅ KEY FIX
        timeout: 45000,
      })

      // Wait a bit for JS-heavy sites (Shopify, Next, etc.)
      await new Promise(resolve => setTimeout(resolve, 3000))


      const html = await this.page.content()

      const desktopScreenshot = await this.page.screenshot({
        encoding: 'base64',
        fullPage: true,
      })

      await this.page.setViewport({ width: 375, height: 812 })
      await new Promise(resolve => setTimeout(resolve, 1000))


      const mobileScreenshot = await this.page.screenshot({
        encoding: 'base64',
        fullPage: true,
      })

      const resources = await this.page.evaluate(() => {
        const scripts = Array.from(document.scripts)
          .map(s => s.src)
          .filter(Boolean)

        const styles = Array.from(document.styleSheets)
          .map(s => s.href)
          .filter((href): href is string => Boolean(href))

        const images = Array.from(document.images)
          .map(img => img.src)
          .filter(Boolean)

        const fonts = Array.from(document.fonts).map(f => f.family)

        return { scripts, styles, images, fonts }
      })

      const loadTime = Date.now() - startTime

      console.log(`✅ [Crawler] Completed in ${loadTime}ms`)

      return {
        url,
        html,
        screenshots: {
          desktop: `data:image/png;base64,${desktopScreenshot}`,
          mobile: `data:image/png;base64,${mobileScreenshot}`,
        },
        resources,
        headers: response?.headers() || {},
        status: response?.status() || 0,
        loadTime,
      }
    } catch (error) {
      console.error('❌ [Crawler] Crawl failed:', error)
      throw error
    }
  }


  async close() {
    if (this.browser) {
      await this.browser.close()
    }
  }
}
