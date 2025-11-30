type ButtonProps = {
  children: React.NodeNode;
  onClick?: () => void;
  disabled?: boolean;
};

function Button({ children, onClick, disabled = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-8 py-2 rounded-md text-lg transition ${disabled
          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
          : 'bg-blue-700 text-white hover:bg-blue-800'
        }`}
    >
      {children}
    </button>
  );
}

export default Button;
