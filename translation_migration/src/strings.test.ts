import { generateStrings } from './strings';
import { Translation } from './translation';

describe("strings", () => {
  describe("generateStrings()", () => {
    test("have strings generated from translations", () => {
      const translations: Translation[] = [
        {
          local: 'en',
          strings: {
            _a_b_c_d: 'english abcd',
            _a_b_c_d_e_f: 'english abcdef',
          },
        },
        {
          local: 'lang1',
          strings: {
            _a_b_c_d: 'lang1 abcd',
            _a_b_c_d_e_f: 'lang1 abcdef',
          },
        },
        {
          local: 'lang2',
          strings: {
            _a_b_c_d: 'lang2 abcd',
            _a_b_c_d_e_f: 'lang2 abcdef',
          },
        },
      ];
      expect(generateStrings(translations, 'en')).toEqual([
        {
          string: 'english abcd',
          description: `Migrated from custom.json (a.b.c.d)`,
          tag: [
            'a',
            'b',
            'custom',
            'migrated',
          ],
          translation: {
            en: {
              custom: 'english abcd',
            },
            lang1: {
              custom: 'lang1 abcd',
            },
            lang2: {
              custom: 'lang2 abcd',
            },
          },
          key: '_a_b_c_d',
        },
        {
          string: 'english abcdef',
          description: `Migrated from custom.json (a.b.c.d.e.f)`,
          tag: [
            'a',
            'b',
            'custom',
            'migrated',
          ],
          translation: {
            en: {
              custom: 'english abcdef',
            },
            lang1: {
              custom: 'lang1 abcdef',
            },
            lang2: {
              custom: 'lang2 abcdef',
            },
          },
          key: '_a_b_c_d_e_f',
        },
      ]);
    });
  });
});
