import viValidation from "../locales/vi/validation.json";
import jaValidation from "../locales/ja/validation.json";
import enValidation from "../locales/en/validation.json";

import viAuth from "../locales/vi/auth.json";
import jaAuth from "../locales/ja/auth.json";
import enAuth from "../locales/en/auth.json";

export type Locale = "vi" | "ja" | "en";

interface Bundle {
    [key: string]: string;
}

const bundles: Record<Locale, Bundle> = {
    vi: { ...viValidation, ...viAuth },
    ja: { ...jaValidation, ...jaAuth },
    en: { ...enValidation, ...enAuth }
};

// Có thể bật để log key thiếu trong quá trình dev
const LOG_MISSING = process.env.NODE_ENV !== "production";

export function t(locale: Locale, key: string): string {
    const loc = bundles[locale];
    if (loc && key in loc) return loc[key];
    if (key in bundles.en) {
        if (LOG_MISSING && (!loc || !(key in loc))) {
            // eslint-disable-next-line no-console
            console.warn(`[i18n] Missing key in locale '${locale}': ${key}`);
        }
        return bundles.en[key];
    }
    if (LOG_MISSING) {
        console.warn(`[i18n] Missing key (all locales): ${key}`);
    }
    return key;
}

export function detectLocale(
    source: { query?: any; headers?: any },
    fallback: Locale = "en"
): Locale {
    const q = (source.query?.lang || "").toString().toLowerCase();
    if (isLocale(q)) return q;

    const h = (source.headers?.["x-lang"] || "").toString().toLowerCase();
    if (isLocale(h)) return h;

    const accept = (source.headers?.["accept-language"] || "").toString().toLowerCase();
    if (accept) {
        const primary = accept.split(",")[0].split("-")[0].trim();
        if (isLocale(primary)) return primary as Locale;
    }
    return fallback;
}

function isLocale(v: string): v is Locale {
    return v === "vi" || v === "ja" || v === "en";
}

// Cho phép nạp thêm messages động (ví dụ module mới)
export function extendMessages(locale: Locale, messages: Record<string,string>) {
    bundles[locale] = { ...bundles[locale], ...messages };
}

// Nạp một bộ all-locale cho cùng một domain
export function registerDomain(domain: string, all: Partial<Record<Locale, Record<string,string>>>) {
    (Object.keys(all) as Locale[]).forEach(locale => {
        if (!all[locale]) return;
        bundles[locale] = { ...bundles[locale], ...prefixKeys(domain, all[locale]!) };
    });
}

function prefixKeys(domain: string, obj: Record<string,string>) {
    const out: Record<string,string> = {};
    Object.entries(obj).forEach(([k, v]) => {
        const namespaced = k.startsWith(domain + ".") ? k : `${domain}.${k}`;
        out[namespaced] = v;
    });
    return out;
}