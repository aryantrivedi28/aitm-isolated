import * as cheerio from 'cheerio'

export class PageAnalyzer {
  static extractProductInfo(html: string) {
    const $ = cheerio.load(html)
    
    // Try to extract product data from structured data
    const jsonLd = $('script[type="application/ld+json"]')
    let productData: any = null
    
    jsonLd.each((_, element) => {
      try {
        const content = $(element).html()
        if (content) {
          const data = JSON.parse(content)
          if (data['@type'] === 'Product' || data['@type']?.includes('Product')) {
            productData = data
          }
        }
      } catch (e) {
        // Skip invalid JSON
      }
    })
    
    // If no structured data, try to extract from HTML
    if (!productData) {
      productData = {
        name: $('h1.product-title, h1.product-name').text().trim() || 
              $('h1').first().text().trim(),
        price: this.extractPrice($),
        description: $('.product-description, [itemprop="description"]').text().trim() || 
                    $('meta[name="description"]').attr('content') || '',
        images: this.extractImages($),
        availability: this.extractAvailability($)
      }
    }
    
    return productData
  }

  private static extractPrice($: cheerio.CheerioAPI) {
    const priceSelectors = [
      '.product-price',
      '.price',
      '[itemprop="price"]',
      '.current-price',
      '.money'
    ]
    
    for (const selector of priceSelectors) {
      const priceText = $(selector).first().text().trim()
      if (priceText) {
        const match = priceText.match(/\$?(\d+\.?\d*)/)
        if (match) {
          return parseFloat(match[1])
        }
      }
    }
    
    return 0
  }

  private static extractImages($: cheerio.CheerioAPI) {
    const images: string[] = []
    
    // Look for product images
    const imageSelectors = [
      '.product-image',
      '.main-image',
      '[itemprop="image"]',
      '.gallery-image',
      'img[src*="products"]'
    ]
    
    imageSelectors.forEach(selector => {
      $(selector).each((_, element) => {
        const src = $(element).attr('src')
        if (src && !images.includes(src)) {
          images.push(src)
        }
      })
    })
    
    return images
  }

  private static extractAvailability($: cheerio.CheerioAPI) {
    const inStockText = ['in stock', 'available', 'add to cart']
    const outOfStockText = ['out of stock', 'sold out', 'unavailable']
    
    const pageText = $('body').text().toLowerCase()
    
    for (const text of outOfStockText) {
      if (pageText.includes(text)) {
        return 'out_of_stock'
      }
    }
    
    for (const text of inStockText) {
      if (pageText.includes(text)) {
        return 'in_stock'
      }
    }
    
    return 'unknown'
  }

  static countElements(html: string, element: string): number {
    const $ = cheerio.load(html)
    return $(element).length
  }

  static hasElement(html: string, selector: string): boolean {
    const $ = cheerio.load(html)
    return $(selector).length > 0
  }

  static extractText(html: string, selector: string): string {
    const $ = cheerio.load(html)
    return $(selector).text().trim()
  }

  static extractAttribute(html: string, selector: string, attribute: string): string {
    const $ = cheerio.load(html)
    return $(selector).attr(attribute) || ''
  }

  static findPattern(html: string, pattern: RegExp): string[] {
    const matches = html.match(pattern)
    return matches || []
  }

  static checkForScript(html: string, scriptName: string): boolean {
    const scriptPatterns = [
      new RegExp(`<script[^>]*${scriptName}[^>]*>`),
      new RegExp(`src="[^"]*${scriptName}`),
      new RegExp(`src='[^']*${scriptName}`)
    ]
    
    return scriptPatterns.some(pattern => pattern.test(html))
  }

  static extractResources(html: string) {
    const $ = cheerio.load(html)
    
    return {
      scripts: $('script[src]').map((_, el) => $(el).attr('src')).get(),
      styles: $('link[rel="stylesheet"]').map((_, el) => $(el).attr('href')).get(),
      images: $('img').map((_, el) => $(el).attr('src')).get(),
      iframes: $('iframe').map((_, el) => $(el).attr('src')).get(),
      fonts: $('link[rel*="font"], link[href*="font"], link[href*="woff"], link[href*="ttf"]')
        .map((_, el) => $(el).attr('href')).get()
    }
  }
}