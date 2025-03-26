import { PieceMetadataModel } from '@activepieces/pieces-framework'
import {
    ApId,
    BaseModel,
} from '@activepieces/shared'
import { EntitySchema } from 'typeorm'
import {
    ApIdSchema,
    ARRAY_COLUMN_TYPE,
    BaseColumnSchemaPart,
    COLLATION,
    isPostgres,
    JSON_COLUMN_TYPE,
} from '../database/database-common'


type PieceMetadataSchemaWithRelations = PieceMetadataSchema

export type PieceMetadataSchema = BaseModel<ApId> & PieceMetadataModel

export const PieceMetadataEntity =
  new EntitySchema<PieceMetadataSchemaWithRelations>({
      name: 'piece_metadata',
      columns: {
          ...BaseColumnSchemaPart,
          name: {
              type: String,
              nullable: false,
          },
          authors: {
              type: ARRAY_COLUMN_TYPE,
              nullable: false,
              array: isPostgres(),
          },
          displayName: {
              type: String,
              nullable: false,
          },
          logoUrl: {
              type: String,
              nullable: false,
          },
          projectUsage: {
              type: Number,
              nullable: false,
              default: 0,
          },
          description: {
              type: String,
              nullable: true,
          },
          projectId: {
              type: String,
              nullable: true,
          },
          platformId: {
              type: String,
              nullable: true,
          },
          version: {
              type: String,
              nullable: false,
              collation: COLLATION,
          },
          minimumSupportedRelease: {
              type: String,
              nullable: false,
              collation: COLLATION,
          },
          maximumSupportedRelease: {
              type: String,
              nullable: false,
              collation: COLLATION,
          },
          auth: {
              type: JSON_COLUMN_TYPE,
              nullable: true,
          },
          actions: {
              type: JSON_COLUMN_TYPE,
              nullable: false,
          },
          triggers: {
              type: JSON_COLUMN_TYPE,
              nullable: false,
          },
          pieceType: {
              type: String,
              nullable: false,
          },
          categories: {
              type: ARRAY_COLUMN_TYPE,
              nullable: true,
              array: isPostgres(),
          },
          packageType: {
              type: String,
              nullable: false,
          },
          archiveId: {
              ...ApIdSchema,
              nullable: true,
          },
      },
      indices: [
          {
              name: 'idx_piece_metadata_name_project_id_version',
              columns: ['name', 'version', 'projectId'],
              unique: true,
          },
      ],
      // Removed relations to non-existent entities
  })
