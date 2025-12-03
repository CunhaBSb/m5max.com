import { ReactNode } from 'react';
import { useIsDesktop } from '@/shared/hooks/useIsDesktop';

interface PlatformSwitchProps {
  desktop: ReactNode;
  mobile: ReactNode;
  fallback?: ReactNode; // Custom loading component
  breakpoint?: string; // For future extensibility
}

const DefaultFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="h-10 w-10 rounded-full border-2 border-white/20 border-t-fire-orange animate-spin" />
  </div>
);

export const PlatformSwitch = ({ desktop, mobile, fallback }: PlatformSwitchProps) => {
  const isDesktop = useIsDesktop();

  if (isDesktop === null) {
    return <>{fallback ?? <DefaultFallback />}</>;
  }

  return <>{isDesktop ? desktop : mobile}</>;
};

export default PlatformSwitch;
