import { useEffect } from "react";

type PopupProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

function Popup({ title, children, onClose }: PopupProps) {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-lg shadow-lg p-6 relative overflow-auto">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-blue-900 mb-6">{title}</h2>

        <div className="flex flex-col gap-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Popup;
