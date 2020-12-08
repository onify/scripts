import { pugTemplateConverter, jsonTemplateConverter } from './converter';

describe("converter", () => {
  describe("pugTemplateConverter()", () => {
    test("having pug string content converted from translations to strings", () => {
      const template = `
        block append config
          +options({
              title: t('main.page.title'),
              subTitle: t('main.page.subtitle'),
              description: t('main.page.description-string'),
          })
      `;
      const converted = `
        block append config
          +options({
              title: t('_main_page_title'),
              subTitle: t('_main_page_subtitle'),
              description: t('_main_page_description_string'),
          })
      `;
      expect(pugTemplateConverter(template)).toEqual(converted);
    });
  });

  describe("jsonTemplateConverter()", () => {
    test("having json template content converted from translations to strings", () => {
      const template = `
        {
          title: <% main.page.title %>,
          subtitle: <% main.page.subtitle %>,
          description: <% main.page.description-string %>,
        }
      `;
      const converted = `
        {
          title: {{t _main_page_title}},
          subtitle: {{t _main_page_subtitle}},
          description: {{t _main_page_description_string}},
        }
      `;
      expect(jsonTemplateConverter(template)).toEqual(converted);
    });
  });
});
