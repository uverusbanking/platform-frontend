export interface BrandConfig {
  brandName: string;
  shortBrandName: string;
  brandLogoUrl?: string;
  supportEmail?: string;
  meta: {
    title?: string;
    description?: string;
    author?: string;
  };
}

export class BrandConfigService {
  private static config: BrandConfig | null = null;
  private static readonly CACHE_KEY = "platform_brand_config";
  private static readonly CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour

  static getConfigSync(type: "corporate" | "personal"): BrandConfig {
    if (this.config) return this.config;

    // Try to get from cache immediately if available
    const cached = localStorage.getItem(this.CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < this.CACHE_EXPIRY) {
          this.config = data;
          return data;
        }
      } catch (e) {
        console.error("Error parsing cached brand config", e);
      }
    }

    return this.getFallbackConfig(type);
  }

  static getFallbackConfig(type: "corporate" | "personal"): BrandConfig {
    return {
      brandName:
        type === "corporate" ? "Corporate Banking" : "Personal Banking",
      shortBrandName: type === "corporate" ? "Corporate" : "Personal",
      meta: {
        title:
          type === "corporate"
            ? "Corporate Banking Portal"
            : "Personal Banking Portal",
        description: "Secure digital banking services.",
        author: "Platform Admin",
      },
    };
  }

  static async loadConfig(
    type: "corporate" | "personal",
    configUrl?: string,
  ): Promise<BrandConfig> {
    if (this.config) return this.config;

    // Check Cache
    const cached = localStorage.getItem(this.CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < this.CACHE_EXPIRY) {
          this.config = data;
          return data;
        }
      } catch (e) {}
    }

    if (configUrl) {
      try {
        const response = await fetch(configUrl);
        if (response.ok) {
          const data = await response.json();
          this.config = data;
          localStorage.setItem(
            this.CACHE_KEY,
            JSON.stringify({ data, timestamp: Date.now() }),
          );
          return data;
        }
      } catch (e) {
        console.error("Failed to fetch brand config, using fallback", e);
      }
    }

    this.config = this.getFallbackConfig(type);
    return this.config;
  }
}
