import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

function respond(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return respond({ error: "Method not allowed." }, 405);

  const authorization = request.headers.get("Authorization") || "";
  const token = authorization.replace(/^Bearer\s+/i, "");
  const projectUrl = Deno.env.get("SUPABASE_URL");
  const publishableKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SECRET_KEY");
  if (!projectUrl || !publishableKey || !serviceRoleKey) {
    console.error("Account deletion is not configured.");
    return respond({ error: "Account deletion is temporarily unavailable. Please contact support." }, 503);
  }
  if (!token) return respond({ error: "Sign in again before deleting your account." }, 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return respond({ error: "A confirmation is required to delete your account." }, 400);
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)
    || (body as Record<string, unknown>).confirmation !== "DELETE") {
    return respond({ error: "Type DELETE in the app to confirm account deletion." }, 400);
  }

  const userClient = createClient(projectUrl, publishableKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const { data: userData, error: userError } = await userClient.auth.getUser(token);
  if (userError || !userData.user) {
    return respond({ error: "Your session has expired. Sign in again before deleting your account." }, 401);
  }

  const adminClient = createClient(projectUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(userData.user.id);
  if (deleteError) {
    console.error("Supabase account deletion failed", deleteError.message);
    return respond({ error: "Your account could not be deleted. No deletion was confirmed; please try again or contact support." }, 500);
  }

  return respond({ success: true });
});
