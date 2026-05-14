import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';

@Global() // Con esto no tienes que importarlo en cada modulo individualmente
@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}