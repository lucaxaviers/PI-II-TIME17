import { Request, Response, Router } from "express";
import { comentarios, demandas, usuarios } from "../data";

const router = Router();

function idDaDemanda(req: Request): string {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

router.get("/demandas/:id", (req: Request, res: Response) => {
  const id = idDaDemanda(req);
  const demanda = demandas.find((item) => item.id === id);

  if (!demanda) {
    res.status(404).json({
      erro: "Demanda não encontrada.",
    });
    return;
  }

  res.status(200).json(demanda);
});

router.get("/demandas/:id/comentarios", (req: Request, res: Response) => {
  const id = idDaDemanda(req);
  const demandaExiste = demandas.some((item) => item.id === id);

  if (!demandaExiste) {
    res.status(404).json({
      erro: "Demanda não encontrada.",
    });
    return;
  }

  res.status(200).json(
    comentarios.filter((comentario) => comentario.demandaId === id),
  );
});

router.post("/demandas/:id/comentarios", (req: Request, res: Response) => {
  const id = idDaDemanda(req);
  const demandaExiste = demandas.some((item) => item.id === id);

  if (!demandaExiste) {
    res.status(404).json({
      erro: "Demanda não encontrada.",
    });
    return;
  }

  const texto =
    typeof req.body?.texto === "string" ? req.body.texto.trim() : "";
  const usuarioId = req.body?.usuarioId;

  if (!texto) {
    res.status(400).json({
      erro: "O texto do comentário é obrigatório.",
    });
    return;
  }

  if (
    typeof usuarioId !== "number" ||
    !usuarios.some((usuario) => usuario.id === usuarioId)
  ) {
    res.status(400).json({
      erro: "O usuário informado não existe.",
    });
    return;
  }

  const novoComentario = {
    id: comentarios.length + 1,
    demandaId: id,
    usuarioId,
    texto,
    criadoEm: new Date().toISOString(),
  };

  comentarios.push(novoComentario);

  res.status(201).json(novoComentario);
});

export default router;
