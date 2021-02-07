type RenderFn = (
  context: CanvasRenderingContext2D,
  sizeMultiplier: number
) => void;

export class RenderQueue {
  private renderMap = new Map<string, RenderFn>();

  constructor(reservedKeys?: string[]) {
    reservedKeys && reservedKeys.forEach(key => this.add(key, () => {}))
  }
  add(id: string, renderFn: RenderFn) {
    this.renderMap.set(id, renderFn);
  }

  render(canvasElement: HTMLCanvasElement, sizeMultiplier = 1) {
    const context = canvasElement.getContext('2d');
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    this.renderMap.forEach((render, key) => {
      render(context, sizeMultiplier);
    });
  }

  clone(): RenderQueue {
    const mapClone = new Map();
    let instance = new RenderQueue()
    this.renderMap.forEach((value, key) => {
      mapClone.set(key, value)
    });
    instance.renderMap = mapClone;
    return instance
  }
}
