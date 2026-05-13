import { supabase } from "./supabase";

export const getTranslations = async () => {
  const { data, error } = await supabase
    .from("translations")
    .select("*");

  if (error) {
    console.error(error);
    return { en: {}, ar: {} };
  }

  // Group rows by lang into { en: { key: value }, ar: { key: value } }
  // Keys are lowercased to match the normalizeKey() function in LanguageProvider
  const translations = { en: {}, ar: {} };

  data.forEach((item) => {
    const lang = item.lang === "ar" ? "ar" : "en";
    const key = String(item.key ?? "").trim().toLowerCase(); // ← fix: lowercase key
    translations[lang][key] = item.value;
  });

  return translations;
};