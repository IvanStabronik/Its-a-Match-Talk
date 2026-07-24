export type OcrBlock = {
  text: string;
  /** 0–1 normalized; used later for speaker clustering */
  x?: number;
  y?: number;
};

export type OcrResult = {
  text: string;
  blocks: OcrBlock[];
};

export interface OcrProvider {
  isAvailable(): boolean;
  recognizeText(imageUri: string): Promise<OcrResult>;
}

export class MockOcrProvider implements OcrProvider {
  isAvailable(): boolean {
    return true;
  }

  async recognizeText(_imageUri: string): Promise<OcrResult> {
    // P1 scaffold: real ML Kit / Vision later. Fail closed → paste flow.
    throw new Error('OCR_NOT_READY');
  }
}

export function createOcrProvider(): OcrProvider {
  return new MockOcrProvider();
}
