// NEON COMPRESS V2 - Daily Limit API

const API_URL =
  "https://tgeiwdoauotulsisqada.supabase.co/functions/v1/neon-daily-limit";

const GUEST_ID_KEY = "neon_compress_guest_id";

// Guest ID ကို Browser မှာ သိမ်းထားမယ်
export function getGuestId(): string {
  let guestId = localStorage.getItem(GUEST_ID_KEY);

  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem(GUEST_ID_KEY, guestId);
  }

  return guestId;
}

// Supabase API ကို ခေါ်မယ်
async function callDailyLimitAPI(action: "check" | "use") {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      guest_id: getGuestId(),
      action,
    }),
  });

  if (!response.ok) {
    throw new Error("Daily Limit API Error");
  }

  return response.json() as Promise<{
    allowed: boolean;
    remaining: number;
    limit: number;
  }>;
}

// လက်ကျန် Limit စစ်မယ်
export async function checkDailyLimit() {
  return callDailyLimitAPI("check");
}

// Limit တစ်ခု အသုံးပြုမယ်
export async function useDailyLimit() {
  return callDailyLimitAPI("use");
}
