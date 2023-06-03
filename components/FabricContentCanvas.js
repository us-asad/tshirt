/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
 
export default function FabricContentCanvas() {
  const { selectedObjects, editor, onReady } = useFabricJSEditor();
  // console.log(, canvas, "canvas")


  return (
    <div className="max-w-[1200px] mx-auto my-10">
      <div className="flex gap-[100px]">
        <FabricJSCanvas
          className="main-canvas w-[300px] h-[300px] border border-gray-400"
          onReady={onReady}
        />
      </div>
    </div>
  );
}
