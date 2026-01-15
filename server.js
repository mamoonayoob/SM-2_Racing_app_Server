const express = require("express");
const db_Connection = require("./Config/DbConnection/db_Connection");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(express.json());
db_Connection();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
//Router import here
//auth routes 
const authRoutes=require("./Routes/authRoutes");
const eventRoutes=require("./Routes/eventRoutes");
const runGroupRoutes = require("./Routes/runGroupRoutes");
const submissionRoutes = require("./Routes/submissionRoutes");


//auth routes
app.use("/api/auth",authRoutes);
//event routes 
app.use("/api/event",eventRoutes)
//run Group 
app.use("/api/run-group", runGroupRoutes);
//submission
app.use("/api/submission", submissionRoutes);


app.get("/", (req, res) => {
  res.send("Hello World!");
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});