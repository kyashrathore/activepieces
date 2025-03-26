import { DefaultProjectRole } from '@activepieces/shared'
import { repoFactory } from '../../core/db/repo-factory'
import { system } from '../../helper/system/system'
import { DataSeed } from './data-seed'

// DO NOT CHANGE THESE IDS OR SHUFFLE THEM
const roleIds: Record<DefaultProjectRole, string> = {
    [DefaultProjectRole.ADMIN]: '461ueYHzMykyk5dIL8HzQ',
    [DefaultProjectRole.EDITOR]: 'sjWe85TwaFYxyhn2AgOha', 
    [DefaultProjectRole.OPERATOR]: '3Wl9IAw5aM0HLafHgMYkb',
    [DefaultProjectRole.VIEWER]: 'aJVBSSJ3YqZ7r1laFjM0a',
}

export const rolesSeed: DataSeed = {
    run: async () => {
        system.globalLogger().info({ name: 'rolesSeed' }, 'Seeding roles')
        for (const role of Object.values(DefaultProjectRole)) {
            const projectRole = {
                name: role,
                id: roleIds[role],
            }
            // await repoFactory('ProjectRoleEntity').upsert(projectRole, ['id'])
        }
    },
}