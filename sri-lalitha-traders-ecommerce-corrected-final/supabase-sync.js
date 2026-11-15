// Shared online data layer for SRI LALITHA TRADERS.
// The existing website still works locally until Supabase is configured.

async function loadSupabaseData() {
  if (!window.SUPABASE_READY || !window.supabaseClient) return false;
  const db = window.supabaseClient;

  const [productsResult, locationsResult, ordersResult] = await Promise.all([
    db.from("products").select("*").order("id"),
    db.from("delivery_locations").select("*").order("name"),
    db.from("orders").select("*").order("created_at", { ascending: false })
  ]);

  if (!productsResult.error && productsResult.data?.length) {
    products = productsResult.data.map(p => ({
      id: p.id, name: p.name, category: p.category,
      price: Number(p.price), stock: Number(p.stock), image: p.image || ""
    }));
  }

  if (!locationsResult.error && locationsResult.data?.length) {
    locations = locationsResult.data.map(l => ({
      name: l.name, charge: Number(l.charge)
    }));
  }

  if (!ordersResult.error) {
    orders = ordersResult.data.map(o => ({
      id: o.id, name: o.customer_name, phone: o.phone,
      address: o.address, location: o.delivery_location,
      payment: o.payment_method, items: o.items || [],
      subtotal: Number(o.subtotal || 0), delivery: Number(o.delivery_charge || 0),
      total: Number(o.total || 0), status: o.status || "Order Placed",
      currentLocation: o.current_location || null
    }));
  }

  localStorage.setItem("slt_products", JSON.stringify(products));
  localStorage.setItem("slt_locations", JSON.stringify(locations));
  localStorage.setItem("slt_orders", JSON.stringify(orders));
  return true;
}

async function syncProductsToSupabase() {
  if (!window.SUPABASE_READY) return;
  const db = window.supabaseClient;
  await db.from("products").upsert(products.map(p => ({
    id: p.id, name: p.name, category: p.category,
    price: p.price, stock: p.stock, image: p.image || null
  })));
}

async function syncLocationsToSupabase() {
  if (!window.SUPABASE_READY) return;
  const db = window.supabaseClient;
  await db.from("delivery_locations").upsert(locations.map(l => ({
    name: l.name, charge: l.charge
  })), { onConflict: "name" });
}

async function syncOrdersToSupabase() {
  if (!window.SUPABASE_READY) return;
  const db = window.supabaseClient;
  await db.from("orders").upsert(orders.map(o => ({
    id: String(o.id), customer_name: o.name, phone: o.phone,
    address: o.address || "", delivery_location: o.location || "",
    payment_method: o.payment || "", items: o.items || [],
    subtotal: o.subtotal || 0, delivery_charge: o.delivery || 0,
    total: o.total || 0, status: o.status || "Order Placed",
    current_location: o.currentLocation || null
  })));
}

async function syncAllToSupabase() {
  if (!window.SUPABASE_READY) return;
  try {
    await Promise.all([
      syncProductsToSupabase(),
      syncLocationsToSupabase(),
      syncOrdersToSupabase()
    ]);
  } catch (e) {
    console.warn("Supabase sync failed:", e.message);
  }
}
