import { t } from 'i18next';
import { LogOut, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';


import { useEmbedding } from '../../components/embed-provider';
import { Separator } from '../../components/ui/separator';

export const Header = () => {
  const history = useLocation();
  const isInPlatformAdmin = history.pathname.startsWith('/platform');
  const { embedState } = useEmbedding();

  return (
    !embedState.isEmbedded && (
      <div>
        <div className="flex h-[60px] items-center">
          {isInPlatformAdmin && (
            <span className="text-3xl font-bold px-4 py-2">
              {t('Platform Admin')}
            </span>
          )}
          <div className="grow"></div>
          <div className="flex items-center justify-center gap-4">
        
          </div>
        </div>
        <Separator className="mt-1" />
      </div>
    )
  );
};
