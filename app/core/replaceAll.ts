export function replaceAll(str: string, search: string, replace: string): string {
    return str.replace(new RegExp(search, "g"), replace);
}

