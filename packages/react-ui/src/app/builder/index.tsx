import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { ImperativePanelHandle } from 'react-resizable-panels';

import {
  LeftSideBarType,
  RightSideBarType,
  useBuilderStateContext,
} from '@/app/builder/builder-hooks';
import { DataSelector } from '@/app/builder/data-selector';
import { CanvasControls } from '@/app/builder/flow-canvas/canvas-controls';
import { StepSettingsProvider } from '@/app/builder/step-settings/step-settings-context';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable-panel';
import { piecesHooks } from '@/features/pieces/lib/pieces-hook';
import {
  ActionType,
  PieceTrigger,
  TriggerType,
  WebsocketClientEvent,
  flowStructureUtil,
  isNil,
} from '@activepieces/shared';

import { cn, useElementSize } from '../../lib/utils';

import { BuilderHeader } from './builder-header';
import { FlowCanvas } from './flow-canvas';

import { StepSettingsContainer } from './step-settings';

const minWidthOfSidebar = 'min-w-[max(20vw,400px)]';
const animateResizeClassName = `transition-all duration-200`;

const useAnimateSidebar = (
  sidebarValue: LeftSideBarType | RightSideBarType
) => {
  const handleRef = useRef<ImperativePanelHandle>(null);
  const sidebarClosed = [LeftSideBarType.NONE, RightSideBarType.NONE].includes(
    sidebarValue
  );
  useEffect(() => {
    const sidebarSize = handleRef.current?.getSize() ?? 0;
    if (sidebarClosed) {
      handleRef.current?.resize(0);
    } else if (sidebarSize === 0) {
      handleRef.current?.resize(25);
    }
  }, [handleRef, sidebarValue, sidebarClosed]);
  return handleRef;
};

const constructContainerKey = (
  flowId: string,
  stepName: string,
  triggerOrActionName?: string
) => {
  return flowId + stepName + (triggerOrActionName ?? '');
};
const BuilderPage = () => {

  const [
    setRun,
    flowVersion,
    leftSidebar,
    rightSidebar,
    run,
    canExitRun,
    selectedStep,
  ] = useBuilderStateContext((state) => [
    state.setRun,
    state.flowVersion,
    state.leftSidebar,
    state.rightSidebar,
    state.run,
    state.canExitRun,
    state.selectedStep,
  ]);

  const { memorizedSelectedStep, containerKey } = useBuilderStateContext(
    (state) => {
      const flowVersion = state.flowVersion;
      if (isNil(state.selectedStep) || isNil(flowVersion)) {
        return {
          memorizedSelectedStep: undefined,
          containerKey: undefined,
        };
      }
      const step = flowStructureUtil.getStep(
        state.selectedStep,
        flowVersion.trigger
      );
      const triggerOrActionName =
        step?.type === TriggerType.PIECE
          ? (step as PieceTrigger).settings.triggerName
          : step?.settings.actionName;
      return {
        memorizedSelectedStep: step,
        containerKey: constructContainerKey(
          state.flow.id,
          state.selectedStep,
          triggerOrActionName
        ),
      };
    }
  );
  const middlePanelRef = useRef<HTMLDivElement>(null);
  const middlePanelSize = useElementSize(middlePanelRef);
  const [isDraggingHandle, setIsDraggingHandle] = useState(false);
  const rightHandleRef = useAnimateSidebar(rightSidebar);
  const leftHandleRef = useAnimateSidebar(leftSidebar);
  const leftSidePanelRef = useRef<HTMLDivElement>(null);
  const rightSidePanelRef = useRef<HTMLDivElement>(null);

  const { versions, refetch: refetchPiece } =
    piecesHooks.useMostRecentAndExactPieceVersion({
      name: memorizedSelectedStep?.settings.pieceName,
      version: memorizedSelectedStep?.settings.pieceVersion,
      enabled:
        memorizedSelectedStep?.type === ActionType.PIECE ||
        memorizedSelectedStep?.type === TriggerType.PIECE,
    });

  const pieceModel = versions
    ? versions[memorizedSelectedStep?.settings.pieceVersion || '']
    : undefined;

  const [hasCanvasBeenInitialised, setHasCanvasBeenInitialised] =
    useState(false);

  return (
    <div className="flex h-screen w-screen flex-col relative">
      <div className="z-50">
        <BuilderHeader />
      </div>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          id="left-sidebar"
          defaultSize={0}
          minSize={0}
          maxSize={39}
          order={1}
          ref={leftHandleRef}
          className={cn('min-w-0 bg-background z-20', {
            [minWidthOfSidebar]: leftSidebar !== LeftSideBarType.NONE,
            [animateResizeClassName]: !isDraggingHandle,
          })}
        >
          <div ref={leftSidePanelRef} className="w-full h-full">
          </div>
        </ResizablePanel>
        <ResizableHandle
          disabled={leftSidebar === LeftSideBarType.NONE}
          withHandle={leftSidebar !== LeftSideBarType.NONE}
          onDragging={setIsDraggingHandle}
          className="z-20"
        />

        <ResizablePanel defaultSize={100} order={2} id="flow-canvas">
          <div ref={middlePanelRef} className="relative h-full w-full">
            <div className="absolute left-0 top-0 h-full w-full z-10 "></div>
            <FlowCanvas
              setHasCanvasBeenInitialised={setHasCanvasBeenInitialised}
              lefSideBarContainerWidth={
                leftSidePanelRef.current?.clientWidth || 0
              }
            ></FlowCanvas>
            {middlePanelRef.current &&
              middlePanelRef.current.clientWidth > 0 && (
                <CanvasControls
                  canvasHeight={middlePanelRef.current?.clientHeight ?? 0}
                  canvasWidth={middlePanelRef.current?.clientWidth ?? 0}
                  hasCanvasBeenInitialised={hasCanvasBeenInitialised}
                  selectedStep={selectedStep}
                ></CanvasControls>
              )}

            <DataSelector
              parentHeight={middlePanelSize.height}
              parentWidth={middlePanelSize.width}
            ></DataSelector>
          </div>
        </ResizablePanel>

        <>
          <ResizableHandle
            disabled={rightSidebar === RightSideBarType.NONE}
            withHandle={rightSidebar !== RightSideBarType.NONE}
            onDragging={setIsDraggingHandle}
            className="z-50"
          />

          <ResizablePanel
            ref={rightHandleRef}
            id="right-sidebar"
            defaultSize={0}
            minSize={0}
            maxSize={60}
            order={3}
            className={cn('min-w-0 bg-background z-30', {
              [minWidthOfSidebar]: rightSidebar !== RightSideBarType.NONE,
              [animateResizeClassName]: !isDraggingHandle,
            })}
          >
            <div ref={rightSidePanelRef} className="h-full w-full">
              {rightSidebar === RightSideBarType.PIECE_SETTINGS &&
                memorizedSelectedStep && (
                  <StepSettingsProvider
                    pieceModel={pieceModel}
                    selectedStep={memorizedSelectedStep}
                    key={
                      containerKey +
                      (pieceModel?.name ?? '') +
                      memorizedSelectedStep.type
                    }
                  >
                    <StepSettingsContainer />
                  </StepSettingsProvider>
                )}
            </div>
          </ResizablePanel>
        </>
      </ResizablePanelGroup>
    </div>
  );
};

BuilderPage.displayName = 'BuilderPage';
export { BuilderPage };
