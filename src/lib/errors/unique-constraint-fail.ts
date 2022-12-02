export class UniqueConstraintFail extends Error {
  constructor(uniqueId: string) {
    super(`Unique constraint failed at ${uniqueId}`);
  }
}
