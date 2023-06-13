/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { useDebounce } from "use-debounce";

export default function IconCard({ className, object, editor, remove = Function.prototype }) {
  const [color, setColor] = useState("#000");
  const [debouncedColor] = useDebounce(color, 500);

  useEffect(() => {
    if (object.set) {
      object.set({
        fill: debouncedColor,
      });

      editor?.canvas?.renderAll();
    }
  }, [debouncedColor]);

  return (
    <div className="flex items-center justify-between">
      <i className={`${className} text-2xl`} style={{ color }} />
      <div className="flex items-center gap-2">
        <input
          onChange={(e) => setColor(e.target.value)}
          value={color}
          type="color"
        />
        <button onClick={remove} className="text-red-600 text-lg">
          <BsFillTrashFill />
        </button>
      </div>
    </div>
  );
}
