export class InvalidType extends Error {
  constructor(type: string) {
    super(`Invalid log type: ${type}`);
  }
}
