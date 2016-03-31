'use strict';
//254
//252811
var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');
var Promise = require('rsvp').Promise;
var JsonFile = require('jsonfile');

var jsonFilePath = __dirname + '/database/mcc-mnc-table.json';
var MccMnc = require('./../index');

//1780
module.exports = function () {
    var mccTable = require(jsonFilePath);

    scrapeFromTxtNation()
        .then(scrapeFromMobileNetworkCodes)
        .then(saveJsonFile);

    function scrapeFromTxtNation() {
        return new Promise(function (resolve, reject) {
            var url = "https://clients.txtnation.com/entries/92195137-MCCMNC-mobile-country-code-and-mobile-network-code-list-";
            request(url, function (err, response, html) {''
                if (err) {
                    reject();
                    return console.error(err);
                }
                if (response.statusCode !== 200) {
                    reject();
                    return console.log("status code %s received", response.statusCode);
                }

                var $ = cheerio.load(html);
                $('div.user_formatted.clearfix.header_section').each(function (i, tableElem) {
                    var table = $(this).children().get(13);
                    var tbody = $(table).children().get(1);
                    $(tbody).children().each(function (i, trElem) {
                        // The first row contains the headers
                        if (i !== 0) {
                            var row = {};
                            var elem = $(this).children();
                            var mcc = _.trim($(elem[2]).text());
                            var mnc = _.trim($(elem[4]).text());
                            var country = _.trim($(elem[6]).text());
                            var network = _.trim($(elem[7]).text());

                            row.mcc = mcc;
                            row.mnc = mnc;
                            row.country = country;
                            row.network = network;
                            row.iso = "";
                            row.country_code = "";

                            // Update the table
                            var match = getMatch(row, mccTable);
                            if (_.isEmpty(match)) {
                                mccTable.push(row);
                            } else {
                                updateMatch(match, row);
                            }
                        }
                    });
                });
                resolve();
            });
        });
    }

    function scrapeFromMobileNetworkCodes() {
        return new Promise(function (resolve, reject) {
            var url = "http://mobile-network-codes.com/mobile-network-codes-country-codes.asp";
            request(url, function (err, response, html) {
                if (err) {
                    return console.error(err);
                }
                if (response.statusCode !== 200) {
                    return console.log("status code %s received", response.statusCode);
                }

                var $ = cheerio.load(html);
                $('table.dataLists').each(function (i, tableElem) {
                    var country;
                    // Get the country name
                    if ($(this).prev()[0].name === 'h3') {
                        country = $(this).prev().text();
                    }

                    // Now get the content
                    $(this).children().each(function (i, trElem) {
                        if ($(this).children().first()[0].name === 'td') {
                            var row = {};
                            var elem = $(this).children();
                            var mcc = _.trim($(elem[0]).text());
                            var mnc = _.trim($(elem[1]).text());
                            var network = _.trim($(elem[2]).text());
                            var operator = _.trim($(elem[3]).text());

                            row.mcc = mcc;
                            row.mnc = mnc;
                            row.country = country;
                            row.network = network;
                            row.iso = "";
                            row.country_code = "";
                            if (!network && operator) {
                                row.network = operator;
                            }

                            // Update the table
                            var match = getMatch(row, mccTable);
                            if (_.isEmpty(match)) {
                                mccTable.push(row);
                            } else {
                                updateMatch(match, row);
                            }
                        }
                    });
                });
                resolve();
            });
        });
    }

    function saveJsonFile() {
        JsonFile.writeFile(jsonFilePath, mccTable, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("done")
            }
        })
    }

    function getMatch(row, table) {
        var mccMnc = new MccMnc(table);
        var match = mccMnc.mcc(row.mcc).mnc(row.mnc).get();
        return match;
    }

    function updateMatch(match, row) {
        if (_.isEmpty(match.iso) && !_.isEmpty(row.iso)) {
            match.ios = row.iso;
        }

        if (_.isEmpty(match.country) && !_.isEmpty(row.country)) {
            match.ios = row.country;
        }

        if (_.isEmpty(match.country_code) && !_.isEmpty(row.country_code)) {
            match.ios = row.country_code;
        }

        if (_.isEmpty(match.network) && !_.isEmpty(row.network)) {
            match.ios = row.network;
        }
    }
};
