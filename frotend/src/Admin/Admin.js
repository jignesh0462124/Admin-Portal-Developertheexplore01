import { supabase } from "../../supabase/supabase";

/* =====================================================
   ADMIN AUTH
===================================================== */

export async function getCurrentAdmin() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("Not authenticated");
  return data.user;
}

export async function adminLogout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/* =====================================================
   FETCH USER PAYMENTS (BOOKINGS)
===================================================== */

export async function fetchBookings({
  page = 1,
  limit = 10,
  payment_status = null,
} = {}) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("bookings")
    .select(
      `
      id,
      full_name,
      email,
      phone,
      amount,
      razorpay_order_id,
      payment_id,
      payment_status,
      created_at
      `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (payment_status) {
    query = query.eq("payment_status", payment_status);
  }

  const { data, count, error } = await query;

  if (error) throw error;

  return {
    data,
    total: count,
  };
}
