import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsArray,
  IsNumber,
  Min,
} from 'class-validator';
import { ShipmentStatus } from '@prisma/client';

class CreateProductDto {
  @IsString()
  description: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsOptional()
  weight?: number;
}

class CreateTrackingEventDto {
  @IsString()
  location: string;

  @IsString()
  message: string;

  // timestamp sera automatiquement now()
}

export class CreateShipmentDto {
  @IsString()
  senderName: string;

  @IsString()
  @IsOptional()
  senderAddress?: string;

  @IsString()
  receiverName: string;

  @IsString()
  @IsOptional()
  receiverAddress?: string;

  @IsString()
  origin: string;

  @IsString()
  destination: string;

  @IsEnum(ShipmentStatus)
  @IsOptional()
  status?: ShipmentStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductDto)
  products: CreateProductDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTrackingEventDto)
  events?: CreateTrackingEventDto[];
}
