import { Injectable } from '@nestjs/common';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';
import { UpdateFoundPetDto } from './dto/update-found-pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoundPet } from './entities/found-pet.entity';
import { LostPet } from '../lost-pets/entities/lost-pet.entity';
import { Point } from 'geojson';
import { EmailService } from 'src/email/email.service';
import { CacheService } from 'src/cache/cache.service';

const CACHE_KEY_ALL_FOUND_PETS = "found_pets:all";

@Injectable()
export class FoundPetsService {

  constructor(
    @InjectRepository(FoundPet)
    private readonly foundPetRepository: Repository<FoundPet>,
    
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,
    private readonly emailService: EmailService,
    private readonly cacheService: CacheService
  ) {}

  async create(createFoundPetDto: CreateFoundPetDto) {
    const { lat, lng, ...rest } = createFoundPetDto;

    const location: Point = {
      type: 'Point',
      coordinates: [lng, lat],
    };
    const newFoundPet = this.foundPetRepository.create({
      ...rest,
      location,
    });
    const savedPet = await this.foundPetRepository.save(newFoundPet);

    await this.cacheService.delete(CACHE_KEY_ALL_FOUND_PETS);

    // Usamos .query() para mandar SQL puro a la base de datos
    const matches = await this.lostPetRepository.query(
      `
      SELECT *,
        ST_X(location::geometry) AS lost_lon,
        ST_Y(location::geometry) AS lost_lat,
        ST_Distance(
          location,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) AS distance
      FROM lost_pets
      WHERE is_active = true
        AND ST_DWithin(
          location,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          500
        )
      ORDER BY distance ASC;
      `,
      [lng, lat]
    );

    if (matches.length > 0) {
      for (const match of matches) {
        this.emailService.sendMatchNotification(
          match.owner_email,
          match,             
          savedPet,          
          match.distance,    
          match.lost_lon, 
          match.lost_lat,  
          lng,         
          lat          
        ).catch(error => {
          console.error('Error enviando el correo:', error);
        });
      }
    }

    return {
      message: 'Mascota encontrada registrada con éxito.',
      savedPet,
      possibleMatches: matches, // Resultados del Radar
    };
  }

  async findAll() {
    const cachedPets = await this.cacheService.get<FoundPet[]>(CACHE_KEY_ALL_FOUND_PETS);
    
    if (cachedPets && cachedPets.length > 0) {
      console.log('🐾 Retornando mascotas encontradas desde REDIS');
      return cachedPets;
    }

    console.log('🐘 Retornando mascotas encontradas desde POSTGRES');
    const pets = await this.foundPetRepository.find({
      // Si tienes una columna de fecha, descomenta esto para ordenarlos:
      // order: { id: 'DESC' }, 
    });

    await this.cacheService.set(CACHE_KEY_ALL_FOUND_PETS, pets);
    
    return pets;
  }

  findOne(id: number) {
    return this.foundPetRepository.findOne({
      where: {
        id,
      },
    });
  }

  update(id: number, updateFoundPetDto: UpdateFoundPetDto) {
    return `This action updates a #${id} foundPet`;
  }

  remove(id: number) {
    return `This action removes a #${id} foundPet`;
  }
}
