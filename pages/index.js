import React, { useEffect, useState } from "react";
import { GiCycle } from "react-icons/gi";
import { VscDebugStepBack } from "react-icons/vsc";
import { BiCloudDownload } from "react-icons/bi";
import { AiOutlineBgColors } from "react-icons/ai";
import { TbTextSize } from "react-icons/tb";
import TextCard from "../components/TextCard";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";

export default function Home() {
  const [tab, setTab] = useState("colors");
  const [tshirtColor, setTShirtColor] = useState(1);
  const [texts, setTexts] = useState([]);
  const { selectedObjects, editor, onReady } = useFabricJSEditor();

  const handleScaling = (event) => {
    console.log(event);
  };

  const addNewText = (e) => {
    e.preventDefault();
    const textVal = e.target.text?.value;
    if (textVal) {
      const text = new fabric.Text(textVal, {
        left: 50,
        top: 50,
        fontSize: 24,
      });

      editor.canvas?.add(text);

      text.on("scaling", handleScaling);

      setTexts((prev) => [
        { value: textVal, object: text, id: Date.now() },
        ...prev,
      ]);
      e.target.text.value = "";
    }
  };

  useEffect(() => {
    // console.log(fabric.util.loadFont, "fabric");
    // loadCustomFont("Roboto", () => {});
    // fabric.util.loadFont("Inconsolata", () => {});
  }, []);

  return (
    <div className="max-w-[1250px] mx-auto py-16 flex gap-10">
      <div className="w-1/3">
        <button className="flex items-center gap-2 px-4 py-2 hover:bg-[#d1d1d179] duration-200 rounded-md hover:text-blue-600">
          <GiCycle />
          <span>Change T-Shirt</span>
        </button>
        <div className="border border-gray-400 py-4 mt-3 relative">
          <img
            src={`./tshirt/1/${tshirtColor}.png`}
            alt="T-Shirt"
            className="w-full h-[400px] object-contain"
          />
          <FabricJSCanvas
            className="main-canvas absolute top-[70px] left-[120px] w-[171px] h-[310px]"
            onReady={onReady}
          />
        </div>
        <button className="flex items-center gap-2 justify-center w-full py-2.5 text-lg bg-blue-600 text-white rounded-md mt-3 hover:bg-blue-500 duration-200">
          <VscDebugStepBack className="text-xl" />
          <span>Back Side</span>
        </button>
        <button className="flex items-center gap-2 justify-center w-full py-2.5 text-lg bg-blue-600 text-white rounded-md mt-3 hover:bg-blue-500 duration-200">
          <BiCloudDownload className="text-2xl" />
          <span>Download</span>
        </button>
      </div>
      <div className="w-2/3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTab("colors")}
            className={`flex items-center justify-center gap-3 px-3 py-2 border-b-2 border-transparent hover:border-b-blue-600 duration-200 hover:text-blue-600 ${
              tab === "colors" && "border-b-blue-600 text-blue-600"
            }`}
          >
            <AiOutlineBgColors className="text-lg" />
            <span>Colors</span>
          </button>
          <button
            onClick={() => setTab("texts")}
            className={`flex items-center justify-center gap-3 px-3 py-2 border-b-2 border-transparent hover:border-b-blue-600 duration-200 hover:text-blue-600 ${
              tab === "texts" && "border-b-blue-600 text-blue-600"
            }`}
          >
            <TbTextSize className="text-lg" />
            <span>Texts</span>
          </button>
        </div>
        <div className="my-3 mx-4 max-w-[350px]">
          {
            {
              colors: (
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="font-medium">T-Shirt</h3>
                    <div className="flex gap-2 mt-3">
                      {tshirtColors.map((color, idx) => (
                        <button
                          key={color}
                          onClick={() => setTShirtColor(idx + 1)}
                          className={`w-12 h-7 border border-black duration-150 ${
                            tshirtColor === idx + 1 && "scale-[1.2]"
                          }`}
                          style={{ backgroundColor: color }}
                        ></button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">Texts</h3>
                    <span className="text-gray-400 mt-3 block">
                      No Any Texts
                    </span>
                  </div>
                </div>
              ),
              texts: (
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="font-medium">New Text</h3>
                    <form className="flex mt-2" onSubmit={addNewText}>
                      <input
                        type="text"
                        placeholder="Type new text"
                        name="text"
                        className="px-3 py-1.5 text-sm rounded-tl-md rounded-bl-md border border-gray-400 border-r-0 w-full"
                      />
                      <button className="px-5 py-1.5 text-sm font-medium rounded-tr-md rounded-br-md bg-blue-500 text-white">
                        Add
                      </button>
                    </form>
                  </div>
                  <div>
                    <h3 className="font-medium">Texts</h3>
                    <div className="mt-2">
                      {texts.length ? (
                        <div className="flex flex-col gap-3">
                          {texts?.map((text, idx) => (
                            <TextCard
                              editor={editor}
                              key={text.id}
                              onChange={(value) =>
                                setTexts((prev) => {
                                  const updatedTexts = [...prev];
                                  updatedTexts[idx].value = value;
                                  return updatedTexts;
                                })
                              }
                              remove={() => {
                                setTexts((prev) => {
                                  const updatedTexts = [...prev];
                                  updatedTexts.splice(idx, 1);
                                  return updatedTexts;
                                });
                                if (editor?.canvas?.remove)
                                  editor.canvas?.remove(text.object);
                              }}
                              {...text}
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">No Texts</span>
                      )}
                    </div>
                  </div>
                </div>
              ),
            }[tab]
          }
        </div>
      </div>
    </div>
  );
}

const tshirtColors = [
  "#38385c",
  "#009176",
  "#ede6e8",
  "#ffa905",
  "#005993",
  "#933900",
];

// import { useState } from "react";
// import FabricCanvas from "../components/FabricCanvas";

// export default function Home() {
//   return (
//     <div>
//       <FabricCanvas />
//     </div>
//   );
// }
