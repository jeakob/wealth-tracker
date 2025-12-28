import { Module, OnModuleInit } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
})
export class SeedModule implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async onModuleInit() {
        await this.seedAdminUser();
    }

    private async seedAdminUser() {
        try {
            // Check if admin user exists
            const existingAdmin = await this.userRepository.findOne({
                where: { username: 'admin' },
            });

            if (!existingAdmin) {
                console.log('Creating default admin user...');

                const password = 'Admin123!';
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);

                const admin = this.userRepository.create({
                    username: 'admin',
                    password_hash: hashedPassword,
                    role: UserRole.ADMIN,
                    is_active: true,
                });

                await this.userRepository.save(admin);
                console.log('✅ Default admin user created successfully');
                console.log('   Username: admin');
                console.log('   Password: Admin123!');
                console.log('   ⚠️  Please change this password after first login!');
            } else {
                console.log('Admin user already exists');
            }
        } catch (error) {
            console.error('Error seeding admin user:', error);
        }
    }
}
