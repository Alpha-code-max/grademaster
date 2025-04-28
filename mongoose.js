import mongoose from "mongoose";

const connect = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("Already connected to MongoDB");
    return {
      coursesConnection: mongoose.connection.useDb("courses"),
      usersConnection: mongoose.connection.useDb("users"),
    };
  }

  await mongoose.connect(process.env.MONGO_URI); // Connect ONCE to server (no database name yet)
  console.log("Connected to MongoDB server");

  // Then use different databases
  const coursesConnection = mongoose.connection.useDb("courses");
  const usersConnection = mongoose.connection.useDb("users");

  console.log("Connected to Courses and Users DBs");

  return { coursesConnection, usersConnection };
};

export default connect;
