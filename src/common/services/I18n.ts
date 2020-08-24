import defaultLocale from "../../_locales/en/messages.json";

export const I18n = {
  t: (id: string, params?: Array<string | number>): string => {
    if (!chrome || !chrome.i18n) {
      if (!defaultLocale[id]) {
        return `No translation for id:"${id}"`;
      }
      let { message } = defaultLocale[id];
      const { placeholders } = defaultLocale[id];
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
