/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";

export default function FabricContentCanvas() {

  


  return (
    <FabricJSCanvas
      className="main-canvas absolute top-[70px] left-[120px] w-[171px] h-[310px]"
      onReady={onReady}
    />
  );
}
