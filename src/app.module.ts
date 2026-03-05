import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { ProductsModule } from './products/products.module';
import { TrackingEventsModule } from './tracking-events/tracking-events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ShipmentsModule,
    ProductsModule,
    TrackingEventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
