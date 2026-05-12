import { supabase } from "./supabase";
export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  console.log("DATA:", data);
  console.log("ERROR:", error);

  return data;
};