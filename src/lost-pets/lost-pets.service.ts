import { Point } from 'geojson';
import { Injectable } from '@nestjs/common';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';
import { UpdateLostPetDto } from './dto/update-lost-pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LostPet } from './entities/lost-pet.entity';

@Injectable()
export class LostPetsService {

  constructor(
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,
  ) {}

 async create(createLostPetDto: CreateLostPetDto) {
    // 1. Extraemos la latitud y longitud, y guardamos el resto de los datos en "rest"
    const { lat, lng, ...rest } = createLostPetDto;

    // 2. Creamos el objeto espacial (GeoJSON)
    // ¡REGLA DE ORO!: En mapas siempre va primero la Longitud (X) y luego la Latitud (Y)
    const location : Point = {
      type: 'Point',
      coordinates: [lng, lat], 
    };

    // 3. Preparamos el registro fusionando los datos de texto con nuestra nueva ubicación
    const newLostPet = this.lostPetRepository.create({
      ...rest,
      location,
    });

    // 4. Lo guardamos en la base de datos
    return await this.lostPetRepository.save(newLostPet);
  }
  findAll() {
    return `This action returns all lostPets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lostPet`;
  }

  update(id: number, updateLostPetDto: UpdateLostPetDto) {
    return `This action updates a #${id} lostPet`;
  }

  remove(id: number) {
    return `This action removes a #${id} lostPet`;
  }
}
