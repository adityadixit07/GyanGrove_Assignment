const express = require("express");
const dotenv = require("dotenv");
const EventRoutes = require("./routes/EventRoutes");
dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/events", EventRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
