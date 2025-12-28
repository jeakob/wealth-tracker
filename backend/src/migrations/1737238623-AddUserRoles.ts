import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRoles1737238623 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Rename email column to username
        await queryRunner.query(`
      ALTER TABLE users RENAME COLUMN email TO username;
    `);

        // Add role column with default 'user'
        await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('admin', 'user');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

        await queryRunner.query(`
      ALTER TABLE users 
      ADD COLUMN role user_role NOT NULL DEFAULT 'user';
    `);

        // Add is_active column with default true
        await queryRunner.query(`
      ALTER TABLE users 
      ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;
    `);

        // Add updated_at column
        await queryRunner.query(`
      ALTER TABLE users 
      ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE users DROP COLUMN updated_at;`);
        await queryRunner.query(`ALTER TABLE users DROP COLUMN is_active;`);
        await queryRunner.query(`ALTER TABLE users DROP COLUMN role;`);
        await queryRunner.query(`DROP TYPE IF EXISTS user_role;`);
        await queryRunner.query(`ALTER TABLE users RENAME COLUMN username TO email;`);
    }
}
