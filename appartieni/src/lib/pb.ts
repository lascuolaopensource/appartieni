// src/lib/pb.ts
import PocketBase from "pocketbase";

export const pb = new PocketBase("https://puria.baricittaperta.xyz");

pb.authStore.loadFromCookie(document.cookie);

pb.authStore.onChange(() => {
  document.cookie = pb.authStore.exportToCookie();
});
