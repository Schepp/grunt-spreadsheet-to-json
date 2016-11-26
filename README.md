# grunt-spreadsheet-to-json

> Takes a Google Spreadsheet with translations and generates multiple JSON files from the columns.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-spreadsheet-to-json --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-spreadsheet-to-json');
```

## Getting Google Drive API access

To access the Google Drive API you need to create a so called service account and then share your spreadsheet(s) with that account's email address. 

Here is a step by step howto ([credits to Theo Ephraim](https://github.com/theoephraim/node-google-spreadsheet)):

1. Go to the [Google Developers Console](https://console.developers.google.com/project)
2. Select your project or create a new one (and then select it)
3. Enable the Drive API for your project
  - In the sidebar on the left, expand __APIs & auth__ > __APIs__
  - Search for "drive"
  - Click on "Drive API"
  - click the blue "Enable API" button
4. Create a service account for your project
  - In the sidebar on the left, expand __APIs & auth__ > __Credentials__
  - Click blue "Add credentials" button
  - Select the "Service account" option
  - Select the "JSON" key type option
  - Click blue "Create" button
  - your JSON key file is generated and downloaded to your machine (__it is the only copy!__)
  - note your service account's email address (also available in the JSON key file)
5. Share the doc (or docs) with your service account using the email noted above

## The "spreadsheet_to_json" task

### Overview
In your project's Gruntfile, add a section named `spreadsheet_to_json` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  spreadsheet_to_json: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

The task will interpret a spreadsheet's first row as language column headings and the first column as being the translation keys:

|                       | en          | de          | fr             |   |
|-----------------------|-------------|-------------|----------------|---|
| STARTSCREEN.HEADLINE  | Hello World | Hallo Welt  | Salut le monde |   |
| STARTSCREEN.PARAGRAPH | Lorem ipsum | Lorem ipsum | Lorem ipsum    |   |
| STARTSCREEN.CTA       | Click me!   | Klick mich! | Clickez moi!   |   |

It will create one separate JSON file per language with key-value-pairs.

### Options

#### options.keyfile
Type: `String`
Required, no default value

Path to the JSON key file that was provided by the Google Developers Console.

#### options.spreadsheetId
Type: `String`
Required, no default value

You find the spreadsheet id sitting in the URL:
`https://docs.google.com/document/d/` __1I5SeO5P621T4J6AoE-xz_NmZTblAJFqGw7fWI2Fw82A__ `/edit`

#### options.ignoreColumns
Type: `Array`
Default value: `[]`

An array of column names that should be ignored.

### Usage Example

```js
grunt.initConfig({
  spreadsheet_to_json: {
    options: {
        keyfile: 'path/to/google-drive-api-key.json'
    },
    translations: {
      options: {
        spreadsheetId: '1I5SeO5P621T4J6AoE-xz_NmZTblAJFqGw7fWI2Fw82A',
        ignoreColumns: ['annotations'] // optional
      },
      dest: 'translations/'
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
