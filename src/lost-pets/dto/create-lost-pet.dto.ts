import { IsString, IsNotEmpty, IsOptional, IsEmail, IsNumber, IsBoolean, IsDateString } from 'class-validator';

export class CreateLostPetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  species: string;

  @IsString()
  @IsOptional()
  breed: string;

  @IsString()
  color: string;

  @IsString()
  size: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  photoUrl: string;

  @IsString()
  @IsNotEmpty()
  ownerName: string;

  @IsEmail()
  ownerEmail: string;

  @IsString()
  ownerPhone: string;

  @IsString()
  address: string;

  // El frontend mandará latitud y longitud por separado, 
  // en el backend lo convertiremos a un "Point" de PostGIS en el servicio.
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  lng: number;

  @IsDateString()
  lostDate: string;
}
