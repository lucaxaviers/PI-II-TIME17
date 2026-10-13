
import express, { Request, Response } from "express";
import path from "path";
import usuariosRoutes from "./routes/usuarios";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/app", express.static(path.join(__dirname, "../frontend")));

// Rotas de login e usuarios (Reuniao 4)
app.use(usuariosRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "funcionando",
  });
});

app.get("/login", (_req: Request, res: Response) => {
  res.redirect("/app/pages/login.html");
});

app.get("/cadastro", (_req: Request, res: Response) => {
  res.redirect("/app/pages/cadastro_usuario.html");
});

app.get("/demandas", (_req: Request, res: Response) => {
  res.redirect("/app/pages/lista_demandas.html");
});

app.get("/dashboard", (_req: Request, res: Response) => {
  res.redirect("/app/pages/dashboard.html");
});

app.listen(PORT, () => {
  console.log(`Servidor executando em http://localhost:${PORT}`);
});