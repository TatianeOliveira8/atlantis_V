import { useState, useEffect } from "react";
import Popup from "../../../shared/components/ui/popup";
import Button from "../../../shared/components/ui/button";
import { getTitulares, getAcomodacoes } from "../../../shared/api";

type Hospedagem = {
  cliente_id: number;
  acomodacao_id: number;
  dataEntrada: string;
  dataSaida: string;
};

type Props = {
  onClose: () => void;
  onSave: (hospedagem: Hospedagem) => void;
};

function Adicionar({ onClose, onSave }: Props) {
  const [clientes, setClientes] = useState<any[]>([]);
  const [acomodacoes, setAcomodacoes] = useState<any[]>([]);

  const [selectedClienteId, setSelectedClienteId] = useState("");
  const [selectedAcomodacaoId, setSelectedAcomodacaoId] = useState("");
  const [entrada, setEntrada] = useState("");
  const [saida, setSaida] = useState("");

  useEffect(() => {
    Promise.all([getTitulares(), getAcomodacoes()])
      .then(([cliData, acomData]) => {
        setClientes(cliData);
        setAcomodacoes(acomData);
      })
      .catch(console.error);
  }, []);

  const handleSave = () => {
    if (!selectedClienteId || !selectedAcomodacaoId) return;

    const novaHospedagem: Hospedagem = {
      cliente_id: parseInt(selectedClienteId),
      acomodacao_id: parseInt(selectedAcomodacaoId),
      dataEntrada: entrada,
      dataSaida: saida,
    };

    onSave(novaHospedagem);
    onClose();
  };

  return (
    <Popup title="Adicionar Hospedagem" onClose={onClose}>
      <div className="flex flex-col gap-4">
        {/* CLIENTE */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Cliente</label>
          <select
            className="border rounded-md p-2"
            value={selectedClienteId}
            onChange={(e) => setSelectedClienteId(e.target.value)}
          >
            <option value="">Selecione um cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        {/* ACOMODAÇÃO */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Acomodação</label>
          <select
            className="border rounded-md p-2"
            value={selectedAcomodacaoId}
            onChange={(e) => setSelectedAcomodacaoId(e.target.value)}
          >
            <option value="">Selecione uma acomodação</option>
            {acomodacoes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nomeAcomadacao}
              </option>
            ))}
          </select>
        </div>

        {/* ENTRADA */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Data Entrada</label>
          <input
            type="date"
            className="border rounded-md p-2"
            value={entrada}
            onChange={(e) => setEntrada(e.target.value)}
          />
        </div>

        {/* SAÍDA */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Data Saída (opcional)</label>
          <input
            type="date"
            className="border rounded-md p-2"
            value={saida}
            onChange={(e) => setSaida(e.target.value)}
          />
        </div>

        <Button onClick={handleSave}>Salvar</Button>
      </div>
    </Popup>
  );
}

export default Adicionar;
