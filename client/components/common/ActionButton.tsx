type ActionButtonProps = {
    label: string;
    onClick: () => void;
    className ?: string
  };
  
  export const ActionButton = ({ label, onClick,className="" }: ActionButtonProps) => {
    return (
      <div className="flex">
        <button
          onClick={onClick}
          className={`ml-auto px-3 py-2 rounded-md bg-zinc-900 text-white hover:bg-zinc-800 transition-colors ${className}`}
        >
          {label}
        </button>
      </div>
    );
  };