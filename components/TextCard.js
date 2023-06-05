/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import { MdClose, MdSettings } from "react-icons/md";
import { useDebounce } from "use-debounce";

export default function TextCard({
  value = "",
  onChange = Function.prototype,
  remove = Function.prototype,
  object = {},
  editor = null,
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [color, setColor] = useState("#000");
  const [weight, setWeight] = useState(600);
  const [font, setFont] = useState("inconsolata");
  const [deboucedColor] = useDebounce(color, 1000);
  const [deboucedFont] = useDebounce(font, 1000);
  const [deboucedWeight] = useDebounce(weight, 1000);

  useEffect(() => {
    console.log(object);
    if (object.set) {
      object.set({
        fill: deboucedColor,
      });

      if (editor?.canvas?.renderAll) editor.canvas.renderAll();
    }
  }, [deboucedColor]);

  useEffect(() => {
    if (object.set) {
      object.set({
        fontFamily: font,
        fontWeight: weight,
      });
      console.log(object.fontFamily)

      if (editor?.canvas?.renderAll) editor.canvas.renderAll();
    }
  }, [deboucedFont]);

  useEffect(() => {
    if (object.set) {
      object.set({
        fontWeight: weight,
        fontFamily: font,
      });
      console.log(object.fontWeight)

      if (editor?.canvas?.renderAll) editor.canvas.renderAll();
    }
  }, [deboucedWeight]);

  return (
    <div>
      <div className="flex items-center justify-between gap-5">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`border border-gray-300 rounded-md px-2.5 py-0.5 w-full font-semibold font-${font}`}
          style={{ color }}
        />
        <div className="gap-2 flex items-center">
          <button
            onClick={() => setShowSettings((prev) => !prev)}
            className="text-lg"
          >
            {showSettings ? <MdClose /> : <MdSettings />}
          </button>
          <button onClick={remove} className="text-red-600">
            <BsFillTrashFill />
          </button>
        </div>
      </div>
      {showSettings && (
        <div className="mt-3 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <h4 className="font-medium text-sm w-[50px]">Color</h4>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <h4 className="font-medium text-sm w-[50px]">Weight</h4>
            <select
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="border border-gray-300 rounded-md px-2.5 py-0.5 text-sm"
            >
              <option className="font-[100]" value={100}>
                Thin
              </option>
              <option className="font-[200]" value={200}>
                Extra Light
              </option>
              <option className="font-[300]" value={300}>
                Light
              </option>
              <option className="font-[400]" value={400}>
                Normal
              </option>
              <option className="font-[500]" value={500}>
                Medium
              </option>
              <option className="font-[600]" value={600}>
                {" "}
                Semi Bold
              </option>
              <option className="font-[700]" value={700}>
                Bold
              </option>
              <option className="font-[800]" value={800}>
                Extra Bold
              </option>
              <option className="font-black" value={900}>
                Black
              </option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <h4 className="font-medium text-sm w-[50px]">Font</h4>
            <select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="border border-gray-300 rounded-md px-2.5 py-0.5 text-sm"
            >
              <option value="roboto" className="font-roboto">
                Roboto
              </option>
              <option value="inconsolata" className="font-inconsolata">
                Inconsolata
              </option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
