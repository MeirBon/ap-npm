import { Request } from "express";
import { Response } from "express-serve-static-core";

export default abstract class Route {
  public abstract async process(req: Request, res: Response): Promise<void>;
}
