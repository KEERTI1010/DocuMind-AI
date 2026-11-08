import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative mt-1">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 focus:border-indigo-500 focus:outline-none"
        />
        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
