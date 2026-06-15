import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const TarefaController = {
  // 1. LISTAR TAREFAS (GET)
  listar: async (req, res) => {
    try {
      const tarefas = await prisma.task.findMany({
        include: { category: true }
      });
      res.json(tarefas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 2. BUSCAR POR ID (GET /tarefas/:id) - 👈 ADICIONADO PARA CORRIGIR O CRASH
  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const tarefa = await prisma.task.findUnique({
        where: { id: Number(id) },
        include: { category: true }
      });

      if (!tarefa) {
        return res.status(404).json({ error: "Tarefa não encontrada" });
      }

      res.json(tarefa);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 3. CRIAR TAREFA (POST)
  criar: async (req, res) => {
    try {
      const { titulo, descricao } = req.body;
      const novaTarefa = await prisma.task.create({
        data: {
          title: titulo,
          description: descricao || "",
          completed: false
        }
      });
      res.status(201).json(novaTarefa);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 4. ATUALIZAR TAREFA (PUT)
  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { titulo, concluida } = req.body;
      const tarefaAtualizada = await prisma.task.update({
        where: { id: Number(id) },
        data: {
          title: titulo,
          completed: concluida
        }
      });
      res.json(tarefaAtualizada);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 5. EXCLUIR TAREFA (DELETE)
  excluir: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.task.delete({
        where: { id: Number(id) }
      });
      res.json({ mensagem: "Tarefa excluída!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

// Exportação padrão para bater com o seu router
export default TarefaController;