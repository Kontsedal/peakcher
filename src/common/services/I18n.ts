export const I18n = {
  t: (id: string, params?: Array<string | number>) => {
    return chrome.i18n.getMessage(id, params);
  },
};

export type Ii18n = {
  t: (id: string, params?: Array<string | number>) => string;
};
