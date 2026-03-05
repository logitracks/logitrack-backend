import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TrackingEventsService } from './tracking-events.service';
import { CreateTrackingEventDto } from './dto/create-tracking-event.dto';
import { UpdateTrackingEventDto } from './dto/update-tracking-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { User } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('tracking-events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrackingEventsController {
  constructor(private readonly trackingEventsService: TrackingEventsService) {}

  @Post()
  create(
    @Body() createTrackingEventDto: CreateTrackingEventDto,
    @CurrentUser() user: User,
  ) {
    return this.trackingEventsService.create(
      createTrackingEventDto,
      user.id,
      user.role,
    );
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.trackingEventsService.findAll(user.id, user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.trackingEventsService.findOne(id, user.id, user.role);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTrackingEventDto: UpdateTrackingEventDto,
    @CurrentUser() user: User,
  ) {
    return this.trackingEventsService.update(
      id,
      updateTrackingEventDto,
      user.id,
      user.role,
    );
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.trackingEventsService.remove(id, user.id, user.role);
  }
}
