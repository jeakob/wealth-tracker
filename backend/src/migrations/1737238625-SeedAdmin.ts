import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedAdmin1737238625 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Hash the default admin password
        const password = 'Admin123!';
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Check if admin user already exists
        const existingAdmin = await queryRunner.query(`
      SELECT id FROM users WHERE username = 'admin';
    `);

        if (existingAdmin.length === 0) {
            // Create default admin user
            await queryRunner.query(`
        INSERT INTO users (username, password_hash, role, is_active, created_at, updated_at)
        VALUES ('admin', '${hashedPassword}', 'admin', true, NOW(), NOW());
      `);

            console.log('Default admin user created with username: admin');
        } else {
            console.log('Admin user already exists, skipping seed');
        }

        // Associate all existing data with the admin user
        const adminUser = await queryRunner.query(`
      SELECT id FROM users WHERE username = 'admin';
    `);

        if (adminUser.length > 0) {
            const adminId = adminUser[0].id;

            // Update investments
            await queryRunner.query(`
        UPDATE investments SET user_id = ${adminId} WHERE user_id IS NULL;
      `);

            // Update assets if table exists
            const assetsTableExists = await queryRunner.query(`
        SELECT table_name FROM information_schema.tables WHERE table_name='assets';
      `);
            if (assetsTableExists.length > 0) {
                await queryRunner.query(`
          UPDATE assets SET user_id = ${adminId} WHERE user_id IS NULL;
        `);
            }

            // Update bank_accounts if table exists
            const bankAccountsTableExists = await queryRunner.query(`
        SELECT table_name FROM information_schema.tables WHERE table_name='bank_accounts';
      `);
            if (bankAccountsTableExists.length > 0) {
                await queryRunner.query(`
          UPDATE bank_accounts SET user_id = ${adminId} WHERE user_id IS NULL;
        `);
            }

            // Update liabilities if table exists
            const liabilitiesTableExists = await queryRunner.query(`
        SELECT table_name FROM information_schema.tables WHERE table_name='liabilities';
      `);
            if (liabilitiesTableExists.length > 0) {
                await queryRunner.query(`
          UPDATE liabilities SET user_id = ${adminId} WHERE user_id IS NULL;
        `);
            }

            // Update net_worth_snapshots
            await queryRunner.query(`
        UPDATE net_worth_snapshots SET user_id = ${adminId} WHERE user_id IS NULL;
      `);

            console.log('Associated all existing data with admin user');
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM users WHERE username = 'admin';`);
    }
}
