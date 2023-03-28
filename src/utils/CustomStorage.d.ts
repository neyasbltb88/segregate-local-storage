declare class CustomStorage {
    protected storage: Map<string, string>;
    get length(): number;
    clear(): void;
    getItem(key: string): string;
    key(index: number): string | null;
    removeItem(key: string): boolean;
    setItem(key: string, value: string): Map<string, string>;
    toString(): string;
    toJSON(): Record<string, string>;
}
export default CustomStorage;
//# sourceMappingURL=CustomStorage.d.ts.map