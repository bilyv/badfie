
import { useDeviceType } from "./useDeviceType";

export function useIsMobile() {
  const deviceType = useDeviceType();
  return deviceType === "mobile";
}
