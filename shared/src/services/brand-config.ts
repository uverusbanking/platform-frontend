export interface BrandConfig {
  brandName: string;
  shortBrandName: string;
  brandLogoUrl?: string | null;
  brandIconUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  supportEmail?: string | null;
  websiteUrl?: string | null;
  privacyUrl?: string | null;
  termsUrl?: string | null;
  seo?: {
    title?: string | null;
    description?: string | null;
    author?: string | null;
  };
}

const CACHE_KEY = "platform_brand_config";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function hexToRgbTriplet(hex: string): string | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return `${r} ${g} ${b}`;
}

export class BrandConfigService {
  private static config: BrandConfig | null = null;

  static getConfigSync(
    type: "corporate" | "personal" | "dashboard",
  ): BrandConfig {
    if (this.config) return this.config;

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) {
          this.config = data;
          return data;
        }
      } catch {
        // stale or corrupt — fall through to fallback
      }
    }

    return this.getFallbackConfig(type);
  }

  static getFallbackConfig(
    type: "corporate" | "personal" | "dashboard",
  ): BrandConfig {
    if (type === "dashboard") {
      return {
        brandName: "Platform Dashboard",
        shortBrandName: "Dashboard",
        seo: {
          title: "Partner Dashboard",
          description: "Manage your institutional services.",
          author: "Platform Administration",
        },
      };
    }

    return {
      brandName:
        type === "corporate" ? "Corporate Banking" : "Personal Banking",
      shortBrandName: type === "corporate" ? "Corporate" : "Personal",
      seo: {
        title:
          type === "corporate"
            ? "Corporate Banking Portal"
            : "Personal Banking Portal",
        description: "Secure digital banking services.",
        author: "Platform Admin",
      },
    };
  }

  /** Fetch brand config from backend, bypassing the in-memory cache. Updates localStorage cache. */
  static async forceRefresh(
    type: "corporate" | "personal" | "dashboard",
    apiBaseUrl?: string,
  ): Promise<BrandConfig> {
    if (apiBaseUrl) {
      try {
        const originDomain =
          typeof window !== "undefined" ? window.location.host : "";
        const response = await fetch(
          `${apiBaseUrl}/api/v1/organisation/brand-config/public`,
          {
            headers: {
              "Content-Type": "application/json",
              "origin-domain": originDomain,
            },
          },
        );
        if (response.ok) {
          const json = await response.json();
          // Backend wraps in { status, data } or returns data directly
          const data: BrandConfig = json?.data ?? json;
          this.config = data;
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ data, timestamp: Date.now() }),
          );
          return data;
        }
      } catch {
        // Network error — fall through to fallback
      }
    }

    const fallback = this.getFallbackConfig(type);
    this.config = fallback;
    return fallback;
  }

  /**
   * Load brand config. Serves from localStorage cache if fresh (< 1 hour),
   * otherwise fetches from the backend API.
   */
  static async loadConfig(
    type: "corporate" | "personal" | "dashboard",
    apiBaseUrl?: string,
  ): Promise<BrandConfig> {
    if (this.config) return this.config;

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) {
          this.config = data;
          return data;
        }
      } catch {
        // corrupt cache — proceed to fetch
      }
    }

    return this.forceRefresh(type, apiBaseUrl);
  }

  /**
   * Apply brand config to the document:
   * - CSS custom properties (--brand-primary, --brand-secondary, etc.)
   * - document.title
   * - favicon <link>
   */
  static applyToDocument(config: BrandConfig): void {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    if (config.primaryColor) {
      const rgb = hexToRgbTriplet(config.primaryColor);
      if (rgb) {
        root.style.setProperty("--brand-primary", rgb);
        root.style.setProperty("--ring", rgb);
        root.style.setProperty("--sidebar-primary", rgb);
        root.style.setProperty("--sidebar-ring", rgb);
      }
    }

    if (config.secondaryColor) {
      const rgb = hexToRgbTriplet(config.secondaryColor);
      if (rgb) {
        root.style.setProperty("--brand-secondary", rgb);
      }
    }

    const title = config.seo?.title || config.brandName;
    if (title) document.title = title;

    if (config.brandIconUrl) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = config.brandIconUrl;
    }
  }
}
