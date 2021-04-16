/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useEffect, useState } from "react";
import { Global, css, jsx } from "@emotion/react";
// add toast support
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import Space from "./types/Space";
import "./App.css";
import ActionSidebar from "./components/ActionSidebar";
import FabricService from "./services/FabricService";
import AppHeader from "./components/AppHeader";
import getQueryParam from "./services/getQueryParam";
import PrintService from "./services/printService";
import api from "./services/api";
import Constants from "./services/constants";

const sidebarWidth = 150;
const topbarHeight = 50;
const leftTitleHeight = 24;

const App = (): JSX.Element => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [fabricService, setFabricService] = useState<FabricService>();
  const [leftWidth, setLeftWidth] = useState(800);

  const changeLevel = (level: string) => {
    const spaceList = spaces.filter((s) => s.floorNumber === level);
    if (spaceList && spaceList.length > 0) {
      fabricService?.loadFloor(spaceList);
    }
  };

  const print = (selectedOrientation: string, selectedPaperSize: string) => {
    if (fabricService) {
      PrintService.print(
        selectedOrientation,
        selectedPaperSize,
        fabricService.getCanvasAsJpeg()
      );
    } else {
      toast.error("Canvas not ready to print");
    }
  };

  useEffect(() => {
    // loads fabric canvas and also set resize to properly set canvas size
    const myCanvas = new FabricService("canvas");
    setFabricService(myCanvas);

    // Handler to call on window resize
    const handleResize = () => {
      const canvasWidth = window.innerWidth - sidebarWidth;
      const canvasHeight = window.innerHeight - topbarHeight - leftTitleHeight;
      setLeftWidth(canvasWidth);
      myCanvas.setCanvasSize(canvasHeight, canvasWidth);
    };

    // add event listener and ensure size is properly set by calling immeidately
    window.addEventListener("resize", handleResize);
    handleResize();

    // UseEffect's cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      myCanvas.dispose();
    };
  }, []);

  useEffect(() => {
    const loadSpaces = async () => {
      try {
        const codes = getQueryParam("spaces");
        if (!codes) {
          return;
        }
        await api
          .get<Space[]>(
            `${Constants.webapiEndpoint}/GetSpaceDataByCodes?SpaceCodes=${codes}`
          )
          .then((res) => {
            // set spaces and default to first space
            const val = res.data.map((s) => ({
              ...s,
              floorPlanFile: `${Constants.contentEndPoint}${s.floorPlanFile}`,
            }));
            setSpaces(val);
            if (val.length > 0) {
              changeLevel(val[0].floorNumber);
            }
          })
          .catch(() => {
            toast.error("Failed to load spaces.", { autoClose: 1000 });
          });
      } catch (e) {
        toast.error("Failed to load spaces..", { autoClose: 1000 });
      }
    };

    if (fabricService) {
      loadSpaces();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fabricService]);

  const title = getQueryParam("event_name") || " ";
  return (
    <div className="App">
      <Global
        styles={css`
          @font-face {
            font-family: "Comfortaa";
            src: url(font/Comfortaa-Regular.ttf) format("truetype");
          }
        `}
      />
      <AppHeader height={topbarHeight} />
      <div style={{ display: "flex" }}>
        <div
          css={css`
            width: ${leftWidth}px;
          `}
        >
          <div
            css={css`
              font-family: Comfortaa;
              font-weight: bold;
              font-size: 12px;
              text-align: left;
              margin: 4px 6px;
              height: 14px;
            `}
          >
            {title}
          </div>
          <hr
            css={css`
              margin: 0px 6px;
            `}
          />
          <canvas id="canvas" />
        </div>
        <ActionSidebar
          width={sidebarWidth}
          spaces={spaces}
          onLevelChange={changeLevel}
          onPrint={print}
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;
