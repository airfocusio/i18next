declare module '@choffmeister/i18next' {
  import * as I18next from 'i18next'
  import { UseTranslationResponse } from 'react-i18next'
  export interface CreateTranslationOpts {
    i18n?: I18next.i18n
    namespace?: string
  }
  export function createTranslation(dict: any, opts?: CreateTranslationOpts): {
    namespace: string,
    translations: any,
    useTranslation: () => UseTranslationResponse<string>,
  }
  export const init: I18next.ThirdPartyModule
}
