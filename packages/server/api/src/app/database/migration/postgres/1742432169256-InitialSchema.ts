import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialSchema1742432169256 implements MigrationInterface {
    name = 'InitialSchema1742432169256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "app_connection" (
                "id" character varying(21) NOT NULL,
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                "displayName" character varying NOT NULL,
                "externalId" character varying,
                "type" character varying NOT NULL,
                "status" character varying NOT NULL DEFAULT 'ACTIVE',
                "platformId" character varying,
                "pieceName" character varying NOT NULL,
                "ownerId" character varying,
                "projectIds" text,
                "scope" character varying NOT NULL DEFAULT 'PROJECT',
                "value" text NOT NULL,
                CONSTRAINT "CHK_app_connection_status" CHECK ("status" IN ('ACTIVE', 'MISSING', 'ERROR')),
                CONSTRAINT "CHK_app_connection_scope" CHECK ("scope" IN ('PROJECT', 'PLATFORM')),
                CONSTRAINT "PK_app_connection" PRIMARY KEY ("id")
            )
        `)

        await queryRunner.query(`
            CREATE TABLE "piece_metadata" (
                "id" character varying(21) NOT NULL,
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                "authors" text NOT NULL,
                "displayName" character varying NOT NULL,
                "logoUrl" character varying NOT NULL,
                "projectUsage" integer NOT NULL DEFAULT 0,
                "description" character varying,
                "projectId" character varying,
                "platformId" character varying,
                "version" character varying NOT NULL,
                "minimumSupportedRelease" character varying NOT NULL,
                "maximumSupportedRelease" character varying NOT NULL,
                "auth" text,
                "actions" text NOT NULL,
                "triggers" text NOT NULL,
                "pieceType" character varying NOT NULL,
                "categories" text,
                CONSTRAINT "PK_piece_metadata" PRIMARY KEY ("id")
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "app_connection"
        `)
        await queryRunner.query(`
            DROP TABLE "piece_metadata"
        `)
    }
} 