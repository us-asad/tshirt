/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { MdClose, MdSettings } from "react-icons/md";
import { useDebounce } from "use-debounce";

export default function TextCard({
  onChange = Function.prototype,
  remove = Function.prototype,
  object,
  editor,
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [color, setColor] = useState("#000");
  const [font, setFont] = useState("inconsolata");
  const [deboucedColor] = useDebounce(color, 1000);
  const [deboucedFont] = useDebounce(font, 1000);

  useEffect(() => {
    if (object) {
      object.set({
        fill: deboucedColor,
      });

      if (editor?.canvas?.renderAll) editor.canvas.renderAll();
    }
  }, [deboucedColor]);

  useEffect(() => {
    if (object) {
      object.set({
        fontFamily: font,
        fontWeight: 600,
      });

      if (editor?.canvas?.renderAll) editor.canvas.renderAll();
    }
  }, [deboucedFont]);

  return (
    <div>
      <div className="flex items-center justify-between gap-5">
        <input
          type="text"
          value={object.text}
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
          {/* <div className="flex items-center gap-3">
            <h4 className="font-medium text-sm w-[50px]">Weight</h4>
            <select
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="border border-gray-300 rounded-md px-2.5 py-0.5 text-sm w-full"
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
          </div> */}
          <div className="flex items-center gap-3">
            <h4 className="font-medium text-sm w-[50px]">Font</h4>
            <select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="border border-gray-300 rounded-md px-2.5 py-0.5 text-sm"
            >
              {fonts.map((font) => (
                <option key={font} value={font} className={`font-${font}`}>
                  {font}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

const fonts = [
  "allstars",
  "amore",
  "andes",
  "arabic",
  "arbat",
  "bnt",
  "captureit",
  "copyist",
  "corsiva",
  "disney",
  "ds-goose",
  "europebold",
  "flowerchild",
  "lobster",
  "mistral",
  "rain",
  "rubik",
  "supernatural",
  "superstar",
];
