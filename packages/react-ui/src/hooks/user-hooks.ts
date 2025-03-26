import { QueryClient, useSuspenseQuery } from '@tanstack/react-query';


import { userApi } from '@/lib/user-api';
import { UserWithMetaInformationAndProject } from '@activepieces/shared';

export const userHooks = {
  useCurrentUser: () => {
    const userId = 'sfds'
    const token = 'sfdsd'
    const expired = ''
    return {
      id: userId,
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      platformRole: 'admin',
    }
  },
  invalidateCurrentUser: (queryClient: QueryClient) => {
    const userId = 'fadsf'
    queryClient.invalidateQueries({ queryKey: ['currentUser', userId] });
  },
  getCurrentUserPlatformRole: () => {
    const user = userHooks.useCurrentUser();
    return user?.platformRole;
  },
};
