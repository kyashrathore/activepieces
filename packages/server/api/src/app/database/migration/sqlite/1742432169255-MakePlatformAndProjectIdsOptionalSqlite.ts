import { MigrationInterface, QueryRunner } from 'typeorm'

export class MakePlatformAndProjectIdsOptionalSqlite1742432169255 implements MigrationInterface {
    name = 'MakePlatformAndProjectIdsOptionalSqlite1742432169255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // SQLite doesn't support ALTER TABLE to modify column constraints
        // We need to recreate the table with the new schema
        await queryRunner.query(`
            CREATE TABLE "app_connection_new" (
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

        // Copy data from old table to new table
        await queryRunner.query(`
            INSERT INTO "app_connection_new" 
            SELECT * FROM "app_connection"
        `)

        // Drop old table
        await queryRunner.query(`
            DROP TABLE "app_connection"
        `)

        // Rename new table to original name
        await queryRunner.query(`
            ALTER TABLE "app_connection_new" RENAME TO "app_connection"
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Recreate table with non-nullable columns
        await queryRunner.query(`
            CREATE TABLE "app_connection_new" (
                "id" varchar(21) PRIMARY KEY NOT NULL,
                "created" datetime NOT NULL DEFAULT (datetime('now')),
                "updated" datetime NOT NULL DEFAULT (datetime('now')),
                "displayName" varchar NOT NULL,
                "externalId" varchar NOT NULL,
                "type" varchar NOT NULL,
                "status" varchar CHECK("status" IN ('ACTIVE', 'MISSING', 'ERROR')) NOT NULL DEFAULT 'ACTIVE',
                "platformId" varchar NOT NULL,
                "pieceName" varchar NOT NULL,
                "ownerId" varchar NOT NULL,
                "projectIds" text NOT NULL,
                "scope" varchar CHECK("scope" IN ('PROJECT', 'PLATFORM')) NOT NULL DEFAULT 'PROJECT',
                "value" text NOT NULL
            )
        `)

        // Copy data from current table to new table
        await queryRunner.query(`
            INSERT INTO "app_connection_new" 
            SELECT * FROM "app_connection"
        `)

        // Drop current table
        await queryRunner.query(`
            DROP TABLE "app_connection"
        `)

        // Rename new table to original name
        await queryRunner.query(`
            ALTER TABLE "app_connection_new" RENAME TO "app_connection"
        `)
    }
} 