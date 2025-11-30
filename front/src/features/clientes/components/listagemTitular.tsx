import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import type { ClienteTitular } from "../dados";

type Props = {
  titulares: ClienteTitular[];
  onEdit: (cliente: ClienteTitular) => void;
  onDelete: (cliente: ClienteTitular) => void;
};

export default function ListagemTitulares({ titulares, onEdit, onDelete }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {titulares.map((titular) => (
        <div
          key={titular.nome}
          className="bg-white p-4 rounded shadow-md flex justify-between items-start"
        >
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-lg">
              {titular.nome} ({titular.nomeSocial || "Sem nome social"})
            </h2>

            <div>
              <strong>Documento:</strong>{" "}
              {titular.documentos.map((doc) => `${doc.tipo}: ${doc.numero}`).join(", ")}
            </div>

            <div>
              <strong>Telefone:</strong> {titular.telefones.join(", ")}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => onEdit(titular)}
              className="text-blue-600 cursor-pointer hover:opacity-70 transition"
            >
              <FiEdit size={20} />
            </button>

            <button
              onClick={() => onDelete(titular)}
              className="text-red-600 cursor-pointer hover:opacity-70 transition"
            >
              <RiDeleteBinLine size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
