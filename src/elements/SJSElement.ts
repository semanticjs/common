export abstract class SJSElement {
  //  Fields
  protected mountedEls: Array<HTMLElement>;

  //  Properties

  //  Constructors
  constructor() {
    this.mountedEls = [];
  }

  //  API Methods
  public Mount(selector: string | HTMLElement | Array<Element>): void {
    let elements: Array<HTMLElement> = [];

    if (typeof selector === 'string') {
      selector = Array.from(document.querySelectorAll(<string>selector));
    }

    if (selector instanceof HTMLElement) {
      elements = [selector];
    } else {
      const nodeList = Array.from(selector);

      const htmlNodes = Array.from(nodeList)
        .filter((node) => node instanceof HTMLElement)
        .map((node) => <HTMLElement>node);

      elements = [...htmlNodes];
    }

    elements.forEach((el) => {
      this.mountedEls.push(this.mountToElement(el));
    });
  }

  //  Helpers
  protected abstract mountToElement(el: HTMLElement): HTMLElement;
}
