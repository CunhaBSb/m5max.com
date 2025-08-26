import { ReactNode } from 'react';
import { useIsDesktop } from '@/shared/hooks/useIsDesktop';

interface PlatformSwitchProps {
  desktop: ReactNode;
  mobile: ReactNode;
  breakpoint?: string; // For future extensibility
}

export const PlatformSwitch = ({ desktop, mobile, breakpoint }: PlatformSwitchProps) => {
  const isDesktop = useIsDesktop();
  
  // During SSR/hydration, return null to prevent mismatch
  if (isDesktop === null) {
    return null;
  }
  
  return <>{isDesktop ? desktop : mobile}</>;
};

export default PlatformSwitch;