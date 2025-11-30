import { useState, useEffect } from "react";
import Popup from "../../../shared/components/ui/popup";
import Button from "../../../shared/components/ui/button";
import { type ClienteTitular, type ClienteDependente, type Documento as DocumentoTipo } from "../dados";
import { getTitulares } from "../../../shared/api";

type Props = {
  onClose: () => void;
  onSave: (cliente: ClienteTitular | ClienteDependente) => void;
};

type Telefone = { ddd: string; numero: string };

function AdicionarCliente({ onClose, onSave }: Props) {
  const [tipo, setTipo] = useState<"titular" | "dependente">("titular");
  const [titular, setTitular] = useState("");
  const [listaTitulares, setListaTitulares] = useState<ClienteTitular[]>([]);

  useEffect(() => {
    getTitulares().then(setListaTitulares).catch(console.error);
  }, []);

  const [nome, setNome] = useState("");
  const [nomeSocial, setNomeSocial] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [pais, setPais] = useState("");

  const [telefones, setTelefones] = useState<Telefone[]>([]);
  const [documentos, setDocumentos] = useState<DocumentoTipo[]>([]);

  const [mostrarTelefone, setMostrarTelefone] = useState(false);
  const [mostrarDocumento, setMostrarDocumento] = useState(false);

  const atualizarTelefone = (index: number, campo: keyof Telefone, valor: string) => {
    const novos = [...telefones];
    novos[index] = { ...novos[index], [campo]: valor };
    setTelefones(novos);
  };

  const adicionarTelefone = () => setTelefones([...telefones, { ddd: "", numero: "" }]);

  const atualizarDocumento = (
    index: number,
    campo: keyof DocumentoTipo,
    valor: DocumentoTipo[keyof DocumentoTipo]
  ) => {
    const novos = [...documentos];
    novos[index] = { ...novos[index], [campo]: valor };
    setDocumentos(novos);
  };

  const adicionarDocumento = () =>
    setDocumentos([...documentos, { tipo: "CPF", numero: "", dataExpedicao: "" }]);

  const handleSave = () => {
    if (tipo === "titular") {
      const novoTitular: ClienteTitular = {
        nome: nome.trim(),
        nomeSocial: nomeSocial.trim() || undefined,
        dataNascimento,
        endereco: rua || bairro || cidade || estado || pais
          ? { rua, bairro, cidade, estado, pais }
          : undefined,
        telefones: telefones.map(t => `(${t.ddd}) ${t.numero}`),
        documentos,
      };

      onSave(novoTitular);
    } else {
      // Dependente: send only nome, nomeSocial, dataNascimento, titular_id
      // Backend will automatically inherit telefones, documentos, endereco from titular
      const novoDependente: ClienteDependente = {
        titular: "",
        titular_id: Number(titular),
        nome: nome.trim(),
        nomeSocial: nomeSocial.trim() || undefined,
        dataNascimento,
        cpf: "",
        telefone: "",
        endereco: undefined,
      };

      onSave(novoDependente);
    }

    setNome("");
    setNomeSocial("");
    setDataNascimento("");
    setRua("");
    setBairro("");
    setCidade("");
    setEstado("");
    setPais("");
    setTelefones([]);
    setDocumentos([]);
    setMostrarTelefone(false);
    setMostrarDocumento(false);
    setTitular("");
    setTipo("titular");

    onClose();
  };

  return (
    <Popup title="Adicionar Cliente" onClose={onClose}>
      <div className="flex flex-col gap-4">
        {/* Tipo */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Tipo</label>
          <select
            className="border rounded-md p-2"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as "titular" | "dependente")}
          >
            <option value="titular">Titular</option>
            <option value="dependente">Dependente</option>
          </select>
        </div>

        {tipo === "dependente" && (
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Titular</label>
            <select
              className="border rounded-md p-2"
              value={titular}
              onChange={(e) => setTitular(e.target.value)}
            >
              <option value="">Selecionar titular</option>
              {listaTitulares.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Nome <span className="text-red-500">*</span></label>
          <input
            className="border rounded-md p-2"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1 flex flex-col">
            <label className="text-sm text-gray-600">Nome Social <span className="text-red-500">*</span></label>
            <input
              className="border rounded-md p-2"
              value={nomeSocial}
              onChange={(e) => setNomeSocial(e.target.value)}
            />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="text-sm text-gray-600">Data de Nascimento <span className="text-red-500">*</span></label>
            <input
              type="date"
              className="border rounded-md p-2"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
            />
          </div>
        </div>

        {tipo === "titular" && (
          <>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Rua</label>
              <input className="border rounded-md p-2" value={rua} onChange={(e) => setRua(e.target.value)} />
            </div>

            <div className="flex gap-2">
              <div className="flex-1 flex flex-col">
                <label className="text-sm text-gray-600">Bairro</label>
                <input className="border rounded-md p-2" value={bairro} onChange={(e) => setBairro(e.target.value)} />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="text-sm text-gray-600">Cidade</label>
                <input className="border rounded-md p-2" value={cidade} onChange={(e) => setCidade(e.target.value)} />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1 flex flex-col">
                <label className="text-sm text-gray-600">Estado</label>
                <input className="border rounded-md p-2" value={estado} onChange={(e) => setEstado(e.target.value)} />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="text-sm text-gray-600">País</label>
                <input className="border rounded-md p-2" value={pais} onChange={(e) => setPais(e.target.value)} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {!mostrarTelefone && (
                <Button
                  onClick={() => {
                    setMostrarTelefone(true);
                    adicionarTelefone();
                  }}
                >
                  Adicionar telefone
                </Button>
              )}

              {mostrarTelefone &&
                telefones.map((t, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      className="border rounded-md p-2 w-20"
                      placeholder="DDD"
                      value={t.ddd}
                      onChange={(e) => atualizarTelefone(i, "ddd", e.target.value)}
                    />
                    <input
                      className="border rounded-md p-2 flex-1"
                      placeholder="Número"
                      value={t.numero}
                      onChange={(e) => atualizarTelefone(i, "numero", e.target.value)}
                    />
                  </div>
                ))}

              {mostrarTelefone && <Button onClick={adicionarTelefone}>Adicionar outro telefone</Button>}
            </div>

            <div className="flex flex-col gap-2">
              {!mostrarDocumento && (
                <Button
                  onClick={() => {
                    setMostrarDocumento(true);
                    adicionarDocumento();
                  }}
                >
                  Adicionar documento
                </Button>
              )}

              {mostrarDocumento &&
                documentos.map((doc, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <select
                      className="border rounded-md p-2"
                      value={doc.tipo}
                      onChange={(e) =>
                        atualizarDocumento(i, "tipo", e.target.value as DocumentoTipo["tipo"])
                      }
                    >
                      <option value="CPF">CPF</option>
                      <option value="RG">RG</option>
                      <option value="Passaporte">Passaporte</option>
                    </select>

                    <input
                      className="border rounded-md p-2"
                      placeholder="Número do documento"
                      value={doc.numero}
                      onChange={(e) => atualizarDocumento(i, "numero", e.target.value)}
                    />

                    <input
                      type="date"
                      className="border rounded-md p-2"
                      value={doc.dataExpedicao}
                      onChange={(e) => atualizarDocumento(i, "dataExpedicao", e.target.value)}
                    />
                  </div>
                ))}

              {mostrarDocumento && <Button onClick={adicionarDocumento}>Adicionar outro documento</Button>}
            </div>
          </>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            onClick={handleSave}
            disabled={!nome.trim() || !nomeSocial.trim() || !dataNascimento.trim()}
          >
            Salvar
          </Button>
        </div>
      </div>
    </Popup>
  );
}

export default AdicionarCliente;
