/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useEffect, useState } from "react";
import { css, jsx } from "@emotion/react";

import Space from "../types/Space";
import PrintService from "../services/printService";

interface ActionSidebarProps {
  width: number;
  spaces: Space[];
  onLevelChange: (level) => void;
  onPrint: (selectedOrientation: string, selectedPaperSize: string) => void;
}

const ActionSidebar: React.FC<ActionSidebarProps> = (
  props: ActionSidebarProps
): JSX.Element => {
  const { width, spaces, onLevelChange, onPrint } = props;
  const floorLevels = spaces
    ? Array.from(new Set(spaces.map((s) => s.floorNumber)))
    : [];

  const [level, setLevel] = useState(floorLevels[0] || -1);
  const [orientation, setOrientation] = useState<string>(
    PrintService.orientations[0]
  );
  const [paperSize, setPaperSize] = useState(PrintService.paperSizes[0]);

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLevel(e.target.value);
  };
  useEffect(() => onLevelChange(level), [level, onLevelChange]);

  // need useEffect to ensure initial load works
  useEffect(() => {
    if (level === -1 && floorLevels.length > 0) {
      setLevel(floorLevels[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floorLevels]);

  return (
    <div
      css={css`
        width: ${width}px;
        font-size: 14px;
        border-left: 4px solid #aeaeae;
        padding: 0px 6px;
      `}
    >
      <div
        css={css`
          font-family: Comfortaa;
          font-weight: bold;
          text-align: left;
          margin: 4px 6px;
        `}
      >
        Options
      </div>
      <hr
        css={css`
          margin: 0px 6px;
        `}
      />
      <br />
      <div>Select Floor:</div>
      <select
        css={css`
          width: ${width - 17}px;
          overflow-y: auto;
        `}
        size={4}
        value={level}
        onChange={handleLevelChange}
      >
        {floorLevels.map((f) => (
          <option key={f} value={f}>
            Level {f}
          </option>
        ))}
      </select>
      <br />
      <hr />
      <div
        css={css`
          font-weight: bold;
          font-size: 14px;
        `}
      >
        PDF Options
      </div>
      <div>Orientation:</div>
      <select onChange={(e) => setOrientation(e.target.value)}>
        {PrintService.orientations.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <div>Paper Size:</div>
      <select onChange={(e) => setPaperSize(e.target.value)}>
        {PrintService.paperSizes.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>
      <br />
      <button
        css={css`
          margin-top: 8px;
        `}
        type="button"
        onClick={() => onPrint(orientation, paperSize)}
      >
        Create PDF
      </button>
    </div>
  );
};

export default ActionSidebar;
