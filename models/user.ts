import { Schema, model, Document } from "mongoose";
import { hash } from "bcryptjs";

export interface IUser extends Document {
  email: string;
  password: string;
  role: "sponsor" | "proposer";
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["sponsor", "proposer"], required: true }
});

userSchema.pre("save", async function (this: IUser, next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 12);
  }
  next();
});
// const User = mongoose.model("User", userSchema);
export const Users = model<IUser>("Users", userSchema);
