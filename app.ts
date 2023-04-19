import express, { Request, Response } from "express";
// import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
// import authRoutes from "./routes/authRoutes";
// import sponsorRoutes from "./routes/sponsorRoutes";
// import proposerRoutes from "./routes/proposerRoutes";

import { userRouter } from './routes/User.route'

const app = express()



app.use(express.json());
app.use(cookieParser());

app.use("/users", userRoutes);
// app.use("/auth", authRoutes);
// app.use("/sponsors", sponsorRoutes);
// app.use("/proposers", proposerRoutes);
app.use('/profile', userRouter)


app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// comment asynchronous operations that weren't stopped in your tests
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });




export default app