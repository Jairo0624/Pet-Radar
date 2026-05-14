import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
    private readonly redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
    });

    // Le agregamos un TTL (tiempo de vida) de 60 segundos por defecto
    async set(key: string, value: any, ttlSeconds: number = 60) {
        const json = JSON.stringify(value);
        await this.redis.set(key, json, 'EX', ttlSeconds);
    }

    async get<T>(key: string): Promise<T | null> {
        const data = await this.redis.get(key);
        if (!data) return null;
        return JSON.parse(data) as T;
    }

    async delete(key: string) {
        await this.redis.del(key);
    }
}