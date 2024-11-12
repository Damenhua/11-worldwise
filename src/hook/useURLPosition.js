import { useSearchParams } from "react-router-dom";

export function useURLPosition() {
  const [searchParams] = useSearchParams();
  const Lat = searchParams.get("lat");
  const Lng = searchParams.get("lng");

  return [Lat, Lng];
}
