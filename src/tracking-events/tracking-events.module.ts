import { Module } from '@nestjs/common';
import { TrackingEventsService } from './tracking-events.service';
import { TrackingEventsController } from './tracking-events.controller';
import { ShipmentsModule } from '../shipments/shipments.module';

@Module({
  imports: [ShipmentsModule],
  controllers: [TrackingEventsController],
  providers: [TrackingEventsService],
  exports: [TrackingEventsService],
})
export class TrackingEventsModule {}
