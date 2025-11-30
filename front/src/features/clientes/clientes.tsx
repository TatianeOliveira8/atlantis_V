import { useState, useEffect } from "react";
import Button from "../../shared/components/ui/button";
import AdicionarCliente from "./components/adicionar";
import EditarCliente from "./components/editar";
import ConfirmPopup from "../../shared/components/ui/popupConfirm";
import ListagemTitulares from "./components/listagemTitular";
import PesquisarDependente from "./components/busca/pesquisaDependentesTitular";
import PesquisarTitularDependentes from "./components/busca/pesquisaTitularDependente";
import { type ClienteTitular, type ClienteDependente } from "./dados";
import { getTitulares, addCliente, updateCliente, deleteCliente } from "../../shared/api";

export default function Clientes() {
  const [titulares, setTitulares] = useState<ClienteTitular[]>([]);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const data = await getTitulares();
      setTitulares(data);
    } catch (error) {
      console.error("Error fetching clientes:", error);
    }
  };

  const [openAdicionar, setOpenAdicionar] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<ClienteTitular | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clienteExcluindo, setClienteExcluindo] = useState<ClienteTitular | null>(null);

  const handleAdicionar = async (cliente: ClienteTitular | ClienteDependente) => {
    try {
      // Both Titular and Dependente are saved via addCliente
      // The backend handles the distinction via fields (titular_id)
      await addCliente(cliente);
      await fetchClientes();
      setOpenAdicionar(false);
    } catch (error) {
      console.error("Error adding cliente:", error);
    }
  };

  const handleEditar = async (clienteAtualizado: ClienteTitular) => {
    if (!clienteEditando) return;
    try {
      const id = (clienteEditando as any).id;
      if (id) {
        await updateCliente({ ...clienteAtualizado, id });
        await fetchClientes();
      }
    } catch (error) {
      console.error("Error updating cliente:", error);
    }
    setClienteEditando(null);
    setOpenEditar(false);
  };

  const handleExcluir = async () => {
    if (!clienteExcluindo) return;
    try {
      const id = (clienteExcluindo as any).id;
      if (id) {
        await deleteCliente(id);
        await fetchClientes();
      }
    } catch (error) {
      console.error("Error deleting cliente:", error);
    }
    setClienteExcluindo(null);
    setConfirmOpen(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-end mb-4">
        <Button onClick={() => setOpenAdicionar(true)}>Adicionar Cliente</Button>
      </div>

      <h2 className="text-3xl font-semibold text-gray-800 mb-2">Listagem titular</h2>

      <ListagemTitulares
        titulares={titulares}
        onEdit={(cliente) => {
          setClienteEditando(cliente);
          setOpenEditar(true);
        }}
        onDelete={(cliente) => {
          setClienteExcluindo(cliente);
          setConfirmOpen(true);
        }}
      />

      {openAdicionar && <AdicionarCliente onClose={() => setOpenAdicionar(false)} onSave={handleAdicionar} />}

      {openEditar && clienteEditando && <EditarCliente key={clienteEditando.id} cliente={clienteEditando} onClose={() => setOpenEditar(false)} onSave={handleEditar} />}

      {confirmOpen && clienteExcluindo && (
        <ConfirmPopup message={`Deseja mesmo excluir ${clienteExcluindo.nome}?`} onCancel={() => setConfirmOpen(false)} onConfirm={handleExcluir} />
      )}

      <div className="mt-6 bg-white p-4 rounded shadow-md">
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">Buscas</h2>
        <div className="flex gap-6">
          <div className="flex-1">
            <PesquisarDependente />
          </div>
          <div className="flex-1">
            <PesquisarTitularDependentes />
          </div>
        </div>
      </div>
    </div>
  );
}
