class CustomStorage {
    protected storage: Map<string, string> = new Map();
    // readonly length: number;

    get length(): number {
        return this.storage.size;
    }

    clear() {
        console.log('CustomStorage clear');

        localStorage.clear();

        return this.storage.clear();
    }

    getItem(key: string) {
        console.log('CustomStorage getItem: ', key);

        return this.storage.get(key);
    }

    key(index: number): string | null {
        console.log('CustomStorage key:', index);

        return this.getItem([...this.storage.keys()][index]);
    }

    removeItem(key: string) {
        console.log('CustomStorage removeItem:', key);

        localStorage.removeItem(key);

        return this.storage.delete(key);
    }

    setItem(key: string, value: string) {
        console.log('CustomStorage setItem:', { key, value });

        localStorage.setItem(key, value);

        return this.storage.set(key, value);
    }

    toString() {
        return 'CustomStorage';
    }

    toJSON() {
        const res: Record<string, string> = {};
        this.storage.forEach((value, key) => (res[key] = value));

        return res;
    }
}

export default CustomStorage;
