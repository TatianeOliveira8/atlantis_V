import { useState } from "react";
import Popup from "../../../shared/components/ui/popup";
import Button from "../../../shared/components/ui/button";

type Acomodacao = {
  nomeAcomadacao: string;
  camaSolteiro: number;
  camaCasal: number;
  suite: number;
  climatizacao: boolean;
  garagem: number;
};

type Props = {
  onClose: () => void;
  onSave: (acomodacao: Acomodacao) => void;
};

function AdicionarAcomodacao({ onClose, onSave }: Props) {
  const [nome, setNome] = useState("");
  const [solteiro, setSolteiro] = useState(0);
  const [casal, setCasal] = useState(0);
  const [suite, setSuite] = useState(0);
  const [clima, setClima] = useState(false);
  const [garagem, setGaragem] = useState(0);

  const handleSave = () => {
    const nova: Acomodacao = {
      nomeAcomadacao: nome,
      camaSolteiro: solteiro,
      camaCasal: casal,
      suite: suite,
      climatizacao: clima,
      garagem: garagem,
    };
    onSave(nova);
    onClose();
  };

  return (
    <Popup title="Adicionar Acomodação" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Nome</label>
          <input type="text" className="border rounded-md p-2" value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col flex-1">
            <label className="text-sm text-gray-600">Solteiro</label>
            <input type="number" className="border rounded-md p-2" value={solteiro} onChange={(e) => setSolteiro(parseInt(e.target.value) || 0)} />
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-sm text-gray-600">Casal</label>
            <input type="number" className="border rounded-md p-2" value={casal} onChange={(e) => setCasal(parseInt(e.target.value) || 0)} />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col flex-1">
            <label className="text-sm text-gray-600">Suíte</label>
            <input type="number" className="border rounded-md p-2" value={suite} onChange={(e) => setSuite(parseInt(e.target.value) || 0)} />
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-sm text-gray-600">Garagem</label>
            <input type="number" className="border rounded-md p-2" value={garagem} onChange={(e) => setGaragem(parseInt(e.target.value) || 0)} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={clima} onChange={(e) => setClima(e.target.checked)} />
          <label className="text-sm text-gray-600">Climatização</label>
        </div>
        <Button onClick={handleSave}>Salvar</Button>
      </div>
    </Popup>
  );
}

export default AdicionarAcomodacao;
