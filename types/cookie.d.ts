// ./types/cookie.d.ts

declare module 'cookie' {
    export function parse(cookie: string, options?: any): { [key: string]: string };
    export function serialize(name: string, value: string, options?: any): string;
  }
  