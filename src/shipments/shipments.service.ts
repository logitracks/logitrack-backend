import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { generateTrackingNumber } from '../common/utils/tracking-generator';
import { Role } from '@prisma/client';

@Injectable()
export class ShipmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createShipmentDto: CreateShipmentDto, userId: string) {
    const trackingNumber = generateTrackingNumber();
    // On utilise une transaction pour créer le shipment et ses relations
    return this.prisma.$transaction(async (prisma) => {
      const shipment = await prisma.shipment.create({
        data: {
          trackingNumber,
          senderName: createShipmentDto.senderName,
          senderAddress: createShipmentDto.senderAddress,
          receiverName: createShipmentDto.receiverName,
          receiverAddress: createShipmentDto.receiverAddress,
          origin: createShipmentDto.origin,
          destination: createShipmentDto.destination,
          status: createShipmentDto.status,
          userId,
          products: {
            create: createShipmentDto.products,
          },
          events: createShipmentDto.events
            ? {
                create: createShipmentDto.events,
              }
            : undefined,
        },
        include: {
          products: true,
          events: true,
        },
      });
      return shipment;
    });
  }

  async findAll(userId: string, role: Role) {
    if (role === Role.ADMIN) {
      // Admin voit tous les shipments
      return this.prisma.shipment.findMany({
        include: {
          products: true,
          events: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // Utilisateur normal ne voit que ses propres shipments
      return this.prisma.shipment.findMany({
        where: { userId },
        include: {
          products: true,
          events: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }
  }

  async findOne(id: string, userId: string, role: Role) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id },
      include: {
        products: true,
        events: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });
    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }
    // Vérifier les droits : admin ou propriétaire
    if (role !== Role.ADMIN && shipment.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return shipment;
  }

  async findByTrackingNumber(trackingNumber: string) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { trackingNumber },
      include: {
        products: true,
        events: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });
    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }
    return shipment;
  }

  async update(
    id: string,
    updateShipmentDto: UpdateShipmentDto,
    userId: string,
    role: Role,
  ) {
    // Vérifier l'existence et les droits
    await this.findOne(id, userId, role);

    // On extrait les champs non gérés ici pour les ignorer intentionnellement
    const { products, events, ...shipmentData } = updateShipmentDto;
    void products; // indique à ESLint que c'est volontaire
    void events; // indique à ESLint que c'est volontaire

    return this.prisma.shipment.update({
      where: { id },
      data: shipmentData,
      include: {
        products: true,
        events: true,
      },
    });
  }

  async remove(id: string, userId: string, role: Role) {
    await this.findOne(id, userId, role);
    return this.prisma.shipment.delete({ where: { id } });
  }
}
