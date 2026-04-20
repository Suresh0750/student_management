type InputProps = {
    label: string;
    error?: string;
  } & React.InputHTMLAttributes<HTMLInputElement>;
  
  export const Input = ({ label, error, ...props }: InputProps) => {
    return (
      <div>
        <label className="text-sm">{label}</label>
        <input
          {...props}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-zinc-800"
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  };