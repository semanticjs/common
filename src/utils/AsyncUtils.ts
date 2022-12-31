/*
 * Used to delay processing of something.
 */
export function Delay(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
