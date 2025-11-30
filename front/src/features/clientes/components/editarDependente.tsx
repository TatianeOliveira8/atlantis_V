import { useState } from "react";
import Popup from "../../../shared/components/ui/popup";
import Button from "../../../shared/components/ui/button";

export type Endereco = {
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
};

export type ClienteDependente = {
  nome: string;
  nomeSocial?: string;
  dataNascimento: string;
  cpf: string;
  telefone: string;
  titular: string;
  endereco?: Endereco;
};

export type ClienteTitular = {
  nome: string;
  nomeSocial?: string;
  dataNascimento: string;
  endereco?: Endereco;
};

type Props = {
  dependente: ClienteDependente;
  titular?: ClienteTitular; 
  onClose: () => void;
  onSave: (d: ClienteDependente) => void;
};

function EditarDependente({ dependente, titular, onClose, onSave }: Props) {
  const [nome, setNome] = useState(dependente.nome || "");
  const [nomeSocial, setNomeSocial] = useState(dependente.nomeSocial || "");
  const [dataNascimento, setDataNascimento] = useState(dependente.dataNascimento);
  const [rua, setRua] = useState(dependente.endereco?.rua || titular?.endereco?.rua || "");
  const [bairro, setBairro] = useState(dependente.endereco?.bairro || titular?.endereco?.bairro || "");
  const [cidade, setCidade] = useState(dependente.endereco?.cidade || titular?.endereco?.cidade || "");
  const [estado, setEstado] = useState(dependente.endereco?.estado || titular?.endereco?.estado || "");
  const [pais, setPais] = useState(dependente.endereco?.pais || titular?.endereco?.pais || "");

  const base = "border rounded-md p-2 w-full";

  const handleSave = () => {
    const enderecoFinal =
      rua || bairro || cidade || estado || pais
        ? { rua, bairro, cidade, estado, pais }
        : undefined;

    onSave({
      ...dependente,
      nome: nome.trim(),
      nomeSocial: nomeSocial.trim(),
      dataNascimento,
      endereco: enderecoFinal,
    });

    onClose();
  };

  return (
    <Popup title="Editar Dependente" onClose={onClose}>
      <div className="flex flex-col gap-4">

        <div className="flex flex-col">
          <label className="font-medium">Nome</label>
          <input className={base} value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-medium">Nome Social</label>
            <input className={base} value={nomeSocial} onChange={(e) => setNomeSocial(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label className="font-medium">Data de Nascimento</label>
            <input type="date" className={base} value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Rua</label>
          <input className={base} value={rua} onChange={(e) => setRua(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-medium">Bairro</label>
            <input className={base} value={bairro} onChange={(e) => setBairro(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label className="font-medium">Cidade</label>
            <input className={base} value={cidade} onChange={(e) => setCidade(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-medium">Estado</label>
            <input className={base} value={estado} onChange={(e) => setEstado(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label className="font-medium">País</label>
            <input className={base} value={pais} onChange={(e) => setPais(e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </div>
      </div>
    </Popup>
  );
}

export default EditarDependente;
