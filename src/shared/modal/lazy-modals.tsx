import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/shared/ui/dialog';

// Lazy load heavy modal components
const B2BFormComponent = lazy(() => import('./B2BForm'));
const ConversionModalComponent = lazy(() => import('./ConversionModal'));
const ContactModalComponent = lazy(() => import('./ContactModal'));
const QualificationFormComponent = lazy(() => import('./QualificationForm'));

// Loading fallback component for modals
const ModalFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center space-y-3">
      <Loader2 className="w-8 h-8 animate-spin text-fire-orange mx-auto" />
      <p className="text-sm text-muted-foreground">Carregando...</p>
    </div>
  </div>
);

// Lazy B2B Form
export const LazyB2BForm = (props: React.ComponentProps<typeof B2BFormComponent>) => (
  <Suspense fallback={<ModalFallback />}>
    <B2BFormComponent {...props} />
  </Suspense>
);

// Lazy Conversion Modal
export const LazyConversionModal = (props: React.ComponentProps<typeof ConversionModalComponent>) => {
  // Don't render anything if modal is not open to prevent unnecessary loading
  if (!props.isOpen) {
    return null;
  }
  
  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose}>
      <DialogContent className="max-w-md mx-auto">
        <Suspense fallback={<ModalFallback />}>
          <ConversionModalComponent {...props} />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
};

// Lazy Contact Modal
export const LazyContactModal = (props: React.ComponentProps<typeof ContactModalComponent>) => {
  if (!props.isOpen) {
    return null;
  }
  
  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose}>
      <DialogContent className="max-w-lg mx-auto">
        <Suspense fallback={<ModalFallback />}>
          <ContactModalComponent {...props} />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
};

// Lazy Qualification Form
export const LazyQualificationForm = (props: React.ComponentProps<typeof QualificationFormComponent>) => (
  <Suspense fallback={<ModalFallback />}>
    <QualificationFormComponent {...props} />
  </Suspense>
);

// Export all lazy components
export {
  LazyB2BForm as B2BForm,
  LazyConversionModal as ConversionModal,
  LazyContactModal as ContactModal,
  LazyQualificationForm as QualificationForm
};

// Default export for convenience
export default {
  B2BForm: LazyB2BForm,
  ConversionModal: LazyConversionModal,
  ContactModal: LazyContactModal,
  QualificationForm: LazyQualificationForm
};