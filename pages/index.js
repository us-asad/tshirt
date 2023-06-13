/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import { GiCycle } from "react-icons/gi";
import { VscDebugStepBack } from "react-icons/vsc";
import { BiCloudDownload } from "react-icons/bi";
import { AiFillEdit, AiOutlineBgColors, AiOutlineZoomIn } from "react-icons/ai";
import { TbTextSize } from "react-icons/tb";
import TextCard from "../components/TextCard";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import RadioSelect from "../components/RadioSelect";
import html2canvas from "html2canvas";
import ZoomableImg from "../components/ZoomableImg";
import { BsEmojiSmileUpsideDown } from "react-icons/bs";
import dynamic from "next/dynamic";
import icons from "../utils/icons";
import IconCard from "../components/IconCard";

const FontIconPicker = dynamic(
  () => import("@fonticonpicker/react-fonticonpicker"),
  { ssr: false }
);

export default function Home() {
  const [tab, setTab] = useState("colors");
  const [tshirtColor, setTShirtColor] = useState("white");
  const [texts, setTexts] = useState([]);
  const { editor, onReady } = useFabricJSEditor();
  const [gender, setGender] = useState("boy");
  const [showFront, setShowFront] = useState(true);
  const [showFolders, setShowFolders] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(images[0]);
  const [selectedObject, setSelectedObject] = useState(null);
  const elementRef = useRef(null);
  const [zoomImg, setZoomImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [icons, setIcons] = useState([]);

  const renderZoomImage = (zoomStateChange, force) => {
    if (zoomStateChange && zoomImg) {
      return setTimeout(() => {
        html2canvas(elementRef.current).then((canvas) => {
          setZoomImg(canvas.toDataURL());
        });
      }, 10);
    }

    if (force)
      html2canvas(elementRef.current).then((canvas) => {
        setZoomImg(canvas.toDataURL());
      });
  };

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
      renderZoomImage(true);
    }
  };

  const addNewIcon = (iconClassName) => {
    if (!iconClassName) return;

    const content = document.querySelector(
      "." + iconClassName.replaceAll(" ", ".")
    );
    const styles = window.getComputedStyle(content, "::before");

    const icon = new fabric.IText(styles.content.replaceAll('"', ""), {
      fontFamily: "Font Awesome 6 Free",
      fontWeight: 900,
      fontSize: 20,
      fill: "red",
    });

    editor.canvas.add(icon);

    setIcons((prev) => [
      { className: iconClassName, object: icon, id: Date.now() },
      ...prev,
    ]);
    renderZoomImage(true);
  };

  const changeMode = () => {
    if (selectedObject) {
      editor?.canvas?.discardActiveObject();
      selectedObject.setCoords();
      editor?.canvas?.renderAll();
      setSelectedObject(null);
    }

    if (!zoomImg) {
      renderZoomImage(false, true);
    } else setZoomImg("");
  };

  const changeTShirtColor = (color) => {
    setTShirtColor(color.label);
    renderZoomImage(true);
  };

  const removeText = ({ object, index }) => {
    setTexts((prev) => {
      const updatedTexts = [...prev];
      updatedTexts.splice(index, 1);
      return updatedTexts;
    });
    editor?.canvas?.remove(object);
  };

  const changeText = ({ value, index }) => {
    setTexts((prev) => {
      const updatedTexts = [...prev];
      updatedTexts[index].object.text = value;
      updatedTexts[index].value = value;
      return updatedTexts;
    });
  };

  const removeIcon = ({ index, object }) => {
    setIcons((prev) => {
      const updatedTexts = [...prev];
      updatedTexts.splice(index, 1);
      return updatedTexts;
    });
    editor?.canvas?.remove(object);
  };

  useEffect(() => {
    if (!selectedFolder?.genders) setGender("boy");
    setTShirtColor(selectedFolder.colors[0].label);
    renderZoomImage(true);
  }, [selectedFolder]);

  useEffect(() => {
    const activeObj = editor?.canvas?.getActiveObject();
    if (activeObj) setSelectedObject(activeObj);
    else setSelectedObject(null);
  }, [editor]);

  useEffect(() => {
    renderZoomImage(true);
  }, [showFront]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 6000);
  }, []);

  return (
    <div className="py-10 flex gap-10 justify-center md:items-start items-center md:flex-row flex-col">
      <div className="w-full md:w-[400px]">
        <div className="px-5 md:px-0 flex sm:items-center justify-between sm:flex-row flex-col">
          <button
            onClick={() => setShowFolders((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-2 hover:bg-blue-100 duration-200 rounded-md hover:text-blue-600 ${
              showFolders && "bg-blue-100 text-blue-600"
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
        <div className="mt-3">
          {zoomImg ? <ZoomableImg src={zoomImg} /> : null}

          <div
            className={zoomImg ? "absolute opacity-0 pointer-events-none" : ""}
          >
            <div ref={elementRef} className="relative">
              <img
                src={`./tshirt/${
                  selectedFolder.folder
                }/${gender}-${tshirtColor}${!showFront ? "-back" : ""}.png`}
                alt="T-Shirt"
                className="w-[300px] sm:w-[500px] mx-auto md:w-full object-contain"
              />
              <FabricJSCanvas
                className="main-canvas absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[123px] h-[216px] sm:w-[181px] sm:h-[386px] md:w-[171px] md:h-[310px]"
                onReady={onReady}
              />
            </div>
          </div>
        </div>
        <div className="px-5 md:px-0">
          <button
            onClick={changeMode}
            className="flex items-center w-max ml-auto gap-2 mt-3 px-2.5 py-1.5 hover:bg-blue-100 rounded-md duration-200 hover:text-blue-500"
          >
            {!zoomImg ? (
              <>
                <AiOutlineZoomIn />
                <span>Zoom Mode</span>
              </>
            ) : (
              <>
                <AiFillEdit />
                <span>Editing Mode</span>
              </>
            )}
          </button>
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
          <button
            onClick={() => setTab("icons")}
            className={`flex items-center justify-center gap-3 px-3 py-2 border-b-2 border-transparent hover:border-b-blue-600 duration-200 hover:text-blue-600 ${
              tab === "icons" && "border-b-blue-600 text-blue-600"
            }`}
          >
            <BsEmojiSmileUpsideDown className="text-lg" />
            <span>Icons</span>
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
                      {selectedFolder?.colors?.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => changeTShirtColor(color)}
                          className={`w-12 h-7 border border-black duration-150 ${
                            tshirtColor === color.label && "scale-[1.2]"
                          }`}
                          style={{ backgroundColor: color.value }}
                        ></button>
                      ))}
                    </div>
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
                                changeText({
                                  value,
                                  index: idx,
                                })
                              }
                              remove={() =>
                                removeText({
                                  object: value.object,
                                  index: idx,
                                })
                              }
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
              icons: (
                <div className="flex flex-col gap-6">
                  {!loading && (
                    <>
                      <div className="flex justify-end">
                        <FontIconPicker
                          onChange={addNewIcon}
                          icons={icons.map((icon) => `fa-solid fa-${icon}`)}
                          theme="bluegrey"
                          renderUsing="class"
                        />
                      </div>
                      {icons.map((icon, idx) => (
                        <IconCard
                          key={icon.id}
                          editor={editor}
                          remove={() =>
                            removeIcon({ index: idx, object: icon.object })
                          }
                          {...icon}
                        />
                      ))}
                    </>
                  )}
                </div>
              ),
            }[tab]
          }
        </div>
      </div>
    </div>
  );
}

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
