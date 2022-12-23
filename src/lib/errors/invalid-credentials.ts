export class InvalidCredentials extends Error {
  constructor(type: string, credential: string) {
    super(`Invalid ${type} credentials ${credential}`);
  }
}
