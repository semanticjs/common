/*
 * Used to capitalize the first letter in a string.
 */
export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Used to a string of spaces based on the number requested.
 */
export function createSpaces(spaces: number) {
  let spacing = '';

  for (let i = 0; i < spaces; i++) {
    spacing += ' ';
  }

  return spacing;
}

/**
 * Used to indent a string the given number of spaces.
 */
export function indent(value: string, spaces = 2): string {
  const lines = value.split('\n');

  const spacing = createSpaces(spaces);

  const indentedLines = lines.map((line) => `${spacing}${line}`);

  const indentedStr = indentedLines.join('\n');

  return indentedStr;
}

/*
 * Used to capitalize the first letter in a string.
 */
export function readLines(value: Buffer): string[] {
  var array = value.toString().split('\n');

  return array;
}

/*
 * Used to convert a string from PascalCase to kebab-case.
 */
export function pascalToKebab(value: string): string {
  return value
    .split('')
    .map((letter, index) => {
      if (/[A-Z]/.test(letter)) {
        return ` ${letter.toLowerCase()}`;
      }

      return letter;
    })
    .join('');
}

/*
 * Used to convert a string from kebab-case to PascalCase.
 */
export function kebabToPascal(value: string): string {
  return value
    .split('-')
    .map((word, index) => {
      return capitalize(word);
    })
    .join('');
}
