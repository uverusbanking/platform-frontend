export interface BrandConfig {
  brandName: string;
  shortBrandName: string;
  brandLogoUrl?: string;
  brandLogoBase64?: string;
  supportEmail?: string;
  meta?: {
    title?: string;
    description?: string;
    author?: string;
  };
}

const CONFIG_CACHE_KEY = "platform_brand_config";
const CONFIG_CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour

export class BrandConfigService {
  private static config: BrandConfig | null = null;

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
  ): Promise<BrandConfig> {
    if (this.config) return this.config;

    // Check Cache
    const cached = localStorage.getItem(CONFIG_CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CONFIG_CACHE_EXPIRY) {
          this.config = data;
          return data;
        }
      } catch (e) {
        localStorage.removeItem(CONFIG_CACHE_KEY);
      }
    }

    // Load from public endpoint (placeholder URL)
    // In a real scenario, this would be a URL like /api/brand-config or an external CDN
    const configUrl = import.meta.env.VITE_BRAND_CONFIG_URL;

    if (configUrl) {
      try {
        const response = await fetch(configUrl);
        if (response.ok) {
          const data = await response.json();
          this.config = data;
          localStorage.setItem(
            CONFIG_CACHE_KEY,
            JSON.stringify({ data, timestamp: Date.now() }),
          );
          return data;
        }
      } catch (e) {
        console.warn("Failed to load brand config, using fallback", e);
      }
    }

    this.config = this.getFallbackConfig(type);
    return this.config;
  }

  static getConfigSync(type: "corporate" | "personal"): BrandConfig {
    return this.config || this.getFallbackConfig(type);
  }
}
