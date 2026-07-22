import { QueryClient, defaultShouldDehydrateQuery, isServer } from "@tanstack/react-query";

// 1. Naya QueryClient banane ka function - server pe har request ke liye
//    naya instance, browser mein sirf ek baar (taaki cache persist rahe).
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Kitni der tak data "fresh" mana jaye - isse client pe turant
        // dobara fetch nahi hoga jab hydrate hote hi useQuery chalega.
        staleTime: 60 * 1000, // 1 minute - apni zarurat ke hisaab se badha/ghata sakte ho
      },
      dehydrate: {
        // Pending queries (jo abhi resolve nahi hui) ko bhi dehydrate karo,
        // taaki agar koi query slow ho to bhi state client ko mil jaye.
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient;

// 2. Server pe hamesha naya client (isolated per-request).
//    Browser mein singleton client (taaki navigation ke beech cache bana rahe).
export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}