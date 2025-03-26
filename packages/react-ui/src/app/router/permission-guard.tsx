import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { Permission } from '@activepieces/shared';

export const RoutePermissionGuard = ({
  permission,
  children,
}: {
  children: ReactNode;
  permission: Permission;
}) => {
  return children;
};
