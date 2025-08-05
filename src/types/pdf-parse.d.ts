declare module "pdf-parse" {
  interface PDFInfo {
    pdfInfo: {
      numpages: number;
      numrender: number;
      info: object;
      metadata: any;
    };
    text: string;
  }

  interface PDFParseOptions {
    // You can extend this based on the actual API
  }

  function pdfParse(
    dataBuffer: Buffer,
    options?: PDFParseOptions
  ): Promise<PDFInfo>;

  export = pdfParse;
}
