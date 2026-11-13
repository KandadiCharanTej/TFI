import { cookies } from "next/headers";
import { LANG_COOKIE, parseLang, type Lang } from "./lang";

/** Server-side: read the "lang" cookie so the first paint is in the right language. */
export async function getServerLang(): Promise<Lang> {
  const store = await cookies();
  return parseLang(store.get(LANG_COOKIE)?.value);
}
