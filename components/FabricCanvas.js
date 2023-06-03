/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { useDebounce } from "use-debounce";

export default function FabricCanvas() {
  const { selectedObjects, editor, onReady } = useFabricJSEditor();
  const {
    selectedObjects2,
    editor: editor2,
    onReady: onReady2,
  } = useFabricJSEditor();
  // console.log(, canvas, "canvas")
  const [texts, setTexts] = useState([]);
  const newTextRef = useRef();
  const [color, setColor] = useState("red");
  const [svgObj, setSvgObj] = useState({});
  const [debouncedColor] = useDebounce(color, 1000);
  const [show, setShow] = useState(true);

  const addText = () => {
    const { value } = newTextRef.current || {};

    const text = new fabric.Text(value, {
      left: 50,
      top: 50,
      fontSize: 24,
      selectable: true,
    });

    editor2.canvas?.add(text);

    setTexts((prev) => [{ value, object: text }, ...prev]);
    newTextRef.current.value = "";
  };

  const removeText = (data) => {
    console.log(data);
    setTexts((prev) => prev.filter((text) => text.value !== data.value));

    editor2.canvas?.remove(data.object);
  };

  const addTshirtImage = (color = "red") => {
    fabric.loadSVGFromURL("/test.svg", (objects, options) => {
      const svg = fabric.util.groupSVGElements(objects, options);
      svg.fill = color;
      setSvgObj(svg);
      editor?.canvas?.setActiveObject(svg);
      const canvasWidth = editor?.canvas?.getWidth();
      const canvasHeight = editor?.canvas?.getHeight();

      const aspectRatio = svg.width / svg.height;
      let width, height, left, top;

      if (canvasWidth / aspectRatio <= canvasHeight) {
        width = canvasWidth;
        height = canvasWidth / aspectRatio;
        left = 0;
        top = (canvasHeight - height) / 2;
      } else {
        width = canvasHeight * aspectRatio;
        height = canvasHeight;
        left = (canvasWidth - width) / 2;
        top = 0;
      }

      svg.scaleToWidth(350, true);
      svg.set({
        selectable: false,
        evented: false,
        width,
        height,
        top: -60,
        left: -140,
        // scale: 200
      });

      editor?.canvas?.add(svg);
    });
  };

  // const downloadCanvas = () => {
  //   const href = editor?.canvas?.toDataURL({
  //     format: "png",
  //     quality: 1,
  //   });
  //   console.log(href, "href");
  //   const aEl = document.createElement("a");
  //   aEl.href = href;
  //   aEl.download = "tshirt.png";
  //   aEl.click();
  // };

  useEffect(() => {
    setTimeout(() => {
      setColor("#000")
    }, 2000);
  }, []);

  useEffect(() => {
    if (svgObj.fill) {
      addTshirtImage(debouncedColor);
    }
    svgObj.fill = debouncedColor;
  }, [debouncedColor]);

  return (
    <div className="max-w-[1200px] mx-auto my-10">
      <div className="flex gap-[100px]">
        <div className="w-[400px] h-[400px] border border-gray-400 relative">
          {show && (
            <FabricJSCanvas
              className="main-canvas w-[400px] h-[400px]"
              onReady={onReady}
            />
          )}
          <FabricJSCanvas
            onReady={onReady2}
            className="canvas-2 absolute top-[89px] left-[114px] w-[171px] h-[263px]"
          />
        </div>
        <div>
          <div className="relative">
            <input
              type="color"
              onChange={(e) => setColor(e.target.value)}
              value={color}
            />
          </div>
          <div className="flex gap-2 items-center">
            <input
              ref={newTextRef}
              type="text"
              className="border border-gray-400 rounded-md px-3 py-1 text-[14px] w-[230px]"
            />
            <button
              onClick={addText}
              className="py-1 px-6 bg-blue-600 text-white rounded-md hover:opacity-80 duration-200"
            >
              Add
            </button>
          </div>
          <div className="flex flex-col gap-3 mt-4">
            {texts.map((data, idx) => (
              <div key={idx} className="flex justify-between">
                <b>{data.value}</b>
                <button
                  onClick={() => removeText(data)}
                  className="text-red-600 font-bold"
                >
                  X
                </button>
              </div>
            ))}
          </div>
          {/* <button
            onClick={downloadCanvas}
            className="mt-10 w-full py-2 px-6 bg-blue-600 text-white rounded-md hover:opacity-80 duration-200"
          >
            Download
          </button> */}
        </div>
      </div>
    </div>
  );
}
