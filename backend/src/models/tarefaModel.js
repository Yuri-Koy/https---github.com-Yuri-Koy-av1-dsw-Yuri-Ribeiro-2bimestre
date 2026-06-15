// ========================================
// MODEL - CAMADA DE DADOS COM PRISMA
// ========================================
// Esta camada é responsável por:
// - Realizar operações CRUD no banco de dados usando Prisma
// - Implementar a lógica de negócio

import { prisma } from "../config/prisma.js";

/**
 * Lista todas as tarefas
 * @returns {Promise<Array>} - Array com todas as tarefas
 */
export async function listar() {
  try {
    const tarefas = await prisma.task.findMany({
      include: {
        category: true
      }
    });
    return tarefas;
  } catch (error) {
    console.error("Erro ao listar tarefas:", error);
    throw error;
  }
}

/**
 * Busca uma tarefa pelo ID
 * @param {number} id - ID da tarefa
 * @returns {Promise<Object|null>} - A tarefa encontrada ou null
 */
export async function buscarPorId(id) {
  try {
    const tarefa = await prisma.task.findUnique({
      where: { id },
      include: {
        category: true
      }
    });
    return tarefa;
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    console.error("Erro ao buscar tarefa por ID:", error);
    throw error;
  }
}

/**
 * Cria uma nova tarefa
 * @param {string} title - Título da tarefa (obrigatório)
 * @param {string} description - Descrição da tarefa (opcional)
 * @param {number} categoryId - ID da categoria (opcional)
 * @returns {Promise<Object>} - A tarefa criada
 */
export async function criar(title, description = null, categoryId = null) {
  try {
    const novaTarefa = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        categoryId: categoryId
      },
      include: {
        category: true
      }
    });
    return novaTarefa;
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    throw error;
  }
}

/**
 * Atualiza uma tarefa parcialmente
 * @param {number} id - ID da tarefa
 * @param {Object} dados - Dados a atualizar (title, description, completed, categoryId)
 * @returns {Promise<Object|null>} - A tarefa atualizada ou null se não encontrar
 */
export async function atualizar(id, dados) {
  try {
    const tarefaAtualizada = await prisma.task.update({
      where: { id },
      data: {
        ...(dados.title !== undefined && { title: dados.title.trim() }),
        ...(dados.description !== undefined && {
          description: dados.description ? dados.description.trim() : null
        }),
        ...(dados.completed !== undefined && { completed: dados.completed }),
        ...(dados.categoryId !== undefined && { categoryId: dados.categoryId })
      },
      include: {
        category: true
      }
    });
    return tarefaAtualizada;
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    console.error("Erro ao atualizar tarefa:", error);
    throw error;
  }
}

/**
 * Exclui uma tarefa pelo ID
 * @param {number} id - ID da tarefa
 * @returns {Promise<Object|null>} - A tarefa removida ou null se não encontrar
 */
export async function excluir(id) {
  try {
    const tarefaRemovida = await prisma.task.delete({
      where: { id },
      include: {
        category: true
      }
    });
    return tarefaRemovida;
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    console.error("Erro ao excluir tarefa:", error);
    throw error;
  }
}