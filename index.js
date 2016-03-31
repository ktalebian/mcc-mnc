'use strict';
var _ = require('lodash');

/**
 * Expose the Class
 */
module.exports = MccMnc;

function MccMnc(List) {
    if (List) {
        this.List = List;
    } else {
        this.List = getListFromDB();
    }
}

MccMnc.prototype.mcc = function (arg) {
    return this._filter("mcc", arg);
};

MccMnc.prototype.mnc = function (arg) {
    return this._filter("mnc", arg);
};

MccMnc.prototype.network = function (arg) {
    return this._filter("network", arg);
};

MccMnc.prototype.country = function (arg) {
    return this._filter("country", arg);
};

MccMnc.prototype.iso = function (arg) {
    return this._filter("iso", arg);
};

MccMnc.prototype.countryCode = function (arg) {
    return this._filter("country_code", arg);
};

MccMnc.prototype.get = function () {
    if (this.List.length === 0) {
        return -1;
    } else if (this.List.length === 1) {
        return this.List[0];
    } else {
        return this.List;
    }
};

MccMnc.prototype._filter = function (key, value) {
    var obj = {};
    obj[key] = "" + value;

    this.List = _.filter(this.List, obj);
    return this;
};

MccMnc.prototype.clear = function () {
    this.List = List;
    return this;
};

function getListFromDB() {
    return require('./src/database/mcc-mnc-table.json');
}

//var mccMnc = new MccMnc();
//console.log(mccMnc.mcc(310).mnc(410).get())
//require('./src/scraper')()
