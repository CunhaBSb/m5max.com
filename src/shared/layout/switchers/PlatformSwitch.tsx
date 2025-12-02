import { ReactNode } from 'react';
import { useIsDesktop } from '@/shared/hooks/useIsDesktop';

interface PlatformSwitchProps {
  desktop: ReactNode;
  mobile: ReactNode;
  fallback?: ReactNode; // Custom loading component
  breakpoint?: string; // For future extensibility
}

export const PlatformSwitch = ({ desktop, mobile }: PlatformSwitchProps) => {
  const isDesktop = useIsDesktop();

  // Renderiza mobile como safe-default até saber o breakpoint, evitando tela em branco
  if (isDesktop === null) {
    return <>{mobile}</>;
  }

  return <>{isDesktop ? desktop : mobile}</>;
};

export default PlatformSwitch;
