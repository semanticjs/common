/*
 * Used to delay processing of something.
 */
export function Delay<TArgs extends any[]>(
  ms: number,
  ...args: TArgs
): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms, args));
}

declare global {
  interface Promise<T> {
    delay(ms: number): Promise<T>;
  }
}

Promise.prototype.delay = function (ms: number): Promise<any> {
  return this.then((args) => {
    return Delay(ms, args);
  });
};

declare global {
  interface PromiseConstructor {
    Delay(ms: number): Promise<unknown>;
  }
}

Promise.Delay = function <TArgs extends any[]>(
  ms: number,
  ...args: TArgs
): Promise<unknown> {
  return Delay(ms, args);
};
