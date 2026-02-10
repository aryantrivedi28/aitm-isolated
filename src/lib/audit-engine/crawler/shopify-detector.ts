import { ShopifyStoreInfo } from '../types'

export class ShopifyDetector {
  static detect(html: string, headers: Record<string, string>, url: string): ShopifyStoreInfo {
    const isShopify = this.isShopifyStore(html, headers, url)

    const DEFAULT_THEME = {
      name: 'N/A',
      version: 'N/A',
      isOs20: false,
      isLegacy: false
    }


    if (!isShopify) {
      return {
        url,
        isShopify: false,
        theme: DEFAULT_THEME,
        apps: { count: 0, list: [] },
        products: 0,
        collections: 0,
        currency: this.extractCurrency(html),
        country: this.extractCountry(headers),
        language: this.extractLanguage(html)
      }
    }




    const theme = this.extractThemeInfo(html)
    const apps = this.detectApps(html)
    const stats = this.extractStoreStats(html)

    return {
      url,
      isShopify: true,
      theme,
      apps,
      ...stats,
      currency: this.extractCurrency(html),
      country: this.extractCountry(headers),
      language: this.extractLanguage(html)
    }
  }

  private static isShopifyStore(html: string, headers: Record<string, string>, url: string): boolean {
    // Check URL pattern
    if (url.includes('.myshopify.com')) return true

    // Check headers
    if (headers['x-shopid'] || headers['x-shopify-stage']) return true

    // Check HTML content
    const shopifyIndicators = [
      'shopify',
      'Shopify.theme',
      'window.Shopify',
      'cdn.shopify.com',
      '//cdn.shopify.com',
      'var Shopify =',
      'Shopify.shop =',
      'Shopify.money_format'
    ]

    return shopifyIndicators.some(indicator =>
      html.toLowerCase().includes(indicator.toLowerCase())
    )
  }

  private static extractThemeInfo(html: string) {
    const themeMatch = html.match(/Shopify\.theme\s*=\s*({[^}]+})/)
    const theme = themeMatch ? JSON.parse(themeMatch[1]) : {}

    const isOs20 = html.includes('"api_version":"') ||
      html.includes('template_suffix') ||
      html.includes('sections/')

    return {
      name: theme.name || 'Unknown',
      version: theme.version || '1.0',
      isOs20,
      isLegacy: !isOs20
    }
  }

  private static detectApps(html: string) {
    const scriptTags = html.match(/<script[^>]+src="[^"]+"[^>]*>/g) || []
    const linkTags = html.match(/<link[^>]+href="[^"]+"[^>]*>/g) || []

    const allAssets = [...scriptTags, ...linkTags]

    const appPatterns = [
      'apps.shopify.com',
      'shopifyapps',
      'rechargeapps.com',
      'judge.me',
      'loox.io',
      'yotpo.com',
      'klaviyo.com',
      'privacy.com',
      'gorgias.io',
      'reviews.io',
      'okendo.io',
      'stamped.io'
    ]

    const detectedApps = appPatterns.filter(pattern =>
      allAssets.some(asset => asset.includes(pattern))
    )

    return {
      count: detectedApps.length,
      list: detectedApps
    }
  }

  private static extractStoreStats(html: string) {
    // Try to extract product count from structured data
    const productMatch = html.match(/"productCount":\s*(\d+)/)
    const collectionMatch = html.match(/"collectionCount":\s*(\d+)/)

    return {
      products: productMatch ? parseInt(productMatch[1]) : 0,
      collections: collectionMatch ? parseInt(collectionMatch[1]) : 0
    }
  }

  private static extractCurrency(html: string) {
    const currencyMatch = html.match(/"currency":\s*"([^"]+)"/) ||
      html.match(/money_format":\s*"([^"]+)"/) ||
      html.match(/data-currency="([^"]+)"/)

    return currencyMatch ? currencyMatch[1] : 'USD'
  }

  private static extractCountry(headers: Record<string, string>) {
    return headers['cf-ipcountry'] || 'US'
  }

  private static extractLanguage(html: string) {
    const langMatch = html.match(/lang="([^"]+)"/) ||
      html.match(/"locale":\s*"([^"]+)"/)

    return langMatch ? langMatch[1] : 'en'
  }
}
