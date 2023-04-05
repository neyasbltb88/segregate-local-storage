import EventEmitter from './utils/EventEmitter';
import CustomStorage from './utils/CustomStorage';

// Приватный объект для хранения инстансов, чтобы организовать принцип синглтона
// при инициализации с одинаковыми именами модулей
const instances: Record<string, SegregateLocalStorage> = {};
// Приватный объект для хранения имен деактивированных модулей
const destroyed: Record<string, boolean> = {};

const isObject = (param: any): param is Object => typeof param === 'object' && param !== null && !Array.isArray(param);

const prepareStorage = (
    name: string,
    defaultValue: Object,
    removeOtherValues: boolean,
    storage: Storage | CustomStorage
) => {
    const restored = storage.getItem(name);

    // Если под ключом name в localStorage ничего нет,
    // то сохраним под этим ключом полученное значение по умолчанию
    if (!restored) {
        storage.setItem(name, JSON.stringify(defaultValue));

        return true;
    }

    // Если в storage уже есть что-то сохраненное под именем name,
    // и оно является объектом, и полученное значение по умолчанию тоже объект,
    // то объединим их на случай, если в defaultValue добавились какие-то поля,
    // которых еще не было в ранее сохраненных данных
    try {
        const restoredParsed = JSON.parse(restored);
        if (!restored || !isObject(restored) || !isObject(defaultValue)) return false;

        // Если передан флаг удаления старых значений
        if (removeOtherValues) {
            const defaultValueKeysSet = new Set(Object.keys(defaultValue));
            const restoredKeys = Object.keys(restoredParsed);

            // Удаляем из восстановленных данных те, которых сейчас нет в defaultValue
            // т.е. для случаев, когда раньше данные сохранялись уже,
            // а теперь больше не используются и их нужно почистить
            restoredKeys.forEach((restoredKey) => {
                if (defaultValueKeysSet.has(restoredKey)) return;

                delete restoredParsed[restoredKey];
            });
        }

        const restoredFull = { ...defaultValue, ...restoredParsed };
        storage.setItem(name, JSON.stringify(restoredFull));

        return true;
    } catch (error) {}
};

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
class SegregateLocalStorage extends EventEmitter {
    protected name: string = '';
    protected storage: Storage | CustomStorage;

    constructor(
        name: string,
        defaultValue: Object = {},
        removeOtherValues: boolean = false,
        storage: Storage | CustomStorage = localStorage
    ) {
        super();

        // Создаваемые с одинаковыми именами хранилища будут синглтонами
        if (instances[name]) return instances[name];

        this.init(name, defaultValue, removeOtherValues, storage);

        return this;
    }

    /**
     * @description Присваивает ключу key значение val в рамках своего модуля.
     * @param {string} key - Ключ.
     * @param {any} val - Значение.
     * @returns {T|void} - Возвращает результат присвоения в хранилище.
     */
    set<T>(key: string, val: any): T | void {
        if (this.isDestroyed) return;
        if (val === undefined) return;

        const tmp = JSON.parse(this.storage.getItem(this.name)!);
        if (!tmp) return;

        const oldVal = tmp[key];
        tmp[key] = val;
        const res = <T>this.storage.setItem(this.name, JSON.stringify(tmp));

        this.emit('set', { key, val, oldVal });
        this.emit(key, val);

        return res;
    }

    /**
     * @description Возвращает значение из модуля, сохраненное под ключом из параметра key.
     * @param {string} key - Ключ в модуле.
     * @returns {T|undefined} - Значение, сохраненное в модуле под ключом из параметра key.
     */
    get<T>(key: string): T | undefined {
        if (this.isDestroyed) return;

        const tmp = JSON.parse(this.storage.getItem(this.name)!);
        if (!tmp) return;

        const val = tmp[key];

        this.emit('get', { key, val });

        return val;
    }

    /**
     * @description Возвращает свой полный модуль данных.
     * @returns {T|undefined} - Сохраненный объект модуля.
     */
    getAll<T>(): T | undefined {
        if (this.isDestroyed) return;

        const tmp = JSON.parse(this.storage.getItem(this.name) ?? '{}');

        this.emit('getAll', tmp);

        return tmp;
    }

    /**
     * @description Удаляет из модуля данные под ключом из параметра key.
     * @param {String} key - Ключ, данные которого необходимо удалить.
     * @returns {T|void} - Возвращает результат удаления из хранилища.
     */
    remove<T>(key: string): T | void {
        if (this.isDestroyed) return;

        const tmp = JSON.parse(this.storage.getItem(this.name)!);
        if (!tmp) return;

        const val = tmp[key];
        delete tmp[key];
        const res = <T>this.storage.setItem(this.name, JSON.stringify(tmp));

        this.emit('remove', { key, val });

        return res;
    }

    /**
     * @description Полностью удаляет свой модуль из Storage.
     * @returns {T|void} - Возвращает результат очистки хранилища.
     */
    clear<T>(): T | void {
        if (this.isDestroyed) return;

        this.emit('clear');

        return <T>this.storage.removeItem(this.name);
    }

    /**
     * @description Деактивирует текущий инстанс
     */
    destroy(): void {
        if (this.isDestroyed) return;

        destroyed[this.name] = true;
        delete instances[this.name];

        this.emit('destroy');
    }

    /**
     * @description Флаг деактивированного состояния инстанса
     * @readonly
     */
    get isDestroyed(): boolean {
        return !!destroyed[this.name];
    }

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
    init(
        name: string,
        defaultValue: Object = {},
        removeOtherValues: boolean = false,
        storage: Storage | CustomStorage = localStorage
    ): this {
        delete destroyed[name];

        this.name = name;
        this.storage = storage;
        prepareStorage(name, defaultValue, removeOtherValues, storage);
        instances[name] = this;

        this.emit('init');

        return this;
    }
}

export default SegregateLocalStorage;
