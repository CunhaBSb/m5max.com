import { ReactNode } from 'react';
import { useIsDesktop } from '@/shared/hooks/useIsDesktop';

interface PlatformSwitchProps {
  desktop: ReactNode;
  mobile: ReactNode;
  fallback?: ReactNode; // Custom loading component
  breakpoint?: string; // For future extensibility
}

export const PlatformSwitch = ({ desktop, mobile, fallback, breakpoint }: PlatformSwitchProps) => {
  const isDesktop = useIsDesktop();
  
  // During SSR/hydration, show fallback or default loading
  if (isDesktop === null) {
    return fallback ? <>{fallback}</> : (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto border-2 border-fire-orange/30 border-t-fire-orange rounded-full animate-spin" />
        </div>
      </div>
    );
  }
  
  return <>{isDesktop ? desktop : mobile}</>;
};

export default PlatformSwitch;