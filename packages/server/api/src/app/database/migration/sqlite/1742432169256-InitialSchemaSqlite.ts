import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialSchemaSqlite1742432169256 implements MigrationInterface {
    name = 'InitialSchemaSqlite1742432169256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "app_connection" (
                "id" varchar(21) PRIMARY KEY NOT NULL,
                "created" datetime NOT NULL DEFAULT (datetime('now')),
                "updated" datetime NOT NULL DEFAULT (datetime('now')),
                "displayName" varchar NOT NULL,
                "externalId" varchar,
                "type" varchar NOT NULL,
                "status" varchar CHECK("status" IN ('ACTIVE', 'MISSING', 'ERROR')) NOT NULL DEFAULT 'ACTIVE',
                "platformId" varchar,
                "pieceName" varchar NOT NULL,
                "ownerId" varchar,
                "projectIds" text,
                "scope" varchar CHECK("scope" IN ('PROJECT', 'PLATFORM')) NOT NULL DEFAULT 'PROJECT',
                "value" text NOT NULL
            )
        `)

        await queryRunner.query(`
            CREATE TABLE "piece_metadata" (
                "id" varchar(21) PRIMARY KEY NOT NULL,
                "created" datetime NOT NULL DEFAULT (datetime('now')),
                "updated" datetime NOT NULL DEFAULT (datetime('now')),
                "name" varchar NOT NULL,
                "authors" text NOT NULL,
                "displayName" varchar NOT NULL,
                "logoUrl" varchar NOT NULL,
                "projectUsage" integer NOT NULL DEFAULT 0,
                "description" varchar,
                "projectId" varchar,
                "platformId" varchar,
                "version" varchar NOT NULL,
                "minimumSupportedRelease" varchar NOT NULL,
                "maximumSupportedRelease" varchar NOT NULL,
                "auth" text,
                "actions" text NOT NULL,
                "triggers" text NOT NULL,
                "pieceType" varchar NOT NULL,
                "categories" text
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