import { IsString, IsNotEmpty, IsOptional, IsEmail, IsNumber, IsDateString } from 'class-validator';

export class CreateFoundPetDto {
  @IsString()
  @IsNotEmpty()
  species: string;

  @IsString()
  @IsOptional()
  breed: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  photoUrl: string;

  @IsString()
  @IsNotEmpty()
  finderName: string;

  @IsEmail()
  finderEmail: string;

  @IsString()
  @IsNotEmpty()
  finderPhone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  // Recibimos latitud y longitud por separado desde el frontend
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  lng: number;

  @IsDateString()
  foundDate: string;
}