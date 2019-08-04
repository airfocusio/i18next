import { createTranslation as ct, asdasd } from "@choffmeister/i18next";
import other from "test";
const {
  useTranslation
} = ct({
  foo: {
    en: "bar1",
    de: "bar1"
  }
}, {
  namespace: "code--O/sCV"
});
const {
  useTranslation: useTranslation2
} = ct({
  foo: {
    en: "bar2",
    de: "bar2"
  }
}, {
  i18n: undefined,
  namespace: "code--adzVP"
});
