import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <Toaster expand={true} />
      {children}
    </ClerkProvider>
  );
};

export default PlatformLayout;
