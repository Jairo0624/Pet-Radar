import { Point } from 'geojson';
import { Injectable } from '@nestjs/common';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';
import { UpdateLostPetDto } from './dto/update-lost-pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LostPet } from './entities/lost-pet.entity';
import { CacheService } from 'src/cache/cache.service';

const CACHE_KEY_ALL_LOST_PETS = "lost_pets:all";

@Injectable()
export class LostPetsService {

  constructor(
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,
    private readonly cacheService: CacheService,
  ) {}

  async findAll() {
    const cachedPets = await this.cacheService.get<LostPet[]>(CACHE_KEY_ALL_LOST_PETS);
    
    if (cachedPets && cachedPets.length > 0) {
      console.log('Retornando mascotas perdidas desde REDIS');
      return cachedPets;
    }

    console.log('🐘 Retornando mascotas perdidas desde POSTGRES');
    const pets = await this.lostPetRepository.find({
      where: { isActive: true },
      order: { lostDate: 'DESC' },
    });

    // 3. Los guardamos en Redis para la próxima vez
    await this.cacheService.set(CACHE_KEY_ALL_LOST_PETS, pets);
    
    return pets;
  }

  async create(createLostPetDto: CreateLostPetDto) {
    const { lat, lng, ...rest } = createLostPetDto;
    const location: any = { type: 'Point', coordinates: [lng, lat] };
    const newLostPet = this.lostPetRepository.create({ ...rest, location });
    const savedPet = await this.lostPetRepository.save(newLostPet);

    // 👇 
    await this.cacheService.delete(CACHE_KEY_ALL_LOST_PETS);

    return savedPet;
  }

  async findOne(id: number) {
    return await this.lostPetRepository.findOne({
      where: {
        id,
        isActive: true,
      },
    });
  }

  update(id: number, updateLostPetDto: UpdateLostPetDto) {
    return `This action updates a #${id} lostPet`;
  }

  remove(id: number) {
    return `This action removes a #${id} lostPet`;
  }
}
