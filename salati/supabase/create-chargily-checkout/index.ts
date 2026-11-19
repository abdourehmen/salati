import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const payload = await req.json();

    if (payload.type === "checkout.paid") {
      const checkout = payload.data;
      const { hall_id, plan_tier, billing_cycle } = checkout.metadata || {};

      if (hall_id) {
        const supabaseAdmin = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        // جلب تاريخ انتهاء الاشتراك الحالي لتمديده إذا كان لا يزال سارياً
        const { data: hall } = await supabaseAdmin
          .from("halls")
          .select("subscription_ends_at, subscription_status")
          .eq("id", hall_id)
          .single();

        const now = new Date();
        const currentEnd = hall?.subscription_ends_at ? new Date(hall.subscription_ends_at) : now;
        const baseDate = currentEnd > now && hall?.subscription_status === "active" ? currentEnd : now;

        const daysToAdd = billing_cycle === "annual" ? 365 : billing_cycle === "semi_annual" ? 180 : 30;
        const newEndDate = new Date(baseDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

        await supabaseAdmin
          .from("halls")
          .update({
            plan_tier: plan_tier || "basic",
            billing_cycle: billing_cycle || "monthly",
            subscription_status: "active",
            is_active: true,
            subscription_ends_at: newEndDate.toISOString(),
          })
          .eq("id", hall_id);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
});