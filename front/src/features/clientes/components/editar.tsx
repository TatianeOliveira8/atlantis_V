import { useState, useMemo } from "react";
import Popup from "../../../shared/components/ui/popup";
import Button from "../../../shared/components/ui/button";

export type Documento = {
  tipo: "CPF" | "RG" | "Passaporte";
  numero: string;
  dataExpedicao: string;
};

export type Endereco = {
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
};

export type ClienteTitular = {
  nome: string;
  nomeSocial?: string;
  dataNascimento: string;
  documentos: Documento[];
  telefones: string[];
  endereco?: Endereco;
};

type Props = {
  cliente: ClienteTitular;
  onClose: () => void;
  onSave: (cliente: ClienteTitular) => void;
};

const TIPOS_DOC: Documento["tipo"][] = ["CPF", "RG", "Passaporte"];

function EditarCliente({ cliente, onClose, onSave }: Props) {
  const [nome, setNome] = useState(cliente.nome);
  const [nomeSocial, setNomeSocial] = useState(cliente.nomeSocial || "");
  const [dataNascimento, setDataNascimento] = useState(cliente.dataNascimento);

  const docMap = useMemo(() => {
    const map = new Map<Documento["tipo"], Documento>();
    cliente.documentos.forEach((d) => map.set(d.tipo, d));
    return map;
  }, [cliente.documentos]);

  const [docTipoSelecionado, setDocTipoSelecionado] =
    useState<Documento["tipo"]>(cliente.documentos[0]?.tipo ?? "CPF");

  const docAtual = docMap.get(docTipoSelecionado);
  const [numeroDoc, setNumeroDoc] = useState(docAtual?.numero ?? "");
  const [dataExpedicao, setDataExpedicao] = useState(docAtual?.dataExpedicao ?? "");

  const [telSelecionado, setTelSelecionado] = useState<string>(
    cliente.telefones[0] ?? "__novo__"
  );
  const [telefoneDDD, setTelefoneDDD] = useState<string>("");
  const [telefoneNumero, setTelefoneNumero] = useState<string>("");

  const [rua, setRua] = useState(cliente.endereco?.rua);
  const [bairro, setBairro] = useState(cliente.endereco?.bairro);
  const [cidade, setCidade] = useState(cliente.endereco?.cidade);
  const [estado, setEstado] = useState(cliente.endereco?.estado);
  const [pais, setPais] = useState(cliente.endereco?.pais);

  const handleDocumentoChange = (tipo: Documento["tipo"]) => {
    setDocTipoSelecionado(tipo);
    const d = docMap.get(tipo);
    setNumeroDoc(d?.numero ?? "");
    setDataExpedicao(d?.dataExpedicao ?? "");
  };

  const handleTelefoneChange = (t: string) => {
    setTelSelecionado(t);
    if (t === "__novo__") {
      setTelefoneDDD("");
      setTelefoneNumero("");
    } else {
      // Parse existing phone: "(11) 98765-4321" -> DDD: "11", Numero: "98765-4321"
      const match = t.match(/\((\d+)\)\s*(.+)/);
      if (match) {
        setTelefoneDDD(match[1]);
        setTelefoneNumero(match[2]);
      } else {
        setTelefoneDDD("");
        setTelefoneNumero(t);
      }
    }
  };

  const handleSave = () => {
    const documentosAtualizados = [...cliente.documentos];
    const idx = documentosAtualizados.findIndex((d) => d.tipo === docTipoSelecionado);

    const documentoNovo: Documento = {
      tipo: docTipoSelecionado,
      numero: numeroDoc.trim(),
      dataExpedicao: dataExpedicao.trim(),
    };

    if (idx >= 0) documentosAtualizados[idx] = documentoNovo;
    else documentosAtualizados.push(documentoNovo);

    let telefonesAtualizados = [...cliente.telefones];
    const telefoneFormatado = `(${telefoneDDD.trim()}) ${telefoneNumero.trim()}`;

    if (telSelecionado === "__novo__") {
      if (telefoneDDD.trim() && telefoneNumero.trim()) {
        telefonesAtualizados.push(telefoneFormatado);
      }
    } else {
      telefonesAtualizados = telefonesAtualizados.map((t) =>
        t === telSelecionado ? telefoneFormatado : t
      );
    }

    const enderecoFinal =
      rua || bairro || cidade || estado || pais
        ? { rua: rua ?? "", bairro: bairro ?? "", cidade: cidade ?? "", estado: estado ?? "", pais: pais ?? "" }
        : undefined;

    onSave({
      nome: nome.trim(),
      nomeSocial: nomeSocial.trim(),
      dataNascimento: dataNascimento.trim(),
      documentos: documentosAtualizados,
      telefones: telefonesAtualizados,
      endereco: enderecoFinal,
    });

    onClose();
  };

  const base = "border rounded-md p-2";

  return (
    <Popup title="Editar Cliente" onClose={onClose}>
      <div className="flex flex-col gap-4">

        <div className="grid grid-cols-2 gap-4">
          <input className={base} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" />
          <input className={base} value={nomeSocial} onChange={(e) => setNomeSocial(e.target.value)} placeholder="Nome social" />
        </div>

        <input type="date" className={base} value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <select className={base} value={docTipoSelecionado} onChange={(e) => handleDocumentoChange(e.target.value as Documento["tipo"])}>
              {TIPOS_DOC.map((t) => <option key={t}>{t}</option>)}
            </select>

            <input className={base} placeholder="Número" value={numeroDoc} onChange={(e) => setNumeroDoc(e.target.value)} />
            <input type="date" className={base} value={dataExpedicao} onChange={(e) => setDataExpedicao(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <select className={base} value={telSelecionado} onChange={(e) => handleTelefoneChange(e.target.value)}>
              {cliente.telefones.map((t) => <option key={t}>{t}</option>)}
              <option value="__novo__">Novo telefone</option>
            </select>

            <div className="flex gap-2">
              <input
                className="border rounded-md p-2 w-20"
                placeholder="DDD"
                value={telefoneDDD}
                onChange={(e) => setTelefoneDDD(e.target.value)}
              />
              <input
                className="border rounded-md p-2 flex-1"
                placeholder="Número"
                value={telefoneNumero}
                onChange={(e) => setTelefoneNumero(e.target.value)}
              />
            </div>
          </div>
        </div>

        <input className={base} value={rua} onChange={(e) => setRua(e.target.value)} placeholder="Rua" />

        <div className="grid grid-cols-2 gap-4">
          <input className={base} value={bairro} onChange={(e) => setBairro(e.target.value)} placeholder="Bairro" />
          <input className={base} value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input className={base} value={estado} onChange={(e) => setEstado(e.target.value)} placeholder="Estado" />
          <input className={base} value={pais} onChange={(e) => setPais(e.target.value)} placeholder="País" />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </div>

      </div>
    </Popup>
  );
}

export default EditarCliente;
