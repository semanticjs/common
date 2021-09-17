import { SJSDoc, SJSDocument } from './SJSDocument';

export class QuerySelectorConfig {
  constructor(public SJSDoc: SJSDocument) {}
}

export const QueryConfig = new QuerySelectorConfig(SJSDoc);

export function DOMQuery(selector: string, context: Element): Array<Element> {
  // context = <Node>(context || document);

  let result: Array<Element> = [];

  // Redirect simple selectors to the more performant function
  if (/^(#?[\w-]+|\.[\w-.]+)$/.test(selector)) {
    switch (selector.charAt(0)) {
      case '#':
        // Handle ID-based selectors
        result = [
          <HTMLElement>(
            QueryConfig.SJSDoc.Root.getElementById(selector.substr(1))
          ),
        ];

      case '.':
        // Handle class-based selectors
        // Query by multiple classes by converting the selector
        // string into single spaced class names
        var classes = selector.substr(1).replace(/\./g, ' ');

        result = Array.from(context.getElementsByClassName(classes));

      default:
        // Handle tag-based selectors
        return Array.from(context.getElementsByTagName(selector));
    }
  }

  // Default to `querySelectorAll`
  return Array.from(context.querySelectorAll(selector));
}
