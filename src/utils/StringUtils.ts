export class StringUtils {
    /*
     * Used to capitalize the first letter in a string.
     */
    public static Capitalize(value: string): string {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    /*
     * Used to capitalize the first letter in a string.
     */
    public static ReadLines(value: Buffer): string[] {
        var array = value.toString().split('\n');

        return array;
    }

    /*
     * Used to convert a string from PascalCase to kebab-case.
     */
    public static PascalToKebab(value: string): string {
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
    public static KebabToPascal(value: string): string {
        return value
            .split('-')
            .map((word, index) => {
                return this.Capitalize(word);
            })
            .join('');
    }
}
