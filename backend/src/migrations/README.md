# Database Migrations

This directory contains TypeORM migrations for the Wealth Tracker application.

## Running Migrations

Migrations are automatically run when the backend starts up if `synchronize: true` is set in the TypeORM configuration. However, for production deployments, you should:

1. Set `synchronize: false` in `backend/src/modules/app.module.ts`
2. Run migrations manually using:

```bash
# From the backend directory
npm run typeorm migration:run

# Or using Docker
docker-compose exec backend npm run typeorm migration:run
```

## Current Migrations

### 1737238623-AddUserRoles.ts
- Renames `email` column to `username` in users table
- Adds `role` enum column ('admin' | 'user')
- Adds `is_active` boolean for soft deletes
- Adds `updated_at` timestamp

### 1737238624-AssociateDataWithUsers.ts
- Adds `user_id` foreign key to all data tables (assets, bank_accounts, liabilities, investments, net_worth_snapshots)
- Enables data isolation per user

### 1737238625-SeedAdmin.ts
- Creates default admin user with credentials:
  - Username: `admin`
  - Password: `Admin123!`
- Associates all existing data with the admin user

## Important Notes

⚠️ **First-Time Setup**: When running the application for the first time with authentication:

1. The migrations will automatically run (if synchronize is true)
2. A default admin user will be created
3. All existing data will be associated with the admin user
4. **You should change the admin password immediately after first login**

⚠️ **Production Deployment**: 
- Change the JWT_SECRET in your environment variables
- Change the default admin password
- Set `synchronize: false` in production
- Run migrations manually before deploying new code

## Creating New Migrations

```bash
# Generate a new migration
npm run typeorm migration:generate -- -n MigrationName

# Create an empty migration
npm run typeorm migration:create -- -n MigrationName
```
