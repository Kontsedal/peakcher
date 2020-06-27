import defaultLocale from "../../_locales/en/messages.json";

export const I18n = {
  t: (id: string, params?: Array<string | number>) => {
    if (!chrome || !chrome.i18n) {
      if (!defaultLocale[id]) {
        return `No translation for id:"${id}"`;
      }
      let message = defaultLocale[id].message;
      const placeholders = defaultLocale[id].placeholders;
      if (!params || !placeholders) {
        return message;
      }
      Object.entries(placeholders).map(
        ([key, value]: [string, { content: string }]) => {
          let stringToReplace = `$${key}$`;
          let paramsIndex = Number(value.content.replace(/\$/g, "")) - 1;
          message = message.replace(stringToReplace, params[paramsIndex]);
        }
      );
      return message;
    }
    return chrome.i18n.getMessage(id, params);
  },
};

export type Ii18n = {
  t: (id: string, params?: Array<string | number>) => string;
};
