import React from "react";

export default function RadioSelect({
  options,
  value,
  setValue = Function.prototype,
}) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`px-4 pt-0.5 pb-1 rounded-md duration-200 hover:bg-[#d1d1d14e] hover:text-blue-600 ${
            opt.value === value && "!bg-[#d1d1d179] text-blue-600"
          }`}
          onClick={() => setValue(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
