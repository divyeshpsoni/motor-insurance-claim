// Import packages
import express from "express";
import dotenv from "dotenv";

// imports
import connectDB from "./src/utils/connect.js";
import routes from "./src/routes/index.js";

// Load environmental variable
dotenv.config();

// Initialize App
const app = express();

// Parse json requests
app.use(express.json());

// Serve static files from the `uploads` folder
app.use("/uploads", express.static(path.join("src/uploads")));

// PORT
const PORT = process.env.PORT || 5000;

// Lister server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port: ${PORT}`);
});

// routes
routes.forEach(({ path, route }) => {
  app.use(`/api${path}`, route);
});
