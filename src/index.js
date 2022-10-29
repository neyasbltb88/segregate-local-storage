import EventEmitter from './utils/EventEmitter';

// Приватный объект для хранения инстансов, чтобы организовать принцип синглтона
// при инициализации с одинаковыми именами модулей
const instances = {};
// Приватный объект для хранения имен деактивированных модулей
const destroyed = {};

const isObject = (param) => typeof param === 'object' && param !== null && !Array.isArray(param);
const prepareStorage = (name, defaultValue, removeOtherValues) => {
    let restored = localStorage.getItem(name);

    // Если под ключом name в localStorage ничего нет,
    // то сохраним под этим ключом полученное значение по умолчанию
    if (!(name in localStorage) || !restored) {
        localStorage.setItem(name, JSON.stringify(defaultValue));

        return true;
    }

    // Если в localStorage уже есть что-то сохраненное под именем name,
    // и оно является объектом, и полученное значение по умолчанию тоже объект,
    // то объединим их на случай, если в defaultValue добавились какие-то поля,
    // которых еще не было в ранее сохраненных данных
    try {
        restored = JSON.parse(restored);
        if (!isObject(restored) || !isObject(defaultValue)) return false;

        // Если передан флаг удаления старых значений
        if (removeOtherValues) {
            const defaultValueKeysSet = new Set(Object.keys(defaultValue));
            const restoredKeys = Object.keys(restored);

            // Удаляем из восстановленных данных те, которых сейчас нет в defaultValue
            // т.е. для случаев, когда раньше данные сохранялись уже,
            // а теперь больше не используются и их нужно почистить
            restoredKeys.forEach((restoredKey) => {
                if (defaultValueKeysSet.has(restoredKey)) return;

                delete restored[restoredKey];
            });
        }

        restored = { ...defaultValue, ...restored };
        localStorage.setItem(name, JSON.stringify(restored));

        return true;
    } catch (error) {}
};

/**
 * @class Сохраняет в localStorage изолированные друг от друга модули
 * в виде сериализованных объектов, сохраненных под ключом из параметра name.
 * Позволяет получать, присваивать и добавлять данные в модуль, сам производит сериализацию и парсинг.
 * При создании нескольких экземпляров с одним и тем же именем, повторного создания не произойдет,
 * а будет возвращен один и тот же инстанс.
 * @param {String} name - Имя модуля, под которым данные будут сохраняться в localStorage.
 * @param {Object} [defaultValue={}] - Объект начального состояния.
 * При первой инициализации класса этот объект сохранится в localStorage под ключом из параметра name.
 * Если при следующих инициализациях в этот объект будут добавлены новые свойства,
 * они так же будут добавлены в модуль в localStorage,
 * но уже существующие в нем ранее сохраненные данные не будут затронуты.
 * @param {Boolean} [removeOtherValues=false] - Если передано true, при инициализации удалит из модуля
 * в localStorage данные под теми ключами, которых сейчас нет в объекте параметра defaultValue.
 */
class SegregateLocalStorage extends EventEmitter {
    constructor(name, defaultValue = {}, removeOtherValues = false) {
        super();

        // Создаваемые с одинаковыми именами хранилища будут синглтонами
        if (instances[name]) return instances[name];

        this.init(name, defaultValue, removeOtherValues);

        return this;
    }

    /**
     * @description Присваивает ключу key значение val в рамках своего модуля.
     * @param {String} key - Ключ.
     * @param {*} val - Значение.
     * @returns {this} - Возвращает инстанс класса для цепного вызова.
     */
    set(key, val) {
        if (this.isDestroyed) return;

        if (val === undefined) return;
        const tmp = JSON.parse(localStorage.getItem(this.name));
        if (!tmp) return this;

        const oldVal = tmp[key];
        tmp[key] = val;
        localStorage.setItem(this.name, JSON.stringify(tmp));

        this.emit('set', { key, val, oldVal });
        this.emit(key, val);

        return this;
    }

    /**
     * @description Возвращает значение из модуля, сохраненное под ключом из параметра key.
     * @param {String} key - Ключ в модуле.
     * @returns {*} - Значение, сохраненное в модуле под ключом из параметра key.
     */
    get(key) {
        if (this.isDestroyed) return;

        const tmp = JSON.parse(localStorage.getItem(this.name));
        if (!tmp) return this;

        const val = tmp[key];

        this.emit('get', { key, val });

        return val;
    }

    /**
     * @description Возвращает свой полный модуль данных.
     * @returns {Object} - Сохраненный объект модуля.
     */
    getAll() {
        if (this.isDestroyed) return;

        const tmp = JSON.parse(localStorage.getItem(this.name));

        this.emit('getAll', tmp);

        return tmp;
    }

    /**
     * @description Удаляет из модуля данные под ключом из параметра key.
     * @param {String} key - Ключ, данные которого необходимо удалить.
     * @returns {this} - Возвращает инстанс класса для цепного вызова.
     */
    remove(key) {
        if (this.isDestroyed) return;

        const tmp = JSON.parse(localStorage.getItem(this.name));
        if (!tmp) return this;

        const val = tmp[key];

        delete tmp[key];
        localStorage.setItem(this.name, JSON.stringify(tmp));

        this.emit('remove', { key, val });

        return this;
    }

    /**
     * @description Полностью удаляет свой модуль из localStorage.
     * @returns {this} - Возвращает инстанс класса для цепного вызова.
     */
    clear() {
        if (this.isDestroyed) return;

        localStorage.removeItem(this.name);

        this.emit('clear');

        return this;
    }

    /**
     * @description Деактивирует текущий инстанс
     */
    destroy() {
        if (this.isDestroyed) return;

        destroyed[this.name] = true;
        delete instances[this.name];

        this.emit('destroy');
    }

    /**
     * @description Флаг деактивированного состояния инстанса
     * @readonly
     */
    get isDestroyed() {
        return !!destroyed[this.name];
    }

    /**
     * @description Инициализирует инстанс класса
     * @param {String} name - Имя модуля, под которым данные будут сохраняться в localStorage.
     * @param {Object} [defaultValue={}] - Объект начального состояния.
     * При первой инициализации класса этот объект сохранится в localStorage под ключом из параметра name.
     * Если при следующих инициализациях в этот объект будут добавлены новые свойства,
     * они так же будут добавлены в модуль в localStorage,
     * но уже существующие в нем ранее сохраненные данные не будут затронуты.
     * @param {Boolean} [removeOtherValues=false] - Если передано true, при инициализации удалит из модуля
     * в localStorage данные под теми ключами, которых сейчас нет в объекте параметра defaultValue.
     */
    init(name, defaultValue, removeOtherValues) {
        delete destroyed[name];

        this.name = name;
        prepareStorage(name, defaultValue, removeOtherValues);
        instances[name] = this;

        this.emit('init');

        return this;
    }
}

export default SegregateLocalStorage;
