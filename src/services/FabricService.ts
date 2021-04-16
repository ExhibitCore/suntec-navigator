import { fabric } from "fabric-with-gestures";
import Space from "../types/Space";

class FabricService {
  private myCanvas;

  private lastLoadedSpaces: Space[] = [];

  constructor(id: string) {
    fabric.perfLimitSizeTotal = 225000000;
    fabric.maxCacheSideLimit = 12000;
    this.myCanvas = new fabric.Canvas(id, {
      height: 800,
      width: 800,
    });
    // needed to ensure canvas copies (like with printing) work right
    fabric.Object.NUM_FRACTION_DIGITS = 17;
    // needed for printout to not use black as base and end up with svg's just being black
    this.myCanvas.setBackgroundColor("rgba(255, 255, 255, 1)", undefined);
  }

  dispose(): void {
    this.myCanvas.dispose();
  }

  setCanvasSize(height: number, width: number): void {
    this.myCanvas.setHeight(height);
    this.myCanvas.setWidth(width);
    if (this.lastLoadedSpaces.length > 0) {
      this.loadFloor(this.lastLoadedSpaces);
    }
  }

  private addImageAndRectangles(img: fabric.Image, spaceArray: Space[]): void {
    img.set({
      scaleX: this.myCanvas.width / img.width,
      scaleY: this.myCanvas.height / img.height,
      selectable: false,
      evented: false,
    });
    this.myCanvas.add(img);

    // there's some odd spacing value in the old code that seems to be a margin... not sure how this should be properly handled
    // TODO: Figure out if we should change values in spaces so this weird margin isn't needed
    const ODD_MARGIN = 59.0551;
    spaceArray.forEach((space: Space) => {
      try {
        const offsetX = space.spaceOffsetPoint.x;
        const offsetY = space.spaceOffsetPoint.y;
        const xScale = this.myCanvas.width / space.floorPlanWidth;
        const yScale = this.myCanvas.height / space.floorPlanHeight;
        const rect = new fabric.Rect({
          left: (offsetX + ODD_MARGIN) * xScale,
          top: (offsetY + ODD_MARGIN) * yScale,
          width: (space.spaceWidth * 12 - 2 * ODD_MARGIN) * xScale,
          height: (space.spaceHeight * 12 - 2 * ODD_MARGIN) * yScale,
          strokeWidth: 2,
          stroke: "#ff0000",
          fill: "rgba(0,0,0,0)",
        });
        this.myCanvas.add(rect);
      } catch {
        // if issue with space loading, ignore space
      }
    });
    this.myCanvas.requestRenderAll();
  }

  loadFloor(spaceArray: Space[]): void {
    if (!spaceArray || spaceArray.length < 1) {
      return;
    }
    this.lastLoadedSpaces = spaceArray;

    // clear existing data
    this.myCanvas.remove(...this.myCanvas.getObjects());
    // load background, then add rectangles for space locations
    // try a file with text and then try the regular if with_txt doesn't exist
    const backgroundPath = spaceArray[0].floorPlanFile.replace(
      ".svg",
      "_with_txt.svg"
    );
    fabric.Image.fromURL(
      backgroundPath,
      (img, isError) => {
        if (isError) {
          const backgroundPath2 = spaceArray[0].floorPlanFile;
          fabric.Image.fromURL(
            backgroundPath2,
            (img2) => {
              this.addImageAndRectangles(img2, spaceArray);
            },
            { crossOrigin: "anonymous" }
          );
        } else {
          this.addImageAndRectangles(img, spaceArray);
        }
      },
      { crossOrigin: "anonymous" }
    );
  }

  getCanvasAsJpeg(): string | undefined {
    return this.myCanvas?.toDataURL({ format: "jpeg", multiplier: 4 });
  }
}

export default FabricService;
