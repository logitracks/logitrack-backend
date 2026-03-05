import { IsString, IsNumber, IsOptional, Min, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsString()
  description: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsUUID()
  shipmentId: string;
}
