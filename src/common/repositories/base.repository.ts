import { Request } from 'express';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ENTITY_MANAGER_KEY } from '../constants/basic.constant';

/**
 * A generic repository class that provides reusable database operations
 * for any entity in a TypeORM-based application.
 *
 * @template T - The entity type that this repository will manage.
 */
export class BaseRepository<T> {
  /**
   * Constructor initializes the repository with the specified entity and manager.
   *
   * @param entity - The target entity that this repository will manage.
   * @param manager - The TypeORM entity manager for handling database operations.
   */
  constructor(
    private dataSource: DataSource,
    private request: Request
  ) {}

  protected getRepository<T>(entityCls: new () => T): Repository<T> {
    const entityManager: EntityManager =
      this.request[ENTITY_MANAGER_KEY] ?? this.dataSource.manager;
    return entityManager.getRepository(entityCls);
  }
}
