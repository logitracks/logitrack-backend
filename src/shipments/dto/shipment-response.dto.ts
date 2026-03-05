import { Product, TrackingEvent, ShipmentStatus } from '@prisma/client';

export class ShipmentResponseDto {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderAddress?: string;
  receiverName: string;
  receiverAddress?: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  createdAt: Date;
  updatedAt: Date;
  products: Product[];
  events: TrackingEvent[];
  userId: string;
}
