import {
    AppConnection,
    AppConnectionStatus,
} from '@activepieces/shared'
import { EntitySchema } from 'typeorm'
import {
    ARRAY_COLUMN_TYPE,
    BaseColumnSchemaPart,
    isPostgres,
    JSONB_COLUMN_TYPE,
} from '../database/database-common'
import { EncryptedObject } from '../helper/encryption'

export type AppConnectionSchema = Omit<AppConnection, 'value'> & {
    value: EncryptedObject
}

export const AppConnectionEntity = new EntitySchema<AppConnectionSchema>({
    name: 'app_connection',
    columns: {
        ...BaseColumnSchemaPart,
        displayName: {
            type: String,
        },
        externalId: {
            type: String,
        },
        type: {
            type: String,
        },
        status: {
            type: String,
            default: AppConnectionStatus.ACTIVE,
        },
        platformId: {
            type: String,
            nullable: true,
        },
        pieceName: {
            type: String,
        },
        ownerId: {
            type: String,
            nullable: true,
        },
        projectIds: {
            type: ARRAY_COLUMN_TYPE,
            array: isPostgres(),
            nullable: true,
        },
        scope: {
            type: String,
        },
        value: {
            type: JSONB_COLUMN_TYPE,
        },
    },
    indices: [
        {
            name: 'idx_app_connection_project_ids_and_external_id',
            columns: ['projectIds', 'externalId'],
        },
        {
            name: 'idx_app_connection_platform_id',
            columns: ['platformId'],
        },
        {
            name: 'idx_app_connection_owner_id',
            columns: ['ownerId'],
        },
    ],
    // Removed owner relation as the user entity is not defined
})
