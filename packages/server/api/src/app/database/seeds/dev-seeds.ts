import { ApEnvironment } from '@activepieces/shared'
import { system } from '../../helper/system/system'
import { databaseConnection } from '../database-connection'
import { DataSeed } from './data-seed'
import { AppSystemProp } from '@activepieces/server-shared'

const log = system.globalLogger()

const currentEnvIsNotDev = (): boolean => {
    const env = system.get(AppSystemProp.ENVIRONMENT)
    return env !== ApEnvironment.DEVELOPMENT
}

const seedDevUser = async (): Promise<void> => {
    const DEV_EMAIL = 'dev@ap.com'
    const DEV_PASSWORD = '12345678'

    log.info({ name: 'seedDevUser' }, `email=${DEV_EMAIL} pass=${DEV_PASSWORD}`)
}

const seedDevData = async (): Promise<void> => {
    if (currentEnvIsNotDev()) {
        log.info({ name: 'seedDevData' }, 'skip: not in development environment')
        return
    }

    await seedDevUser()
}

export const devDataSeed: DataSeed = {
    run: seedDevData,
}
