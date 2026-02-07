import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
import type * as Puppeteer from 'puppeteer-core'
import { CrawlResult } from '../types'

export class AdvancedCrawler {
  private browser: Puppeteer.Browser | null = null
  private page: Puppeteer.Page | null = null

  /* =========================================
     INIT
  ========================================= */

  async initialize() {
    console.log('🕷️ [Crawler] Initializing browser...')

    const browserlessKey = process.env.BROWSERLESS_API_KEY
    const isServerless = !!process.env.VERCEL

    try {
      if (browserlessKey) {
        this.browser = await puppeteer.connect({
          browserWSEndpoint: `wss://chrome.browserless.io?token=${browserlessKey}`,
        })
      }
      else if (isServerless) {
        // ✅ serverless only
        this.browser = await puppeteer.launch({
          args: chromium.args,
          executablePath: await chromium.executablePath(),
          headless: true
        })
      }
      else {
        // ✅ local → normal Chrome
        this.browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox']
        })
      }

      this.page = await this.browser.newPage()

      await this.page.setViewport({ width: 1920, height: 1080 })

      await this.page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120 Safari/537.36'
      )

      /* 🚀 HUGE SPEED BOOST */
      await this.page.setRequestInterception(true)

      this.page.on('request', req => {
        const type = req.resourceType()

        if (['image', 'font', 'media'].includes(type)) {
          req.abort()
        } else {
          req.continue()
        }
      })

      console.log('✅ [Crawler] Browser initialized')
    } catch (error) {
      console.error('❌ [Crawler] Initialization failed:', error)
      throw error
    }
  }

  /* =========================================
     CRAWL
  ========================================= */

  async crawl(url: string): Promise<CrawlResult> {
    if (!this.page) throw new Error('Crawler not initialized')

    console.log(`🌐 [Crawler] Crawling: ${url}`)

    const startTime = Date.now()

    const goto = async () =>
      this.page!.goto(url, {
        waitUntil: 'networkidle2', // 🔥 no more sleep hacks
        timeout: 45000,
      })

    let response

    try {
      response = await goto()
    } catch {
      console.log('Retrying navigation...')
      response = await goto()
    }

    const html = await this.page.content()

    /* 🔥 only one compressed screenshot */
    const screenshot = await this.page.screenshot({
      encoding: 'base64',
      type: 'jpeg',
      quality: 60,
      fullPage: true
    })

    const resources = await this.page.evaluate(() => {
      const scripts = Array.from(document.scripts)
        .map(s => s.src)
        .filter(Boolean)

      const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        .map(l => (l as HTMLLinkElement).href)
        .filter(Boolean)

      const images = Array.from(document.images)
        .map(img => img.src)
        .filter(Boolean)

      const fonts = Array.from(document.fonts || [])
        .map((f: any) => f.family || '')
        .filter(Boolean)

      return {
        scripts,
        styles,
        images,
        fonts
      }
    })


    const loadTime = Date.now() - startTime

    console.log(`✅ [Crawler] Completed in ${loadTime}ms`)

    return {
      url,
      html,
      screenshots: {
        desktop: `data:image/jpeg;base64,${screenshot}`,
        mobile: '' // removed
      },
      resources,
      headers: response?.headers() || {},
      status: response?.status() || 0,
      loadTime,
    }
  }

  /* =========================================
     CLOSE
  ========================================= */

  async close() {
    if (this.browser) await this.browser.close()
  }
}
