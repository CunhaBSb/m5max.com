import { ReactNode } from 'react';
import { useIsDesktop } from '@/shared/hooks/useIsDesktop';

interface PlatformSwitchProps {
  desktop: ReactNode;
  mobile: ReactNode;
}

/**
 * @deprecated Para páginas com lazy loading, use ConditionalLazy.
 *
 * PlatformSwitch deve ser usado APENAS para componentes não-lazy
 * (ex: Header, Footer, componentes inline).
 */
export const PlatformSwitch = ({ desktop, mobile }: PlatformSwitchProps) => {
  const isDesktop = useIsDesktop();
  return <>{isDesktop ? desktop : mobile}</>;
};

export default PlatformSwitch;
