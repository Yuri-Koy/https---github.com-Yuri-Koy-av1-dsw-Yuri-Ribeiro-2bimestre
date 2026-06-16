import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// 1. LISTAR TAREFAS (GET /tasks)
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await prisma.tarefa.findMany();
    
   // Substitua aquela linha por esta (com o underline ligando as palavras):
const tarefas_formatadas = tasks.map(t => ({
  id: t.id,
  title: t.descricao || "",
  completed: t.concluida || false
}));

    res.json(tarefas_formatadas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar tarefas no banco." });
  }
});

// 2. CRIAR TAREFA (POST /tasks)
router.post("/tasks", async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ erro: "O título da tarefa é obrigatório." });
  }

  try {
    const novaTarefa = await prisma.tarefa.create({
      data: {
        descricao: title,
        concluida: false
      }
    });

    res.status(201).json({
      id: novaTarefa.id,
      title: novaTarefa.descricao,
      completed: novaTarefa.concluida
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao salvar tarefa no banco." });
  }
});

// 3. ATUALIZAR STATUS/TEXTO (PUT /tasks/:id)
router.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  try {
    const tarefaAtualizada = await prisma.tarefa.update({
      where: { id: Number(id) },
      data: {
        descricao: title,
        concluida: completed
      }
    });

    res.json({
      id: tarefaAtualizada.id,
      title: tarefaAtualizada.descricao,
      completed: tarefaAtualizada.concluida
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atualizar tarefa." });
  }
});

// 4. DELETAR TAREFA (DELETE /tasks/:id)
router.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.tarefa.delete({
      where: { id: Number(id) }
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao deletar tarefa." });
  }
});

export default router;