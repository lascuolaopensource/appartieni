import { Capacitor } from "@capacitor/core";
import { Geolocation, Position } from "@capacitor/geolocation";

/** Returns a Position object no matter the platform */
export async function getCurrentLocation(
  opts: { highAccuracy?: boolean; timeout?: number } = {},
): Promise<Position> {
  const { highAccuracy = true, timeout = 10000 } = opts;

  const platform = Capacitor.getPlatform(); // 'ios' | 'android' | 'web'

  /* ---------- Native: use Capacitor plugin with permission flow ---------- */
  if (platform === "ios" || platform === "android") {
    // ask for fine / coarse permission once
    const perm = await Geolocation.checkPermissions();
    if (perm.location !== "granted") {
      const res = await Geolocation.requestPermissions({
        permissions: ["coarseLocation"],
      });
      if (res.location !== "granted")
        throw new Error("Location permission denied");
    }

    return Geolocation.getCurrentPosition({
      enableHighAccuracy: highAccuracy,
      timeout,
    });
  }

  /* ---------- Web: use browser API ---------- */
  return new Promise<Position>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      (err) => reject(err),
      { enableHighAccuracy: highAccuracy, timeout },
    );
  });
}
