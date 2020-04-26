import defaultLocale from "../../_locales/en/messages.json";

export const I18n = {
  t: (id: string, params?: Array<string | number>) => {
    if (!chrome || !chrome.i18n) {
      return defaultLocale[id].message;
    }
    return chrome.i18n.getMessage(id, params);
  },
};

export type Ii18n = {
  t: (id: string, params?: Array<string | number>) => string;
};
