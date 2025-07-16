// src/lib/pb.ts
import PocketBase from "pocketbase";

export const pb = new PocketBase("https://puria.baricittaperta.xyz");

// se usi auth JWT:
// pb.authStore.loadFromCookie(document.cookie);
