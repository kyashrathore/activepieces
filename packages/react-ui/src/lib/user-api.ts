import { UserWithMetaInformationAndProject } from '@activepieces/shared';

import { api } from './api';

export const userApi = {
  getCurrentUser() {
    return {
      id: '123',
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      platformRole: 'admin',
    } 
  },
};
