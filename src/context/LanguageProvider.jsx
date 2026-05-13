import { useEffect, useState } from "react";
import { LanguageContext } from "./LanguageContext";
import { getTranslations } from "../services/translationService";

const normalizeLang = (lang) => String(lang ?? "").trim().toLowerCase();
const normalizeKey = (key) => String(key ?? "").trim().toLowerCase();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => normalizeLang(localStorage.getItem("language") || "en"));
  const [translations, setTranslations] = useState({ en: {}, ar: {} });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const result = await getTranslations();
        console.log("Loaded translations from Supabase:", result);
        setTranslations({
          en: result.en || {},
          ar: result.ar || {}
        });
      } catch (error) {
        console.error("Unable to load translations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, []);

  const setLanguage = (lang) => {
    const normalizedLang = normalizeLang(lang);
    const nextLanguage = normalizedLang === "ar" ? "ar" : "en";
    setLanguageState(nextLanguage);
    localStorage.setItem("language", nextLanguage);
  };

  const t = (key, fallback = "") => {
    const normalizedKey = normalizeKey(key);
    if (!normalizedKey) {
      return fallback || "";
    }

    const arText = translations.ar[normalizedKey];
    const enText = translations.en[normalizedKey];

    if (process.env.NODE_ENV === "development") {
      if (language === "ar" && !arText && enText) {
        console.debug(`Translation fallback for key ${normalizedKey}: using EN when AR is missing.`);
      }
      if (language === "en" && !enText && arText) {
        console.debug(`Translation fallback for key ${normalizedKey}: using AR when EN is missing.`);
      }
      if (!arText && !enText) {
        console.debug(`Missing translation for key ${normalizedKey} in both languages.`);
      }
    }

    if (language === "ar") {
      if (arText) {
        return arText;
      }
      if (enText) {
        return enText;
      }
    }

    if (language === "en") {
      if (enText) {
        return enText;
      }
      if (arText) {
        return arText;
      }
    }

    return fallback || normalizedKey;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isLoading
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};