import { useState, useEffect } from "react";
import { type ClienteDependente, type ClienteTitular } from "../../dados";
import { getDependentes, getTitulares } from "../../../../shared/api";

function PesquisarDependente() {
  const [busca, setBusca] = useState("");
  const [resultado, setResultado] = useState<null | {
    dependente: ClienteTitular;
    titular: ClienteTitular;
  }>(null);
  const [todosDependentes, setTodosDependentes] = useState<any[]>([]);
  const [todosTitulares, setTodosTitulares] = useState<ClienteTitular[]>([]);

  useEffect(() => {
    Promise.all([getDependentes(), getTitulares()])
      .then(([dependentesData, titularesData]) => {
        setTodosDependentes(dependentesData);
        setTodosTitulares(titularesData);
      })
      .catch(console.error);
  }, []);

  function handleSearch() {
    // Find a dependente by name (only search in dependentes)
    const match = todosDependentes.find(c =>
      c.nome.toLowerCase().includes(busca.toLowerCase())
    );

    if (!match || !match.titular_id) {
      setResultado(null);
      return;
    }

    // Find the titular from titulares list
    const tit = todosTitulares.find(t => t.id == match.titular_id);

    if (!tit) {
      setResultado(null);
      return;
    }

    setResultado({ dependente: match, titular: tit });
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Nome do dependente"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className=" p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
      />

      <button
        onClick={handleSearch}
        className="px-3 py-2 rounded border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition"
      >
        Pesquisar
      </button>

      {resultado && (
        <div className="border border-gray-300 p-3 rounded">
          <h3 className="font-semibold">Dependente</h3>
          <p><b>Nome:</b> {resultado.dependente.nome}</p>
          <p><b>Nome Social:</b> {resultado.dependente.nomeSocial || "—"}</p>

          <h3 className="font-semibold mt-3">Titular</h3>
          <p><b>Nome:</b> {resultado.titular.nome}</p>
          <p><b>Telefone:</b> {resultado.titular.telefones.join(", ")}</p>
        </div>
      )}

    </div>
  );
}
export default PesquisarDependente;
