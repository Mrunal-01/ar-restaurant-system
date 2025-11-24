// api/index.js
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const dishesRoutes = require("./routes/dishes");
const ordersRoutes = require("./routes/orders");
const uploadsRoutes = require("./routes/uploads");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/ping", (req, res) => res.json({ success: true }));

// Versioned API
app.use("/api/v1/dishes", dishesRoutes);
app.use("/api/v1/orders", ordersRoutes);
app.use("/api/v1/uploads", uploadsRoutes);

module.exports = serverless(app);
