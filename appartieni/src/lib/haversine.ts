export const haversine = (
  [lat1, lon1]: [number, number], // punto A
  {
    lat: lat2,
    lon: lon2,
  }: // punto B
  { lat: number; lon: number }, // (puoi anche passare [lat,lon] con overload)
): number => {
  const R = 6371; // raggio medio terrestre in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // km
};

const toRad = (deg: number) => (deg * Math.PI) / 180;
