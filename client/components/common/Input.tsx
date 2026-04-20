type InputProps = {
    label: string;
    error?: string;
    info?: string;
  } & React.InputHTMLAttributes<HTMLInputElement>;
  
  export const Input = ({ label, error, info, ...props }: InputProps) => {
    return (
      <div>
        <label className="text-sm">{label}</label>
        <input
          {...props}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-zinc-800"
        />
        {info && !error && <p className="text-xs text-zinc-500 mt-1">{info}</p>}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  };