import Route from "./route";
import { Request, Response } from "express";
import UserRepository from "../api/user-repository";

export default class ApiUserRoute extends Route {
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    super();
    this.repository = repository;
  }

  public async process(req: Request, res: Response): Promise<void> {
    return undefined;
  }
}
