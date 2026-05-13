import { supabase } from "./supabase";

/**
 * Fetch all cart items for a user by joining orders → order_items → products.
 * Schema:
 *   orders        (id, user_id, total, status, payment_method, created_at)
 *   order_items   (id, order_id, product_id, quantity)
 *   products      (id, name_en, name_ar, price, image, ...)
 */
export const fetchCartItems = async (userId) => {
  // Get the user's pending/cart order
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "cart")
    .order("created_at", { ascending: false })
    .limit(1);

  if (ordersError) throw ordersError;
  if (!orders || orders.length === 0) return [];

  const orderId = orders[0].id;

  const { data, error } = await supabase
    .from("order_items")
    .select(
      `
      id,
      order_id,
      product_id,
      quantity,
      products!product_id (id, name_en, name_ar, price, image)
      `
    )
    .eq("order_id", orderId)
    .order("id", { ascending: true });

  if (error) throw error;

  return (data || []).map((item) => ({
    id: item.id,
    order_id: item.order_id,
    product_id: item.product_id,
    quantity: item.quantity,
    product_name: item.products?.name_en || "Product",
    product_name_ar: item.products?.name_ar || "Product",
    product_price: item.products?.price || 0,
    image: item.products?.image || "",
  }));
};

/**
 * Get or create a "cart" order for the user, then upsert the item.
 */
export const saveCartItem = async (userId, product, productName) => {
  const productId = product.id ?? product.product_id;

  if (!userId) throw new Error("Unable to save cart item: missing user ID.");
  if (!productId) throw new Error("Unable to save cart item: missing product ID.");

  // 1. Find or create a cart-status order for this user
  let orderId;

  const { data: existingOrders, error: fetchOrderError } = await supabase
    .from("orders")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "cart")
    .order("created_at", { ascending: false })
    .limit(1);

  if (fetchOrderError) throw fetchOrderError;

  if (existingOrders && existingOrders.length > 0) {
    orderId = existingOrders[0].id;
  } else {
    const { data: newOrder, error: createOrderError } = await supabase
      .from("orders")
      .insert({ user_id: userId, total: 0, status: "cart", payment_method: "cash" })
      .select()
      .single();

    if (createOrderError) throw createOrderError;
    orderId = newOrder.id;
  }

  // 2. Check if this product is already in the order
  const { data: existingItem, error: selectError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId)
    .eq("product_id", productId)
    .maybeSingle();

  if (selectError) throw selectError;

  if (existingItem) {
    const { data, error } = await supabase
      .from("order_items")
      .update({ quantity: existingItem.quantity + 1 })
      .eq("id", existingItem.id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      order_id: data.order_id,
      product_id: data.product_id,
      quantity: data.quantity,
      product_name: productName,
      product_price: product.price,
      image: product.image,
    };
  }

  // 3. Insert new item
  const { data, error } = await supabase
    .from("order_items")
    .insert({ order_id: orderId, product_id: productId, quantity: 1 })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    order_id: data.order_id,
    product_id: data.product_id,
    quantity: data.quantity,
    product_name: productName,
    product_price: product.price,
    image: product.image,
  };
};

/**
 * Place the order: update the cart order's status, total, and payment method.
 */
export const placeOrder = async (userId, paymentMethod) => {
  // Get the current cart order
  const { data: orders, error: fetchError } = await supabase
    .from("orders")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "cart")
    .order("created_at", { ascending: false })
    .limit(1);

  if (fetchError) throw fetchError;
  if (!orders || orders.length === 0) throw new Error("No active cart found.");

  const orderId = orders[0].id;

  // Calculate total from order_items
  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("quantity, products:product_id (price)")
    .eq("order_id", orderId);

  if (itemsError) throw itemsError;

  const total = (items || []).reduce(
    (sum, item) => sum + item.quantity * (item.products?.price || 0),
    0
  );

  // Update order to "pending" (placed)
  const { data, error } = await supabase
    .from("orders")
    .update({
      status: "pending",
      payment_method: paymentMethod,
      total,
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
};