/**
 * @description Функция, передаваемая вторым аргументом в JSON.stringify для кастомной обработки значений.
 * Заменяет значения типа undefined на строку 'undefined'. Если этого не делать, то ключи со значениями undefined
 * не попадут в сериализованное представление объекта.
 */
export const replacer = (key, value) => (value === undefined ? 'undefined' : value);

/**
 * @description Функция-обертка над JSON.stringify.
 * Использует свой replacer, который заменяет значения значения типа undefined на строку 'undefined'.
 * Если этого не делать, то ключи со значениями undefined не попадут в сериализованное представление объекта.
 *
 * @param {any} item Объект/массив для сериализации.
 * @param {string|number} [spaces] Количество пробелов или символы отступа.
 * @returns {string} Сериализованный объект/массив.
 *
 * @example
 * jsonStringify({1: '1', 2: undefined}); // {"1":"1","2":"undefined"}
 * // Для сравнения
 * JSON.stringify({1: '1', 2: undefined}); // {"1":"1"}
 */
const jsonStringify = (item, spaces) => {
    return JSON.stringify(item, replacer, spaces);
};

export default jsonStringify;
