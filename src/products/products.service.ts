import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ShipmentsService } from '../shipments/shipments.service';
import { Role } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private shipmentsService: ShipmentsService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    userId: string,
    userRole: Role,
  ) {
    // Vérifier que l'expédition existe et que l'utilisateur a le droit d'y ajouter un produit
    await this.shipmentsService.findOne(
      createProductDto.shipmentId,
      userId,
      userRole,
    );
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll(userId: string, userRole: Role) {
    if (userRole === Role.ADMIN) {
      return this.prisma.product.findMany({
        include: { shipment: true },
      });
    } else {
      // Retourner les produits des expéditions de l'utilisateur
      return this.prisma.product.findMany({
        where: {
          shipment: {
            userId,
          },
        },
        include: { shipment: true },
      });
    }
  }

  async findOne(id: string, userId: string, userRole: Role) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { shipment: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (userRole !== Role.ADMIN && product.shipment.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    userId: string,
    userRole: Role,
  ) {
    await this.findOne(id, userId, userRole);
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string, userId: string, userRole: Role) {
    await this.findOne(id, userId, userRole);
    return this.prisma.product.delete({ where: { id } });
  }
}
