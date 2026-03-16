import { Test, TestingModule } from '@nestjs/testing';
import { LostPetsController } from './lost-pets.controller';
import { LostPetsService } from './lost-pets.service';

describe('LostPetsController', () => {
  let controller: LostPetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LostPetsController],
      providers: [LostPetsService],
    }).compile();

    controller = module.get<LostPetsController>(LostPetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
