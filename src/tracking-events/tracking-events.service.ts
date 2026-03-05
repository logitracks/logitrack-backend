import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrackingEventDto } from './dto/create-tracking-event.dto';
import { UpdateTrackingEventDto } from './dto/update-tracking-event.dto';
import { ShipmentsService } from '../shipments/shipments.service';
import { Role } from '@prisma/client';

@Injectable()
export class TrackingEventsService {
  constructor(
    private prisma: PrismaService,
    private shipmentsService: ShipmentsService,
  ) {}

  async create(
    createTrackingEventDto: CreateTrackingEventDto,
    userId: string,
    userRole: Role,
  ) {
    // Vérifier que l'expédition existe et que l'utilisateur a le droit d'ajouter un événement
    await this.shipmentsService.findOne(
      createTrackingEventDto.shipmentId,
      userId,
      userRole,
    );
    return this.prisma.trackingEvent.create({
      data: createTrackingEventDto,
    });
  }

  async findAll(userId: string, userRole: Role) {
    if (userRole === Role.ADMIN) {
      return this.prisma.trackingEvent.findMany({
        include: { shipment: true },
        orderBy: { timestamp: 'desc' },
      });
    } else {
      // Retourner les événements des expéditions de l'utilisateur
      return this.prisma.trackingEvent.findMany({
        where: {
          shipment: {
            userId,
          },
        },
        include: { shipment: true },
        orderBy: { timestamp: 'desc' },
      });
    }
  }

  async findOne(id: string, userId: string, userRole: Role) {
    const event = await this.prisma.trackingEvent.findUnique({
      where: { id },
      include: { shipment: true },
    });
    if (!event) {
      throw new NotFoundException('Tracking event not found');
    }
    if (userRole !== Role.ADMIN && event.shipment.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return event;
  }

  async update(
    id: string,
    updateTrackingEventDto: UpdateTrackingEventDto,
    userId: string,
    userRole: Role,
  ) {
    await this.findOne(id, userId, userRole);
    return this.prisma.trackingEvent.update({
      where: { id },
      data: updateTrackingEventDto,
    });
  }

  async remove(id: string, userId: string, userRole: Role) {
    await this.findOne(id, userId, userRole);
    return this.prisma.trackingEvent.delete({ where: { id } });
  }
}
