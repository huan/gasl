# Chen Updated
# GasL - Google Apps Script Logging-framework

GasL is a unix syslog similar to the logging framework of Google Apps Script (GAS). It offers an easy way for GAS programs to log messages into Spreadsheets, LogEntries, RESTFUL API and GAS logger.

Github: https://github.com/zixia/gasl

In order to write into different log destinations, GasL comes with a components called `Printer`, which uses DI (Dependency Injection) to provide log entry functionalities. Behind the scenes, each Printer component is simply a function that accepts a parameter for message, and ouputs the content into log destinations.

The sample scripts below are executable. You can copy/paste it to google script editor for testing purposes.

## Example 1 - Basic Usage

This sample uses Logger for output. "Ctrl + Enter" to get your logs.

```javascript
if ((typeof GasLog)==='undefined') { // GasL Initialization. (only if not initialized yet.)
  eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/zixia/gasl/master/src/gas-log-lib.js').getContentText())
} // Class GasLog is ready for use now!

var log = new GasLog()
    
log('Hello, %s!', 'World')
```

## Example 2 - Log to Google Spreadsheet:

This sample uses a spreadsheet for output. You can view the log output from this URL: https://docs.google.com/spreadsheets/d/1_KRAtoDz2Pdcj9IPZI007I_gMzRyfmXf7gicgxVwYJc/edit#gid=0

```javascript
if ((typeof GasLog)==='undefined') { // GasL Initialization. (only if not initialized yet.)
  eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/zixia/gasl/master/src/gas-log-lib.js').getContentText())
} // Class GasLog is ready for use now!

var sheetPrinter = new GasLog.Printer.Spreadsheet({
  url: 'https://docs.google.com/spreadsheets/d/1_KRAtoDz2Pdcj9IPZI007I_gMzRyfmXf7gicgxVwYJc/edit#gid=0'
  , sheetName: 'Logs'
  , clear: true
  , scroll: 'UP'
})

var log = new GasLog({
  printer: sheetPrinter
  , priority: 'INFO'
})

log(log.INFO, 'Hello, %s!', 'Spreadsheet')
```

GasL is designed for running javascript on Google Apps Script environment ONLY.

## Module Methods

A simple example of GasL demo code can be found at https://github.com/zixia/gasl/blob/master/src/gasl-demo.js.

### `GasLog`: GasL Module

Eval is used to get GasLog module in the code:

```javascript
if ((typeof GasLog)==='undefined') { // GasL Initialization. (only if not initialized yet.)
  eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/zixia/gasl/master/src/gas-log-lib.js').getContentText())
} // Class GasLog is ready for use now!
```
GasLog is the main module of GasL.

Constructor parameters:

1. `printer`: Printer Component of DI. See the following `Printer` part.
1. `priority`: Log priority. See the following `log(priority, format, ...)` part.
1. `ident`: The name of the program that are logging.

```javascript
var loggerPrinter = new GasLog.Printer.Logger()

var log = new GasLog({
  printer: loggerPrinter
  , priority: 'INFO'
  , ident: 'foo'
})
```

### `Printer`: Component of output DI

GasLog.Printer is used by injector to enable output to different destination of GasT.

It currently supports 2 Printers: (more printers can be easily supported in the furture) 

1. `GasLog.Printer.Logger`
1. `GasLog.Printer.Spreadsheet`
1. `GasLog.Printer.LogEntries`

#### `GasLog.Printer.Logger`: Default Printer of GasLog

It uses Logger.log of Google Apps Script to output.

No need to set any parameters.

```javascript
if ((typeof GasLog)==='undefined') { // GasL Initialization. (only if not initialized yet.)
  eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/zixia/gasl/master/src/gas-log-lib.js').getContentText())
} // Class GasLog is ready for use now!

var loggerPrinter = new GasLog.Printer.Logger()

var log = new GasLog({
  printer: loggerPrinter // could be omitted.
})
```

#### `GasLog.Printer.Spreadsheet`: Print to a spreadsheet

It uses a Spreadsheet URL or ID to specify a particular sheet, then log into that sheet.

The following parameters need to be configured: 
1. `spreadsheet`(Spreadsheet): Google Spreadsheet object. You must have the write permisstion for that spreadsheet. (one of spreadsheet/url/id must be set)
1. `id`(string): Google Spreadsheet id. You must have the write permisstion for that spreadsheet. (one of spreadsheet/url/id must be set)
1. `url`(string): Google Spreadsheet url. You must have the write permisstion for that spreadsheet. (one of spreadsheet/url/id must be set)
1. `sheetName`(string): Tab name of the output sheet. Will be created if not exist. default `GasLog`. (OPTIONAL)
1. `clear`(bool): true for clear the sheet before output. default false. (OPTIONAL)
1. `scroll`(string): 'UP' for insert new log to the top. default 'DOWN'. (OPTIONAL)

```javascript
if ((typeof GasLog)==='undefined') { // GasL Initialization. (only if not initialized yet.)
  eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/zixia/gasl/master/src/gas-log-lib.js').getContentText())
} // Class GasLog is ready for use now!

var sheetPrinter = new GasLog.Printer.Spreadsheet({
  url: 'https://docs.google.com/spreadsheets/d/1_KRAtoDz2Pdcj9IPZI007I_gMzRyfmXf7gicgxVwYJc/edit#gid=0'
  , sheetName: 'Logs'
  , clear: true
  , scroll: 'UP'
})
  
var log = new GasLog({
  printer: sheetPrinter
  , logLevel: 'INFO'
})
```

#### `GasLog.Printer.LogEntries`: The Printer for LogEntries.com

It uses cloud logging service LogEntries to output.

[Logentries](https://logentries.com) is a software as a service provider for log management and intelligence. LogEntries collects and analyzes data found inside log files, in real-time with a cloud-delivered approach.

Create a new log set in LogEntries.com, with `Manual - Token TCP` option, then you will get a TOKEN for your log.

Put TOKEN in the only options: token.

```javascript
if ((typeof GasLog)==='undefined') { // GasL Initialization. (only if not initialized yet.)
  eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/zixia/gasl/master/src/gas-log-lib.js').getContentText())
} // Class GasLog is ready for use now!

var logentriesPrinter = new GasLog.Printer.LogEntries({
  token: '4ea178f8-928d-3130-99ca-1f20ad803ec2' // this token is my logentries test log. welcome to write hello to me! :]
})

var log = new GasLog({
  printer: logentriesPrinter
})
```

Then all logs will be outputed to LogEntries cloud.

### `log(message)`: the simplest version

Simply use it as below:

```javascript
log('Hello, World!')
```

Then your message will be logged.

### `log(priority, format, ...)`: the unix syslog-like function

log the message by `format` of `priority`.

1. `format`: only supports '%s' because javascript only provides this.
1. `priority`: should be one of the following.
  1. `log.EMERG`
  1. `log.ALERT`
  1. `log.CRIT`
  1. `log.ERR`
  1. `log.WARNING`
  1. `log.NOTICE`
  1. `log.INFO`
  1. `log.DEBUG`


```javascript
var msg = 'test'
log(log.WARNING, 'This is a warning message: %s', msg)
```

### `log.setPriority(priority)`

Set priority of this log.

```javascript
log.setPriority(log.ERR)
```

### `log.getPriority()`

Get priority of this log.

```javascript
var priority = log.getPriority()
```

### `log.disable()`

Disable for logging. all messages will be discarded when the log is set in Disabled state.

```javascript
log.disable()
```
It's useful when we are inside a `Custom Function` of spreadsheet. We have limited priviliges and can't write out.

### `log.enable()`

Enable for logging.

```javascript
log.enable()
```


## Screen Snapshot
![GasL(GasLog) for GAS(Google Apps Script)](https://raw.githubusercontent.com/zixia/gasl/master/gasl-script-editor-screenshot.png)

An online version of google spreadsheet bounded with GasL google apps scripts can be found here: 
* Spreadsheet - https://docs.google.com/spreadsheets/d/19M2DY3hunU6tDQFX5buJmZ_f3E8VFmlqAtodyC-J8Ag/edit#gid=1761137024
* Script editor - https://script.google.com/a/zixia.net/macros/d/Mta4oea1VMIugfSGRo4QrAnKRT9d30hqB/edit?uiv=2&mid=ACjPJvGt4gnXjJwXnToB0jIMEbSvqKUF6vH-uq-m59SqnjXqTQ03NDn_khlNE6ha_mPnrOAYEnyFk80nHYmt_hppO3AgDkO_vVLrYJXzcPPagwRromd0znfLreNFAu4p0rYTC-Jlo-sAKOM

## How to use GasL in Google Apps Script

Use GasL is very simple: just copy/paste the following javascript section to your Code.gs file, then you are ready to use GasL.

```javascript
if ((typeof GasLog)==='undefined') { // GasL Initialization. (only if not initialized yet.)
  eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/zixia/gasl/master/src/gas-log-lib.js').getContentText())
} // Class GasLog is ready for use now!
```

Then you are ready to use:

```javascript
var log = new GasLog(...)
log(...)
```

## How to implement a new Printer

Printer for GasL is a function to write log message into certain destinations. 

Adding a new Printer requires 2 steps:

1. Write a new Printer function. (The default GasL Printer: `LoggerPrinter()` is a good template to start with.)
1. Register the new Printer to GasL.

### Write a new Printer function

You can find the default LoggerPrinter() function in gas-log-lib.js and modify it to make your own Printer.

```javascript
function LoggerPrinter() {
  var loggerPrinter_ = function (priority, message) {
    return Logger.log(message)
  }
  
  loggerPrinter_.isPrinter = function () { return 'Logger' }
  return loggerPrinter_
}
```

Notice that `isPrinter()` is required to return a Printer name. If this function does not exist or returns false, then GasL will not consider this Printer usable.

### Register the new Printer to GasL

After creating your own Printer, this Printer must be registered to GasL before use.

Find the following code in gas-log.js, then add your new Printer to the end.

```javascript
gasLog_.Printer = {
  Logger: LoggerPrinter
  , Spreadsheet: SpreadsheetPrinter
  , LogEntries: LogEntriesPrinter
}
```

You are all set!


## Support

The GasL source code repository is hosted on GitHub. There you can submit bugs on the issue tracker or submit tested pull requests for review. (https://github.com/zixia/gasl/issues)

For real-world examples from open-source projects using GasL, see Projects Using TasL on the wiki. (https://github.com/zixia/gasl/wiki)

## Version history

### [v0.4.0](https://github.com/zixia/gasl/releases/tag/v0.4.0) (December 14, 2015)
* bug fix for spreadsheet printer
* support multi log instance for different ident
* LogEntries support
* new function: disable() & enable() 
* GasLog.Printer implement document
* Support set ident name in options

Use v0.4.0 in GAS
```javascript
/**
*
* GasL v0.4.0 Initialization. (only if not initialized yet.)
* https://github.com/zixia/gasl
*
*/
if ((typeof GasLog)==='undefined') { // GasL Initialization. (only if not initialized yet.)
  eval(UrlFetchApp.fetch('https://github.com/zixia/gasl/blob/v0.4.0/src/gas-log-lib.js').getContentText())
} // Class GasLog is ready for use now!
```

### v0.1.0 (December 10, 2015)
* Initial public release.

-------------------------------------------
© 2015 Zhuohuan LI. GasL is released under an MIT-style license; see LICENSE for details.
