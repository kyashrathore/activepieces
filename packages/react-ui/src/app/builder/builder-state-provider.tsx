import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  BuilderInitialState,
  BuilderStateContext,
  BuilderStore,
  createBuilderStore,
} from '@/app/builder/builder-hooks';
import { NEW_FLOW_QUERY_PARAM } from '@/lib/utils';
type BuilderStateProviderProps = React.PropsWithChildren<BuilderInitialState>;

export function BuilderStateProvider({
  children,
  sampleData,
  sampleDataInput,
  ...props
}: BuilderStateProviderProps) {
  const storeRef = useRef<BuilderStore>();
  const [queryParams] = useSearchParams();
  if (!storeRef.current) {
    storeRef.current = createBuilderStore(
      {
        ...props,
        readonly: false,
        sampleData,
        sampleDataInput,
      },
      queryParams.get(NEW_FLOW_QUERY_PARAM) === 'true',
    );
  }
  return (
    <BuilderStateContext.Provider value={storeRef.current}>
      {children}
    </BuilderStateContext.Provider>
  );
}
