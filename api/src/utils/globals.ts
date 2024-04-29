/**
 * In this file we will define all the global variables and functions.
 */

/**
 * @param {string} word
 * @return {string}
 * Capitalize the first letter of the string.
 */
export function capitalizeFirstLetter(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * @param {string} word
 * * @return {string}
 * Capitalize all the first letter of the string.
 */
export function capitalizeWords(word: string) {
    return word.replace(/\b\w/g, (l) => l.toUpperCase());
}
