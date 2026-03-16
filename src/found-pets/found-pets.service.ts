import { Injectable } from '@nestjs/common';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';
import { UpdateFoundPetDto } from './dto/update-found-pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoundPet } from './entities/found-pet.entity';
import { LostPet } from '../lost-pets/entities/lost-pet.entity';
import { Point } from 'geojson';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class FoundPetsService {

  constructor(
    @InjectRepository(FoundPet)
    private readonly foundPetRepository: Repository<FoundPet>,
    
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,
    private readonly emailService: EmailService,
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

  findAll() {
    return `This action returns all foundPets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} foundPet`;
  }

  update(id: number, updateFoundPetDto: UpdateFoundPetDto) {
    return `This action updates a #${id} foundPet`;
  }

  remove(id: number) {
    return `This action removes a #${id} foundPet`;
  }
}
