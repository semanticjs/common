export class SJSElement {
    //  Fields
    protected mountedEl?: HTMLElement;

    //  Properties

    //  Constructors
    constructor() {}

    //  API Methods
    public Mount(selector: string | HTMLElement): void {
        if (typeof selector === 'string') {
            selector = <HTMLElement>document.querySelector(<string>selector);
        }

        this.mountedEl = this.mountToElement(<HTMLElement>selector);
    }

    //  Helpers
    protected mountToElement(el: HTMLElement): HTMLElement {
        return el;
    }
}
