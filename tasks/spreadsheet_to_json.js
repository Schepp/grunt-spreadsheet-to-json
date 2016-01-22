/*
 * grunt-spreadsheet-to-json
 * https://github.com/Schepp/grunt-spreadsheet-to-json
 *
 * Copyright (c) 2016 Christian Schaefer
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('spreadsheet_to_json', 'Takes a Google Spreadsheet with translations and generates multiple JSON files from the columns.', function () {
        var googleSpreadsheet = require('google-spreadsheet');

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            ignoreColumns: []
        });

        // Iterate over all specified file groups.
        this.files.forEach(function (f) {
            // spreadsheet key is the long id in the sheets URL
            // spreadsheet needs to be shared with user account-1@sixt-hr.iam.gserviceaccount.com
            var spreadsheet = new googleSpreadsheet(options.spreadsheetId);

            // With auth -- read + write
            // see below for authentication instructions
            var creds = require(options.keyfile);

            var translations = {};

            options.ignoreColumns.map(function(column) {
                return column.toLowerCase();
            });

            spreadsheet.useServiceAccountAuth(creds, function (err) {
                grunt.log.writeln(err);

                // getInfo returns info about the sheet and an array or "worksheet" objects
                spreadsheet.getInfo(function (err, sheet_info) {
                    grunt.log.writeln(sheet_info.title + ' is loaded');

                    var worksheet = sheet_info.worksheets[0],
                        parseRow = function parseRow(row) {
                            var language;

                            for (language in translations) {
                                if (
                                    language in row &&
                                    row.hasOwnProperty(language)
                                ) {
                                    translations[language][row.id] = row[language];
                                }
                            }
                        };

                    worksheet.getCells({
                        'min-row': 1,
                        'max-row': 1
                    }, function (err, cells) {
                        cells.forEach(function (cell) {
                            var column = cell.value.toLowerCase();

                            if (options.ignoreColumns.indexOf(column) === -1) {
                                translations[cell.value] = {};
                            }
                        });

                        grunt.log.writeln('Found ' + Object.keys(translations).length + ' languages');

                        worksheet.getRows(function (err, rows) {
                            var translation,
                                file,
                                data;

                            rows.forEach(parseRow);

                            for (translation in translations) {
                                if (translations.hasOwnProperty(translation)) {
                                    file = f.dest + '/' + translation + '.json';
                                    data = JSON.stringify(translations[translation], null, 4);

                                    grunt.file.write(file, data);
                                    grunt.log.writeln('File "' + f.dest + '" created.');
                                }
                            }
                        });
                    });
                });
            });

            // Concat specified files.
            var src = f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function (filepath) {
                // Read file source.
                return grunt.file.read(filepath);
            }).join(grunt.util.normalizelf(options.separator));

            // Handle options.
            src += options.punctuation;

            // Write the destination file.
            grunt.file.write(f.dest, src);

            // Print a success message.
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });

};
