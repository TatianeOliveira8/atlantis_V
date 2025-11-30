import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import { type ClienteDependente, type ClienteTitular } from "../../dados";
import ConfirmPopup from "../../../../shared/components/ui/popupConfirm";
import EditarDependente from "../editarDependente";
import { getTitulares, getDependentes, updateCliente, deleteCliente } from "../../../../shared/api";

export default function PesquisarTitularDependentes() {
  const [busca, setBusca] = useState("");
  const [resultado, setResultado] = useState<null | {
    titular: ClienteTitular;
    dependentes: ClienteTitular[];
  }>(null);
  const [todosClientes, setTodosClientes] = useState<ClienteTitular[]>([]);
  const [todosDependentes, setTodosDependentes] = useState<any[]>([]);

  const fetchClientes = async () => {
    try {
      const [titularesData, dependentesData] = await Promise.all([
        getTitulares(),
        getDependentes()
      ]);
      setTodosClientes(titularesData);
      setTodosDependentes(dependentesData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const [depSelecionado, setDepSelecionado] = useState<ClienteTitular | null>(null);
  const [mostrarPopupExcluir, setMostrarPopupExcluir] = useState(false);
  const [mostrarPopupEditar, setMostrarPopupEditar] = useState(false);

  function handleSearch() {
    // Find titular by name (only search in titulares)
    const tit = todosClientes.find((t) =>
      t.nome.toLowerCase().includes(busca.toLowerCase())
    );

    if (!tit) {
      setResultado(null);
      return;
    }

    // Find dependents (from dependentes list with titular_id === tit.id)
    const deps = todosDependentes.filter(c => c.titular_id === tit.id);
    setResultado({ titular: tit, dependentes: deps });
  }

  function onEditarDependente(dep: any) {
    // Adapter for EditarDependente which expects ClienteDependente type
    // But our DB returns ClienteTitular structure. 
    // We construct a compatible object.
    const depAdapter: ClienteDependente = {
      ...dep,
      titular: resultado?.titular.nome || "",
      cpf: dep.documentos?.find((d: any) => d.tipo === 'CPF')?.numero || "",
      telefone: dep.telefones?.[0] || ""
    };
    setDepSelecionado(depAdapter as any);
    setMostrarPopupEditar(true);
  }

  async function onSalvarDependente(depAtualizado: ClienteDependente) {
    if (!depSelecionado) return;

    // Convert back to DB structure for update
    const id = (depSelecionado as any).id;
    const titular_id = (depSelecionado as any).titular_id;

    const clienteParaUpdate = {
      id,
      titular_id,
      nome: depAtualizado.nome,
      nomeSocial: depAtualizado.nomeSocial,
      dataNascimento: depAtualizado.dataNascimento,
      endereco: depAtualizado.endereco,
      telefones: [depAtualizado.telefone],
      documentos: [{ tipo: 'CPF', numero: depAtualizado.cpf, dataExpedicao: '' }]
    };

    try {
      await updateCliente(clienteParaUpdate);
      await fetchClientes();
      // Refresh result
      if (resultado) {
        setMostrarPopupEditar(false);
        setDepSelecionado(null);
        // Re-run search logic with new data
        const [newTitulares, newDependentes] = await Promise.all([
          getTitulares(),
          getDependentes()
        ]);
        setTodosClientes(newTitulares);
        setTodosDependentes(newDependentes);
        const tit = newTitulares.find((t: any) => t.id === resultado.titular.id);
        if (tit) {
          const deps = newDependentes.filter((c: any) => c.titular_id === tit.id);
          setResultado({ titular: tit, dependentes: deps });
        }
      }
    } catch (error) {
      console.error("Error updating dependent:", error);
    }
  }

  function onExcluirDependente(dep: any) {
    setDepSelecionado(dep);
    setMostrarPopupExcluir(true);
  }

  async function confirmarExclusao() {
    if (!depSelecionado) return;
    const id = (depSelecionado as any).id;
    if (id) {
      try {
        await deleteCliente(id);
        await fetchClientes();
        setMostrarPopupExcluir(false);
        setDepSelecionado(null);
        // Re-run search logic
        const [newTitulares, newDependentes] = await Promise.all([
          getTitulares(),
          getDependentes()
        ]);
        setTodosClientes(newTitulares);
        setTodosDependentes(newDependentes);
        if (resultado) {
          const tit = newTitulares.find((t: any) => t.id === resultado.titular.id);
          if (tit) {
            const deps = newDependentes.filter((c: any) => c.titular_id === tit.id);
            setResultado({ titular: tit, dependentes: deps });
          }
        }
      } catch (error) {
        console.error("Error deleting dependent:", error);
      }
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Nome do titular"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
      />

      <button
        onClick={handleSearch}
        className="px-3 py-2 rounded border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition"
      >
        Pesquisar
      </button>

      {resultado && (
        <div className="border border-gray-300 p-3 rounded">
          <h3 className="font-semibold">Titular</h3>
          <p><b>Nome:</b> {resultado.titular.nome}</p>
          <p><b>Telefones:</b> {resultado.titular.telefones.join(", ")}</p>

          <h3 className="font-semibold mt-3">Dependentes</h3>

          {resultado.dependentes.map((dep: any) => (
            <div key={dep.id} className="mb-2 border-b pb-2">
              <div className="flex justify-between items-center">
                <p><b>Nome:</b> {dep.nome}</p>
                <div className="flex gap-3 text-lg">
                  <FiEdit
                    className="cursor-pointer text-blue-600"
                    onClick={() => onEditarDependente(dep)}
                  />
                  <RiDeleteBinLine
                    className="cursor-pointer text-red-600"
                    onClick={() => onExcluirDependente(dep)}
                  />
                </div>
              </div>

              <p><b>Nome Social:</b> {dep.nomeSocial || "—"}</p>
              <p><b>CPF:</b> {dep.documentos?.find((d: any) => d.tipo === 'CPF')?.numero || "—"}</p>
              <p><b>Telefone:</b> {dep.telefones?.[0] || "—"}</p>
            </div>
          ))}
        </div>
      )}

      {mostrarPopupExcluir && depSelecionado && (
        <ConfirmPopup
          message={`Tem certeza que deseja excluir o dependente "${depSelecionado.nome}"?`}
          onCancel={() => setMostrarPopupExcluir(false)}
          onConfirm={confirmarExclusao}
        />
      )}

      {mostrarPopupEditar && depSelecionado && (
        <EditarDependente
          key={(depSelecionado as any).id}
          dependente={depSelecionado as any}
          onClose={() => setMostrarPopupEditar(false)}
          onSave={onSalvarDependente}
        />
      )}
    </div>
  );
}
