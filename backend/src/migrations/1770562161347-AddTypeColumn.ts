import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTypeColumn1770562161347 implements MigrationInterface {
    name = 'AddTypeColumn1770562161347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" ADD "type" character varying(20) NOT NULL DEFAULT 'task'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "type"`);
    }

}
