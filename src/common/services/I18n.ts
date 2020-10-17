import defaultLocale from "../../_locales/en/messages.json";
import { TranslationParams } from "../../_locales/types";

export const I18n = {
  t: (...args: TranslationParams): string => {
    const [id, params] = args;
    const translations: Record<
      string,
      {
        message: string;
        placeholders?: Record<string, { content: string }>;
      }
    > = defaultLocale;
    if (!chrome || !chrome.i18n) {
      if (!defaultLocale[id]) {
        return `No translation for id:"${id}"`;
      }
      let { message } = translations[id];
      const { placeholders } = translations[id];
      if (!params || !placeholders) {
        return message;
      }
      Object.entries(placeholders).forEach(
        ([key, value]: [string, { content: string }]) => {
          const stringToReplace = `$${key}$`;
          const paramsIndex = Number(value.content.replace(/\$/g, "")) - 1;
          message = message.replace(stringToReplace, params[paramsIndex]);
        }
      );
      return message;
    }
    return chrome.i18n.getMessage(id, params);
  },
};
