export class EntityNotFound extends Error {
  constructor(entity: string, id: number) {
    super(`The ${entity} was not found: ${id}`);
  }
}
