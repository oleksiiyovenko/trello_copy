import { Toaster } from 'sonner';
import { ModalProvider } from '@/components/providers/modal-provider';
import { QueryProvider } from '@/components/providers/query-provider';

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <Toaster expand={true} />
      <ModalProvider />
      {children}
    </QueryProvider>
  );
};

export default PlatformLayout;
