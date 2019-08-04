# i18next

```json
// .babelrc
{
  "plugins": [
    "module:@choffmeister/i18next"
  ]
}

```

```js
// init.ts
import * as i18next from 'i18next'
import * as reactI18next from 'react-i18next'
import * as choffmeisterI18next from '@choffmeister/i18next'

i18next
  .use(reactI18next.initReactI18next)
  .use(choffmeisterI18next.init)
  .init(
    {
      fallbackLng: 'en',
      resources: {},
      interpolation: {
        escapeValue: false,
      },
      react: {
        wait: false,
        nsMode: 'default',
      },
      debug: process.env.NODE_ENV !== 'production',
    },
    err => {
      if (err) {
        // tslint:disable-next-line no-console
        console.error(err)
      }
    }
  )
```

```js
// Greeting.ts
import * as React from 'react'
import { createTranslation } from '@choffmeister/i18next'

interface Props {
  name: string
}

export const Greeting: React.FunctionComponent<Props> = ({ name }) => {
  const { t } = useTranslation()
  return (
    <div>
      {t('greeting', { name })}
    </div>
  )
}

const { useTranslation } = createTranslation({
  greeting: {
    en: 'Hello, {{name}}!',
    de: 'Hallo, {{name}}!'
  }
})
```
