// src/lib/performCheckin.ts
import { pb } from "./pb";
import { calcCheckinPoints } from "./points";
import { Venue } from "../data/types";

/**
 * Esegue un check‑in, calcola i punti e salva la transazione.
 * @returns { pts, checkinId }
 */
export async function performCheckin(
  venue: Venue,
  geo: { lat: number; lon: number },
) {
  const userId = JSON.parse(atob(pb.authStore.token.split(".")[1])).id;
  if (!userId) throw new Error("Utente non loggato");

  /* 1. Salva il check‑in */
  const checkin = await pb.collection("checkins").create({
    venue: venue.id,
    user: userId, // se il campo esiste
    geo,
  });

  /* 2. Verifica se è il primo check‑in in quel venue */
  let first = false;
  try {
    await pb
      .collection("checkins")
      .getFirstListItem(`user="${userId}" && venue="${venue.id}"`, {
        requestKey: null,
      });
    first = false; // ne esiste almeno uno
  } catch {
    first = true; // nessun altro → questo è il primo
  }

  /* 3. Calcola punti */
  const pts = calcCheckinPoints(venue as any, first, new Date(checkin.created));
  await pb.collection("checkins").update(checkin.id, {
    reward_points: pts,
  });

  /* 4. Registra la transazione punti */
  await pb.collection("points_transactions").create({
    user: userId,
    delta_points: pts,
    source_type: "checkin",
    checkin: checkin.id,
    comment: first ? "Primo check‑in" : "Check‑in",
  });

  return { pts, checkinId: checkin.id };
}
