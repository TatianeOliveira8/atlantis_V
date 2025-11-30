import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";

type Row = {
  nome: string;
  solteiro: number | string;
  casal: number | string;
  suite: number | string;
  clima: string;
  garagem: number | string;
};

type CardProps = {
  title: string;
  rows: Row[];
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
};

function Card({ title, rows, onEdit, onDelete }: CardProps) {
  return (
    <div className="p-8 m-4">
      <div className="bg-white p-8 mt-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr>
                <th className="h-12 px-4 text-left font-medium text-gray-500">Nome</th>
                <th className="h-12 px-4 text-left font-medium text-gray-500">Cama Solteiro</th>
                <th className="h-12 px-4 text-left font-medium text-gray-500">Cama Casal</th>
                <th className="h-12 px-4 text-left font-medium text-gray-500">Suíte</th>
                <th className="h-12 px-4 text-left font-medium text-gray-500">Climatização</th>
                <th className="h-12 px-4 text-left font-medium text-gray-500">Garagem</th>
                {(onEdit || onDelete) && (
                  <th className="h-12 px-4 text-left font-medium text-gray-500">Ações</th>
                )}
              </tr>
            </thead>

            <tbody className="[&_tr:last-child]:border-0">
              {rows.map((r, i) => (
                <tr key={i} className="border-b hover:bg-gray-100 transition-colors">
                  <td className="p-4">{r.nome}</td>
                  <td className="p-4">{r.solteiro}</td>
                  <td className="p-4">{r.casal}</td>
                  <td className="p-4">{r.suite}</td>
                  <td className="p-4">{r.clima}</td>
                  <td className="p-4">{r.garagem}</td>

                  {(onEdit || onDelete) && (
                    <td className="p-4 flex items-center gap-4">
                      {onEdit && (
                        <FiEdit
                          size={20}
                          className="cursor-pointer text-black hover:text-blue-600 transition"
                          onClick={() => onEdit(i)}
                        />
                      )}
                      {onDelete && (
                        <RiDeleteBinLine
                          size={20}
                          className="cursor-pointer text-red-600 hover:text-red-800 transition"
                          onClick={() => onDelete(i)}
                        />
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Card;
