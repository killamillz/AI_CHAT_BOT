import { connect, disconnect } from "mongoose";

async function connectToDatabase() {
  try {
    await connect(process.env.MONGODB_URL);
    console.log("connected to database");
  } catch (error) {
    console.log(error);
    throw new Error("Cannot Connect To Mongodb");
  }
}

async function disconnectFromDatabase() {
  try {
    await disconnect();
  } catch (error) {
    console.log(error);
    throw new Error("Cannot Connect To Mongodb");
  }
}

export { connectToDatabase, disconnectFromDatabase };
