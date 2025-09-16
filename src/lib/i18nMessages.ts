// @ts-ignore
import vi from "../locales/vi/validation.json";
// @ts-ignore
import ja from "../locales/ja/validation.json";
// @ts-ignore
import en from "../locales/en/validation.json";

export type Locale = "vi" | "ja" | "en";

const bundles: Record<Locale, Record<string,string>> = { vi, ja, en };

export function t(locale: Locale, code: string): string {
    return bundles[locale][code] || bundles.en[code] || code;
}