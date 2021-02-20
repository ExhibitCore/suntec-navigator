/* eslint-disable @typescript-eslint/lines-between-class-members */
import { DocumentProperties, jsPDF as JSPdf } from "jspdf";
import { toast } from "react-toastify";
import api from "./api";
import Constants from "./constants";
import getQueryParam from "./getQueryParam";

class PrintService {
  // constants
  static orientations: ["Landscape", "Portrait"] = ["Landscape", "Portrait"];
  static paperSizes = ["8.5 x 11", "11 x 17", "A4", "A3"];
  private static jspdfFormats = ["letter", "tabloid", "a4", "a3"];
  private static jspdfPortraitDims = [
    [612, 792],
    [792, 1224],
    [595.28, 841.89],
    [841.89, 1190.55],
  ];

  private static getImageType(imgPath: string): string {
    const imgExt = imgPath?.toUpperCase().split(".")?.pop();
    return !imgExt || imgExt === "JPG" ? "JPEG" : imgExt;
  }

  private static async loadImages(paths: string[]): Promise<string[]> {
    try {
      return await api
        .post<{ images: string[] }>(`${Constants.webapiEndpoint}/GetImages`, {
          paths,
        })
        .then((res) => {
          return res.data.images;
        })
        .catch(() => {
          toast.error("Failed to get images", { autoClose: 1000 });
          return [];
        });
    } catch (e) {
      return [];
    }
  }

  static async print(
    selectedOrientation: string,
    selectedPaperSize: string,
    canvasJpegData: string | undefined
  ): Promise<void> {
    if (!canvasJpegData) {
      return;
    }

    const docProps: DocumentProperties = {
      title: "Suntec Navigator",
    };

    const sizeIndex = PrintService.paperSizes.indexOf(selectedPaperSize);
    const doc = new JSPdf({
      orientation: selectedOrientation.toLowerCase() as
        | "landscape"
        | "portrait",
      unit: "pt",
      format: PrintService.jspdfFormats[sizeIndex],
    });
    const width =
      selectedOrientation === "Landscape"
        ? PrintService.jspdfPortraitDims[sizeIndex][1]
        : PrintService.jspdfPortraitDims[sizeIndex][0];
    const height =
      selectedOrientation === "Landscape"
        ? PrintService.jspdfPortraitDims[sizeIndex][0]
        : PrintService.jspdfPortraitDims[sizeIndex][1];

    // add canvas with margins: top: .25", left, right: .1", bottom: 1"
    // use multiplier to make high dpi
    doc.addImage(canvasJpegData, "JPEG", 7, 18, width - 14, height - 72);
    /// add company watermark/footer
    try {
      // load logo
      const image = (await PrintService.loadImages([Constants.headerLogo]))[0];
      const imgType = PrintService.getImageType(Constants.headerLogo);
      doc.addImage(image, imgType, 20, height - 35, 72, 25);
    } catch (err) {
      toast.error("Failed to attach company logo to pdf. Still creating...");
    }
    doc.setFontSize(9);

    // typically for suntec, print using query params
    if (getQueryParam("event_name")) {
      const topLine = `Event: ${getQueryParam("event_name")}`;
      doc.text(topLine, 108, height - 31);
    }
    if (getQueryParam("company_name")) {
      const secondLine = `Company: ${getQueryParam("company_name")}`;
      doc.text(secondLine, 108, height - 21);
    }

    docProps.author = "Suntec Singapore Staff";
    docProps.creator = `${new Date()
      .getFullYear()
      .toString()} © Suntec Singapore`;

    // save pdf and close
    doc.setProperties(docProps);
    try {
      const filename = "untitled_plan.pdf";
      doc.save(filename);
    } catch (err) {
      toast.error("Failed to save printout");
      console.error("failed to save printout", err);
    }
  }
}

export default PrintService;
