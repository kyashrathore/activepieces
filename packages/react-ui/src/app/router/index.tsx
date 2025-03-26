import { useMemo } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { PageTitle } from '@/app/components/page-title';

import { AppConnectionsPage } from '../routes/connections';

const routes = [
  {
    path: '/connections',
    element: (
      <PageTitle title="Connections">
        <AppConnectionsPage />
      </PageTitle>
    ),
  },
];
const ApRouter = () => {
  const router = useMemo(() => {
    return createBrowserRouter(routes);
  }, []);

  return <RouterProvider router={router}></RouterProvider>;
};

export { ApRouter };
