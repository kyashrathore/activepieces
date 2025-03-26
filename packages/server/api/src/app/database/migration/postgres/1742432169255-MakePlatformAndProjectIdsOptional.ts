import { MigrationInterface, QueryRunner } from 'typeorm'

export class MakePlatformAndProjectIdsOptional1742432169255 implements MigrationInterface {
    name = 'MakePlatformAndProjectIdsOptional1742432169255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "app_connection" 
            ALTER COLUMN "platformId" DROP NOT NULL,
            ALTER COLUMN "projectIds" DROP NOT NULL
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "app_connection" 
            ALTER COLUMN "platformId" SET NOT NULL,
            ALTER COLUMN "projectIds" SET NOT NULL
        `)
    }
} 