import app from "./app.js";
import { connectToDatabase } from "./db/connections.js";

//connections and listeners
const PORT = process.env.PORT || 4020;
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => console.log("Server Open"));
  })
  .catch((err) => console.log(err));
