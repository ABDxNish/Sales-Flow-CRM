import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { ContactsModule } from './contacts/contacts.module';
import { LeadsModule } from './leads/leads.module';
import { DealsModule } from './deals/deals.module';
import { NotesModule } from './notes/notes.module';
import { ActivitiesModule } from './activities/activities.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { IntegrationsModule } from './integrations/integrations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (config: ConfigService) => {
        const databaseUrl =
          config.get<string>('DATABASE_URL');

        // Live Neon database
        if (databaseUrl) {
          return {
            type: 'postgres' as const,
            url: databaseUrl,

            ssl: {
              rejectUnauthorized: false,
            },

            autoLoadEntities: true,

            synchronize:
              config.get<string>('DB_SYNC', 'true') ===
              'true',
          };
        }

        // Local PostgreSQL
        return {
          type: 'postgres' as const,

          host: config.get<string>(
            'DB_HOST',
            'localhost',
          ),

          port: Number(
            config.get<string>('DB_PORT', '5432'),
          ),

          username: config.get<string>(
            'DB_USERNAME',
            'postgres',
          ),

          password: config.get<string>(
            'DB_PASSWORD',
            '',
          ),

          database: config.get<string>(
            'DB_NAME',
            'crm_sales_pipeline',
          ),

          autoLoadEntities: true,

          synchronize:
            config.get<string>('DB_SYNC', 'true') ===
            'true',
        };
      },
    }),

    IntegrationsModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    ContactsModule,
    DealsModule,
    LeadsModule,
    NotesModule,
    ActivitiesModule,
    NotificationsModule,
    DashboardModule,
  ],
})
export class AppModule {}