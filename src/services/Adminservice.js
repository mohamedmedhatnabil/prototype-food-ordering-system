import { supabase } from "./supabase";

// ─── Products ──────────────────────────────────────────────────────────────────

export const adminGetProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw error;
  return data || [];
};

export const adminAddProduct = async (product) => {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const adminUpdateProduct = async (id, updates) => {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const adminDeleteProduct = async (id) => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

// ─── Orders ────────────────────────────────────────────────────────────────────

export const adminGetOrders = async () => {
  const { data, error } = await supabase
  .from("orders")
  .select(`
    id,
    user_id,
    total,
    status,
    payment_method,
    created_at,
    order_items!fk_order_items_order (
      id,
      quantity,
      products!fk_order_items_product (name_en, price)
    )
  `)
  .neq("status", "cart")
  .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((o) => ({
    id: o.id,
    userId: o.user_id,
    total: o.total,
    status: o.status,
    paymentMethod: o.payment_method,
    createdAt: o.created_at,

    itemCount: (o.order_items || []).reduce(
      (sum, i) => sum + (i.quantity || 0),
      0
    ),

    items: (o.order_items || []).map((i) => ({
      name: i.products?.name_en || "Product",
      quantity: i.quantity,
      price: i.products?.price || 0,
    })),
  }));
};

export const adminUpdateOrderStatus = async (orderId, newStatus) => {
  const { data, error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ─── Stats ─────────────────────────────────────────────────────────────────────

export const adminGetStats = async () => {
  const { data: revenue } = await supabase
    .from("orders")
    .select("total")
    .eq("status", "delivered");

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data: todayOrders } = await supabase
    .from("orders")
    .select("id")
    .neq("status", "cart")
    .gte("created_at", todayStart.toISOString());

  const { data: pending } = await supabase
    .from("orders")
    .select("id")
    .eq("status", "pending");

  const { data: products } = await supabase
    .from("products")
    .select("id");

  return {
    totalRevenue: (revenue || []).reduce(
      (sum, o) => sum + (o.total || 0),
      0
    ),
    ordersToday: (todayOrders || []).length,
    pendingCount: (pending || []).length,
    productCount: (products || []).length,
  };
};