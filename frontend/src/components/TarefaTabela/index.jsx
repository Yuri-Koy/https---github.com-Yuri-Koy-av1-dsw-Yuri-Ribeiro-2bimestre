export default function TarefaTabela({ tarefas }) {
  return (
    <div className="lg:w-2/3 w-full mx-auto overflow-auto">
      <table className="table-auto w-full text-left whitespace-no-wrap">
        <thead>
          <tr>
            <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">
              ID
            </th>

            <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
              Descrição
            </th>
          </tr>
        </thead>

        <tbody>
          {tarefas.map((tarefa) => (
            <tr key={tarefa.id}>
              <td className="px-4 py-3">{tarefa.id}</td>

              <td className="px-4 py-3">{tarefa.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}