const { convertToLanguageFirst } = require("../src/utils");

it("a", () => {
  expect(
    convertToLanguageFirst({
      first: {
        en: "en1",
        de: "de1"
      }
    })
  ).toEqual({
    en: {
      first: "en1"
    },
    de: {
      first: "de1"
    }
  });
  expect(
    convertToLanguageFirst({
      first: {
        second: {
          en: "en2",
          de: "de2"
        },
        third: {
          en: "en3",
          de: "de3"
        }
      }
    })
  ).toEqual({
    en: {
      first: {
        second: "en2",
        third: "en3"
      }
    },
    de: {
      first: {
        second: "de2",
        third: "de3"
      }
    }
  });
});
