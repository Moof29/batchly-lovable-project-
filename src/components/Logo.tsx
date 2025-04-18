
import { LogoIcon } from '@/components/LogoIcon';

export const Logo = () => {
  return (
    <div className="flex items-center space-x-3 px-4 pt-4 pb-2">
      <LogoIcon className="h-10 w-10" />
      <h2 className="text-xl font-bold text-foreground">Batchly</h2>
    </div>
  );
};
