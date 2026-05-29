import { storage } from '@repo/util/function';

const MENUBOARD_TOKEN_KEY = 'menuboard-token';

export const getMenuboardToken = (): string | null =>
  storage.session.load<string>(MENUBOARD_TOKEN_KEY) ?? null;

export const setMenuboardToken = (token: string): boolean =>
  storage.session.save(MENUBOARD_TOKEN_KEY, token);

export const removeMenuboardToken = (): void =>
  storage.session.remove(MENUBOARD_TOKEN_KEY);
