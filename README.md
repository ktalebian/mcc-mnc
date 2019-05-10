# mcc-mnc
A wrapper for mcc-mnc lookup.

## JSON source file
The source file is taken from [musalbas's mcc-mnc-table repo](https://github.com/musalbas/mcc-mnc-table).

## Installation
Install the package using `npm install mcc-mnc`. 

## Usage
After installation, include it and instantiate it to use it:

    var MccMnc = require('mcc-mnc');
    var mccMnc = new MccMnc();

Available methods are:
  - `mcc(int)` Filter by `mcc`
  - `mnc(int)` Filter by `mnc`
  - `country(string)` Filter by `country`
  - `network(string)` Filter by `network`
  - `countryCode(string)` Filter by `country_code`
  - `get()` Returns all the matched filters
  - `clear()` Clears the search filter.

Example 1:

```javascript
const MccMnc = require('mcc-mnc');
const mccMnc = new MccMnc();

const match = mccMnc.mcc(310).mnc(330).get();
console.log(match);

```
    
Returns:
```javascript
{ 
  network: 'T-Mobile',
  country: 'United States',
  mcc: '310',
  iso: 'us',
  country_code: '1',
  mnc: '330' 
}
```

Example 2: 

```javascript
const MccMnc = require('mcc-mnc');
const mccMnc = new MccMnc();

const match = mccMnc.mnc(330).get();
console.log(match);
```
    
Returns:

```javascript
[ 
  { network: 'Claro/ CTI/AMX',
    country: 'Argentina Republic',
    mcc: '722',
    iso: 'ar',
    country_code: '54',
    mnc: '330' },
  { network: 'Michigan Wireless LLC',
    country: 'United States',
    mcc: '311',
    iso: 'us',
    country_code: '1',
    mnc: '330' },
  { network: 'T-Mobile',
    country: 'United States',
    mcc: '310',
    iso: 'us',
    country_code: '1',
    mnc: '330' } 
]
```
    
If no match is found, `-1` is returned.
  
