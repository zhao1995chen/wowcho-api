import { Request, Response } from "express";
import { userService } from "../services/userService";

export class UserController {
  public async registerUser(req: Request, res: Response) {
    try {
      const result = await userService.registerUser(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
