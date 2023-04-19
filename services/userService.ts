import { Users, IUser } from "../models/user";
import { sign } from "jsonwebtoken";

export class UserService {
  public async registerUser(userData: IUser) {
    const user = new Users(userData);
    await user.save();

    const token = sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
    console.log(token)
    return { user, token };
  }
}

export const userService = new UserService();
