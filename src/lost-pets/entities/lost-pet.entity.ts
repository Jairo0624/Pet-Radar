import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import type { Point } from 'typeorm';

@Entity('lost_pets') // Nombre exacto de la tabla en la base de datos
export class LostPet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  species: string;

  @Column({ type: 'varchar' })
  breed: string;

  @Column({ type: 'varchar' })
  color: string;

  @Column({ type: 'varchar' })
  size: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', nullable: true, name: 'photo_url' })
  photoUrl: string;

  @Column({ type: 'varchar', name: 'owner_name' })
  ownerName: string;

  @Column({ type: 'varchar', name: 'owner_email' })
  ownerEmail: string;

  @Column({ type: 'varchar', name: 'owner_phone' })
  ownerPhone: string;

  // CONFIGURACIÓN ESPACIAL 
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326, // estándar para coordenadas GPS (Latitud/Longitud)
  })
  location: Point;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'timestamp', name: 'lost_date' })
  lostDate: Date;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}