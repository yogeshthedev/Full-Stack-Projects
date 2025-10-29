import mongoose from "mongoose";

function connectToDb() {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("Connected to db");
    })
    .catch((err) => {
      console.error("Error while connecting to db", err.message);
    });
}

export default connectToDb;
