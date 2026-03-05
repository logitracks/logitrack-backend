import { IsString, IsUUID } from 'class-validator';

export class CreateTrackingEventDto {
  @IsString()
  location: string;

  @IsString()
  message: string;

  @IsUUID()
  shipmentId: string;
}
