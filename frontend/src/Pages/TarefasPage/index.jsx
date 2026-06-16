import React, { useState, useEffect } from 'react';
import api from "../../services/api";

export default function TaskFlow() {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editandoId, setEditandoId] = useState(null);
  const [textoEditando, setTextoEditando] = useState('');

  // 1. LISTAR TAREFAS (GET)
  const carregarTarefas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // O Axios usa o caminho relativo baseado na baseURL configurada em services/api
      const response = await api.get("/tasks");
      
      // No Axios, os dados vindos do backend ficam sempre em .data
      setTarefas(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.erro || 'Erro ao buscar dados do backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTarefas();
  }, []);

  // 2. CRIAR TAREFA (POST)
  const adicionarTarefa = async (e) => {
    e.preventDefault();
    if (!novaTarefa.trim()) return;

    try {
      // Enviando direto pelo Axios (ele já converte para JSON de forma automática)
      await api.post("/tasks", {
        title: novaTarefa,
        descricao: ""
      });

      setNovaTarefa('');
      carregarTarefas(); // Recarrega a lista para trazer a nova tarefa do banco
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao adicionar tarefa.');
    }
  };

  // 3. ALTERAR STATUS (CONCLUÍDA / PENDENTE)
  const alternarConclusao = async (id, tituloAtual, statusAtual) => {
    try {
      await api.put(`/tasks/${id}`, {
        title: tituloAtual,
        completed: !statusAtual,
      });
      
      carregarTarefas();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao atualizar status.');
    }
  };

  // 4. DELETAR TAREFA (DELETE)
  const deletarTarefa = async (id) => {
    if (!confirm('Deseja realmente excluir esta tarefa?')) return;

    try {
      await api.delete(`/tasks/${id}`);
      carregarTarefas();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao excluir tarefa.');
    }
  };

  // 5. SALVAR EDIÇÃO DE TEXTO
  const salvarEdicao = async (id, statusAtual) => {
    if (!textoEditando.trim()) return;

    try {
      await api.put(`/tasks/${id}`, {
        title: textoEditando,
        completed: statusAtual,
      });
      
      setEditandoId(null);
      setTextoEditando('');
      carregarTarefas();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao editar tarefa.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-6 font-sans">
      <div className="w-full max-w-2xl bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 mt-10">
        
        <h1 className="text-3xl font-extrabold text-center text-indigo-400 mb-2">Lista de Tarefas</h1>
        <p className="text-slate-400 text-center text-sm mb-6">Cadastre tarefas no frontend e visualize no MySQL.</p>

        {/* FORMULÁRIO DE CADASTRO */}
        <form onSubmit={adicionarTarefa} className="flex gap-2 mb-6">
          <input
            type="text"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-500"
            placeholder="Digite uma nova tarefa..."
            value={novaTarefa}
            onChange={(e) => setNovaTarefa(e.target.value)}
          />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
            Salvar
          </button>
        </form>

        {/* CONTAINER DE TAREFAS */}
        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tarefas Cadastradas</h2>
            <span className="bg-slate-800 text-indigo-400 text-xs font-bold px-2.5 py-1 rounded-full">{tarefas.length}</span>
          </div>

          {/* STATUS DA REQUISIÇÃO */}
          {loading && <p className="text-center text-slate-500 py-4 text-sm animate-pulse">Carregando tarefas...</p>}
          
          {error && (
            <div className="flex items-center justify-center gap-2 bg-red-950/30 border border-red-900/50 text-red-400 rounded-xl p-4 my-2 text-sm">
              <span>⚠️ Erro: Conecte o Backend primeiro ({error})</span>
            </div>
          )}

          {/* LISTA DE TAREFAS */}
          {!loading && !error && tarefas.length === 0 && (
            <p className="text-center text-slate-600 py-6 text-sm">Nenhuma tarefa encontrada. Comece adicionando uma!</p>
          )}

          <ul className="space-y-2">
            {tarefas.map((tarefa) => (
              <li key={tarefa.id} className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors group">
                <div className="flex items-center gap-3 flex-1 mr-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-700 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer"
                    checked={tarefa.completed || false}
                    onChange={() => alternarConclusao(tarefa.id, tarefa.title, tarefa.completed)}
                  />

                  {editandoId === tarefa.id ? (
                    <input
                      type="text"
                      className="flex-1 bg-slate-950 border border-indigo-500 rounded px-2 py-1 text-sm text-slate-100 focus:outline-none"
                      value={textoEditando}
                      onChange={(e) => setTextoEditando(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && salvarEdicao(tarefa.id, tarefa.completed)}
                    />
                  ) : (
                    <span className={`text-sm transition-all ${tarefa.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {tarefa.title}
                    </span>
                  )}
                </div>

                {/* BOTÕES DE AÇÃO */}
                <div className="flex items-center gap-1">
                  {editandoId === tarefa.id ? (
                    <button onClick={() => salvarEdicao(tarefa.id, tarefa.completed)} className="text-xs bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 px-2.5 py-1.5 rounded font-medium transition-colors">
                      Salvar
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditandoId(tarefa.id);
                        setTextoEditando(tarefa.title);
                      }}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded font-medium transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      Editar
                    </button>
                  )}
                  <button onClick={() => deletarTarefa(tarefa.id)} className="text-xs bg-red-600/10 hover:bg-red-600/20 text-red-400 px-2.5 py-1.5 rounded font-medium transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </div>
  );
}