import { MigrationInterface, QueryRunner } from 'typeorm';

export class AssociateDataWithUsers1737238624 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add user_id to investments table (already has it, but ensure it's there)
        const investmentsHasUserId = await queryRunner.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='investments' AND column_name='user_id';
    `);

        if (investmentsHasUserId.length === 0) {
            await queryRunner.query(`
        ALTER TABLE investments 
        ADD COLUMN user_id INTEGER REFERENCES users(id);
      `);
        }

        // Add user_id to assets table (if it exists)
        const assetsTableExists = await queryRunner.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name='assets';
    `);

        if (assetsTableExists.length > 0) {
            const assetsHasUserId = await queryRunner.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='assets' AND column_name='user_id';
      `);

            if (assetsHasUserId.length === 0) {
                await queryRunner.query(`
          ALTER TABLE assets 
          ADD COLUMN user_id INTEGER REFERENCES users(id);
        `);
            }
        }

        // Add user_id to bank_accounts table (if it exists)
        const bankAccountsTableExists = await queryRunner.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name='bank_accounts';
    `);

        if (bankAccountsTableExists.length > 0) {
            const bankAccountsHasUserId = await queryRunner.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='bank_accounts' AND column_name='user_id';
      `);

            if (bankAccountsHasUserId.length === 0) {
                await queryRunner.query(`
          ALTER TABLE bank_accounts 
          ADD COLUMN user_id INTEGER REFERENCES users(id);
        `);
            }
        }

        // Add user_id to liabilities table (if it exists)
        const liabilitiesTableExists = await queryRunner.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name='liabilities';
    `);

        if (liabilitiesTableExists.length > 0) {
            const liabilitiesHasUserId = await queryRunner.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='liabilities' AND column_name='user_id';
      `);

            if (liabilitiesHasUserId.length === 0) {
                await queryRunner.query(`
          ALTER TABLE liabilities 
          ADD COLUMN user_id INTEGER REFERENCES users(id);
        `);
            }
        }

        // Add user_id to net_worth_snapshots table
        const netWorthHasUserId = await queryRunner.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='net_worth_snapshots' AND column_name='user_id';
    `);

        if (netWorthHasUserId.length === 0) {
            await queryRunner.query(`
        ALTER TABLE net_worth_snapshots 
        ADD COLUMN user_id INTEGER REFERENCES users(id);
      `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Note: This doesn't remove user_id from investments as it was already there
        await queryRunner.query(`ALTER TABLE assets DROP COLUMN IF EXISTS user_id;`);
        await queryRunner.query(`ALTER TABLE bank_accounts DROP COLUMN IF EXISTS user_id;`);
        await queryRunner.query(`ALTER TABLE liabilities DROP COLUMN IF EXISTS user_id;`);
    }
}
