import { Repository, EntityManager, EntityTarget, FindOptionsWhere } from 'typeorm';

/**
 * A generic repository class that provides reusable database operations
 * for any entity in a TypeORM-based application.
 *
 * @template T - The entity type that this repository will manage.
 */
export class BaseRepository<T> {
  /** TypeORM repository instance for the given entity */
  private readonly repository: Repository<T>;

  /**
   * Constructor initializes the repository with the specified entity and manager.
   *
   * @param _entity - The target entity that this repository will manage.
   * @param _manager - The TypeORM entity manager for handling database operations.
   */
  constructor(
    private readonly _entity: EntityTarget<T>,
    private readonly _manager: EntityManager
  ) {
    this.repository = this._manager.getRepository(this._entity);
  }

  /**
   * Finds a single record based on multiple fields.
   *
   * @param conditions - An object containing field-value pairs to search by.
   * @returns The entity if found, otherwise `null`.
   */
  async findOneByFields(conditions: Partial<T>): Promise<T | null> {
    const where: FindOptionsWhere<T>[] = Object.entries(conditions).map(
      ([key, value]) => ({ [key]: value }) as FindOptionsWhere<T>
    );

    return this.repository.findOne({ where });
  }

  /**
   * Retrieves all records of the entity.
   *
   * @returns An array of all entities found in the database.
   */
  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  /**
   * Saves a new entity or updates an existing one in the database.
   *
   * @param entity - The entity to be saved.
   * @returns The saved entity with any updated fields (e.g., generated ID).
   */
  async saveEntity(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  /**
   * Removes an entity from the database.
   *
   * @param entity - The entity to be removed.
   * @returns The removed entity.
   */
  async removeEntity(entity: T): Promise<T> {
    return this.repository.remove(entity);
  }
}
