type ConfirmPopupProps = {
  title?: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
};

function ConfirmPopup({ title = "Confirmação", message, onCancel, onConfirm }: ConfirmPopupProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black transition"
          onClick={onCancel}
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-blue-900 mb-4">{title}</h2>

        <p className="text-gray-700 mb-6">{message}</p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmPopup;
