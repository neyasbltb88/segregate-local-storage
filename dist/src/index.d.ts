import EventEmitter from './utils/EventEmitter';
import CustomStorage from './utils/CustomStorage';
/**
 * @class Сохраняет в Storage изолированные друг от друга модули
 * в виде сериализованных объектов, сохраненных под ключом из параметра name.
 * Позволяет получать, присваивать и добавлять данные в модуль, сам производит сериализацию и парсинг.
 * При создании нескольких экземпляров с одним и тем же именем, повторного создания не произойдет,
 * а будет возвращен один и тот же инстанс.
 * @param {String} name - Имя модуля, под которым данные будут сохраняться в Storage.
 * @param {Object} [defaultValue={}] - Объект начального состояния.
 * При первой инициализации класса этот объект сохранится в Storage под ключом из параметра name.
 * Если при следующих инициализациях в этот объект будут добавлены новые свойства,
 * они так же будут добавлены в модуль в Storage,
 * но уже существующие в нем ранее сохраненные данные не будут затронуты.
 * @param {Boolean} [removeOtherValues=false] - Если передано true, при инициализации удалит из модуля
 * в Storage данные под теми ключами, которых сейчас нет в объекте параметра defaultValue.
 */
declare class SegregateLocalStorage extends EventEmitter {
    protected name: string;
    protected storage: Storage | CustomStorage;
    constructor(name: string, defaultValue?: Object, removeOtherValues?: boolean, storage?: Storage | CustomStorage);
    /**
     * @description Присваивает ключу key значение val в рамках своего модуля.
     * @param {string} key - Ключ.
     * @param {any} val - Значение.
     * @returns {T|void} - Возвращает результат присвоения в хранилище.
     */
    set<T>(key: string, val: any): T | void;
    /**
     * @description Возвращает значение из модуля, сохраненное под ключом из параметра key.
     * @param {string} key - Ключ в модуле.
     * @returns {T|undefined} - Значение, сохраненное в модуле под ключом из параметра key.
     */
    get<T>(key: string): T | undefined;
    /**
     * @description Возвращает свой полный модуль данных.
     * @returns {T|undefined} - Сохраненный объект модуля.
     */
    getAll<T>(): T | undefined;
    /**
     * @description Удаляет из модуля данные под ключом из параметра key.
     * @param {String} key - Ключ, данные которого необходимо удалить.
     * @returns {T|void} - Возвращает результат удаления из хранилища.
     */
    remove<T>(key: string): T | void;
    /**
     * @description Полностью удаляет свой модуль из Storage.
     * @returns {T|void} - Возвращает результат очистки хранилища.
     */
    clear<T>(): T | void;
    /**
     * @description Деактивирует текущий инстанс
     */
    destroy(): void;
    /**
     * @description Флаг деактивированного состояния инстанса
     * @readonly
     */
    get isDestroyed(): boolean;
    /**
     * @description Инициализирует инстанс класса
     * @param {String} name - Имя модуля, под которым данные будут сохраняться в Storage.
     * @param {Object} [defaultValue={}] - Объект начального состояния.
     * При первой инициализации класса этот объект сохранится в Storage под ключом из параметра name.
     * Если при следующих инициализациях в этот объект будут добавлены новые свойства,
     * они так же будут добавлены в модуль в Storage,
     * но уже существующие в нем ранее сохраненные данные не будут затронуты.
     * @param {Boolean} [removeOtherValues=false] - Если передано true, при инициализации удалит из модуля
     * в Storage данные под теми ключами, которых сейчас нет в объекте параметра defaultValue.
     */
    init(name: string, defaultValue: object, removeOtherValues: boolean, storage: Storage | CustomStorage): this;
}
export default SegregateLocalStorage;
//# sourceMappingURL=index.d.ts.map