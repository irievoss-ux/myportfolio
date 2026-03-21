import VistaShell from '@/components/VistaShell';
import { VistaProfileProvider } from '@/components/providers/VistaProfileProvider';

export default function Page() {
  return (
    <VistaProfileProvider>
      <VistaShell />
    </VistaProfileProvider>
  );
}
