// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
export type DayPeriod = "morning" | "afternoon" | "evening";

export interface VenueFactors {
  base_points: number; // 1
  factor_frequency: number; // 10 | 12 | 15
  factor_risk?: number; // 1.0 – 1.5  (default 1)
  factor_distribution?: number; // 1.0 – 1.5  (default 1)
}

const TIME_FACTOR: Record<DayPeriod, number> = {
  morning: 1.0,
  afternoon: 1.2,
  evening: 1.5,
};

export function periodOfDay(d = new Date()): DayPeriod {
  const h = d.getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

/**
 * Calcola i punti per un check‑in.
 *
 * Formula:
 *   base_points *
 *   factor_frequency *
 *   factor_risk *
 *   factor_distribution *
 *   timeFactor +
 *   bonusPrimaVolta(10)
 */
export function calcCheckinPoints(
  v: VenueFactors,
  isFirst: boolean,
  date: Date = new Date(),
): number {
  const timeMul = TIME_FACTOR[periodOfDay(date)];
  const risk = v.factor_risk ?? 1;
  const distr = v.factor_distribution ?? 1;

  const body = v.base_points * v.factor_frequency * risk * distr * timeMul;
  const bonus = isFirst ? 10 : 0;

  return Math.round(body + bonus);
}
