import mongoose from "mongoose";
import connect from "@/mongoose.js";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateJoined: { type: Date, default: Date.now },
});

async function getUserModel() {
  const { usersConnection } = await connect(); // Notice usersConnection

  const User = usersConnection.models.User || usersConnection.model("User", userSchema);
  return User;
}

export default getUserModel;
