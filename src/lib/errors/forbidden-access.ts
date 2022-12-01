export class ForbiddenAccess extends Error {
  constructor(userId: number, entityId: number, entity: string) {
    super(`User ${userId} has no access to ${entity}@${entityId}`);
  }
}
