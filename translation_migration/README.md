# Translation Migration Script for Onify v2

This scripts migrates v1 custom translations to v2 strings and also updates forms, dashboards and itemtemplates. It also generates a json file to be imported in API to create new strings.

## Execution Phases

* Generate and store strings from translations in locals.
* Convert pug and json template translation references to string references.

## Command's Domain API

* `translation.ts` Includes translations operations for receiving.
  * `getTranslations(localsPath: string): Promise<Translation[]>` Gets translations from custom.json in locals.

* `strings.ts` Includes strings operations for generation and storage.
  * `generateStrings(translations: Translation[], defaultLocal: string): String[]` Generates strings from translations.
  * `storeStrings(outputFilePath: string, strings: String[]): Promise<void>` Stores strings to a file.

* `converter.ts` Includes template operations for converting.
  * `convertPugTemplates(templatesPath: string): Promise<void>` Converts pug templates translation references to string references.
  * `convertJsonTemplates(templatesPath: string): Promise<void>` Converts json template translation references to string references.

## Command execution

```sh
npm run exec -- --project=<path> --output=<path>
```

### Arguments

`project` Project's folder path.

`output` Strings output file path.

## Example

```sh
npm run exec -- --project=../../project --output=../../project/strings.json
```

* Converts translations from folder `../../project/locales` into strings stored in file `../../project/strings.json`.
* Transforms pug templates from `../../project/templates/dashboard` and `../../project/templates/form` folders.
* Transforms json templates from `../../project/public/app/config` folder.

> NOTE: A custom.json for EN (English) is required.

> NOTE: The custom.json files needs to be UTF8 encoded. UTF8 BOM is not supported.

