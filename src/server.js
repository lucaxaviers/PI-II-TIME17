const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "funcionando",
  });
});

app.use(
  "/app",
  express.static(path.join(__dirname, "../frontend"))
);

app.listen(PORT, () => {
  console.log(`Servidor executando em http://localhost:${PORT}`);
});