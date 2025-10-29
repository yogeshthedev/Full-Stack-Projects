import dotenv from "dotenv";
import app from "./src/app.js";
import connectToDb from "./src/config/db.js";
dotenv.config();

const port = process.env.PORT;
connectToDb()
app.listen(port, () => {
  console.log("Server running on port ", port);
});
