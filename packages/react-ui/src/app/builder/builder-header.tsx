import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { t } from 'i18next';
import { ChevronDown, History, Logs } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import {
  LeftSideBarType,
  useBuilderStateContext,
} from '@/app/builder/builder-hooks';
import { useEmbedding, useNewWindow } from '@/components/embed-provider';
import { Button } from '@/components/ui/button';
import EditableText from '@/components/ui/editable-text';
import { HomeButton } from '@/components/ui/home-button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { NEW_FLOW_QUERY_PARAM } from '@/lib/utils';
import {
  ApFlagId,
  FlowOperationType,
  FlowVersionState,
  Permission,
  supportUrl,
} from '@activepieces/shared';


export const BuilderHeader = () => {
  const [queryParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const openNewWindow = useNewWindow();
  const showSupport =  false;
  const isInRunsPage = useMemo(
    () => location.pathname.includes('/runs'),
    [location.pathname]
  );

  const [
    flow,
    flowVersion,
    setLeftSidebar,
    moveToFolderClientSide,
    applyOperation,
  ] = useBuilderStateContext((state) => [
    state.flow,
    state.flowVersion,
    state.setLeftSidebar,
    state.moveToFolderClientSide,
    state.applyOperation,
  ]);

  const { embedState } = useEmbedding();

  const isLatestVersion =
    flowVersion.state === FlowVersionState.DRAFT ||
    flowVersion.id === flow.publishedVersionId;
  const [isEditingFlowName, setIsEditingFlowName] = useState(false);
  useEffect(() => {
    setIsEditingFlowName(queryParams.get(NEW_FLOW_QUERY_PARAM) === 'true');
  }, []);
  return (
    <div className="bg-background select-none">
      <div className="relative items-center flex h-[55px] w-full p-4 bg-muted/30">
        <div className="grow"></div>
        <div className="flex items-center justify-center gap-4">
          
   

          {!isInRunsPage && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-2 px-2"
                  onClick={() => setLeftSidebar(LeftSideBarType.VERSIONS)}
                >
                  <History className="w-4 h-4" />
                  {t('Versions')}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {t('Versions History')}
              </TooltipContent>
            </Tooltip>
          )}

        </div>
      </div>
    </div>
  );
};
