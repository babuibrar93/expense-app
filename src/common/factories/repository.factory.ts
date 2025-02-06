import { EntityManager, EntityTarget } from 'typeorm';
import { BaseRepository } from '../repositories/base.repository';

export function createRepository<T>(
  entity: EntityTarget<T>,
  entityManager: EntityManager,
  customMethods: Record<string, any> = {}
): BaseRepository<T> {
  const baseRepo = new BaseRepository<T>(entity, entityManager);

  return Object.assign(baseRepo, customMethods);
}
