/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useRef, useState } from "react";
import { GiCycle } from "react-icons/gi";
import { VscDebugStepBack } from "react-icons/vsc";
import { BiCloudDownload } from "react-icons/bi";
import { AiOutlineBgColors } from "react-icons/ai";
import { TbTextSize } from "react-icons/tb";
import TextCard from "../components/TextCard";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import RadioSelect from "../components/RadioSelect";
import html2canvas from "html2canvas";

export default function Home() {
  const [tab, setTab] = useState("colors");
  const [tshirtColor, setTShirtColor] = useState("white");
  const [texts, setTexts] = useState([]);
  const { selectedObjects, editor, onReady } = useFabricJSEditor();
  const [gender, setGender] = useState("boy");
  const [showFront, setShowFront] = useState(true);
  const [showFolders, setShowFolders] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(images[0]);
  const [selectedObject, setSelectedObject] = useState(null);
  const elementRef = useRef(null);

  const captureScreenshot = () => {
    if (selectedObject) {
      editor?.canvas?.discardActiveObject();
      selectedObject.setCoords();
      editor?.canvas?.renderAll();
      setSelectedObject(null);
    }
    html2canvas(elementRef.current).then((canvas) => {
      const imgData = canvas.toDataURL();

      const aEl = document.createElement("a");
      aEl.href = imgData;
      aEl.download = "tshirt.png";
      aEl.click();
    });
  };

  const addNewText = (e) => {
    e.preventDefault();
    const textVal = e.target.text?.value;
    if (textVal) {
      const text = new fabric.IText(textVal, {
        left: 50,
        top: 50,
        fontSize: 30,
        fontFamily: "allstars",
      });

      editor.canvas?.add(text);

      setTexts((prev) => [
        { value: textVal, object: text, id: Date.now() },
        ...prev,
      ]);
      e.target.text.value = "";
    }
  };

  useEffect(() => {
    if (!selectedFolder?.genders) setGender("boy");
    setTShirtColor(selectedFolder.colors[0].label);
  }, [selectedFolder]);

  useEffect(() => {
    editor?.canvas?.on("object:selected", (event) => {
      console.log(event, "event");
      // selectedObject = event.target;
    });
  }, [editor]);

  useEffect(() => {
    const activeObj = editor?.canvas?.getActiveObject();
    if (activeObj) setSelectedObject(activeObj);
    else setSelectedObject(null);
  }, [editor]);

  return (
    <div className="py-10 flex gap-10 justify-center md:items-start items-center md:flex-row flex-col">
      <div className="w-full md:w-[400px]">
        <div className="px-5 md:px-0 flex sm:items-center justify-between sm:flex-row flex-col">
          <button
            onClick={() => setShowFolders((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-2 hover:bg-[#d1d1d179] duration-200 rounded-md hover:text-blue-600 ${
              showFolders && "bg-[#d1d1d179] text-blue-600"
            }`}
          >
            <GiCycle
              className={`duration-200 ${showFolders ? "rotate-[180deg]" : ""}`}
            />
            <span>{showFolders ? "Close" : "Change T-Shirt"}</span>
          </button>
          <div className="sm:ml-0 ml-auto">
            {selectedFolder?.genders && (
              <RadioSelect
                value={gender}
                setValue={setGender}
                options={[
                  { label: "Man", value: "boy" },
                  { label: "Woman", value: "girl" },
                ]}
              />
            )}
          </div>
        </div>
        {showFolders && (
          <div className="px-5 md:px-0 flex items-center gap-2 mt-3">
            {images?.map((img) => (
              <button
                onClick={() => setSelectedFolder(img)}
                key={img.folder}
                className={`duration-100 border-2 p-1 ${
                  img.folder === selectedFolder.folder && "border-blue-600"
                }`}
              >
                <img
                  src={`/tshirt/${img.folder}/boy-white.png`}
                  alt="T-Shirt"
                  className="w-[80px] h-[80px]"
                />
              </button>
            ))}
          </div>
        )}
        <div ref={elementRef} className="mt-3 relative">
          <img
            src={`./tshirt/${selectedFolder.folder}/${gender}-${tshirtColor}${
              !showFront ? "-back" : ""
            }.png`}
            alt="T-Shirt"
            className="w-[300px] sm:w-[500px] mx-auto md:w-full object-contain"
          />
          <FabricJSCanvas
            className="main-canvas absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[123px] h-[216px] sm:w-[181px] sm:h-[386px] md:w-[171px] md:h-[310px]"
            onReady={onReady}
          />
        </div>
        <div className="px-5 md:px-0">
          <button
            onClick={() => setShowFront((prev) => !prev)}
            className="flex items-center gap-2 justify-center w-full py-2.5 text-lg bg-blue-600 text-white rounded-md mt-3 hover:bg-blue-500 duration-200"
          >
            <VscDebugStepBack
              className={`text-xl duration-200 ${
                showFront && "rotate-[180deg]"
              }`}
            />
            <span>{showFront ? "Back Side" : "Front Side"}</span>
          </button>
          <button
            onClick={captureScreenshot}
            className="flex items-center gap-2 justify-center w-full py-2.5 text-lg bg-blue-600 text-white rounded-md mt-3 hover:bg-blue-500 duration-200"
          >
            <BiCloudDownload className="text-2xl" />
            <span>Download</span>
          </button>
        </div>
      </div>
      <div className="px-5 md:px-0 w-full md:w-[350px]">
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
                      {selectedFolder?.colors?.map((color, idx) => (
                        <button
                          key={color.value}
                          onClick={() => setTShirtColor(color.label)}
                          className={`w-12 h-7 border border-black duration-150 ${
                            tshirtColor === color.label && "scale-[1.2]"
                          }`}
                          style={{ backgroundColor: color.value }}
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
                      <button className="px-5 md:px-0 py-1.5 text-sm font-medium rounded-tr-md rounded-br-md bg-blue-500 text-white">
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
                                  updatedTexts[idx].object.text = value;
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
  { label: "white", value: "#fff" },
  { label: "black", value: "#000" },
  { label: "gray", value: "#c1c6d6" },
  { label: "sky", value: "#81ccd7" },
  { label: "yellow", value: "#ffad00" },
  { label: "pink", value: "#ff8268" },
  { label: "green", value: "#003936" },
  { label: "red", value: "#560007" },
];

const images = [
  {
    folder: "1",
    colors: [
      { label: "white", value: "#fff" },
      { label: "black", value: "#000" },
      { label: "gray", value: "#c1c6d6" },
      { label: "sky", value: "#81ccd7" },
      { label: "yellow", value: "#ffad00" },
      { label: "pink", value: "#ff8268" },
      { label: "green", value: "#003936" },
      { label: "red", value: "#560007" },
    ],
    genders: [
      { label: "Man", value: "boy" },
      { label: "Woman", value: "girl" },
    ],
  },
  {
    folder: "2",
    colors: [
      { label: "white", value: "#fff" },
      { label: "black", value: "#000" },
    ],
  },
  {
    folder: "3",
    colors: [
      { label: "white", value: "#fff" },
      { label: "black", value: "#000" },
      { label: "gray", value: "#c1c6d6" },
    ],
  },
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
