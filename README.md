# GasL - Google Apps Script Logging-framework

GasL is a unix syslog like logging framework for Google Apps Script(GAS). It provides easy way for the GAS programs to log messages to Spreadsheet, LogEntries, RESTFUL API and Logger of GAS.

Github: https://github.com/zixia/gasl

In order to write to different log destinations, GasL comes with a components named `Printer`, which uses DI(Dependency Injection) to provide the write capacity. Under the hood, each Printer components is just a function with param for message, and write them out.

The following samples is runable. You maybe want to copy/paste it inside google script editor, then have a look by executing it.

## Example 1 - Basic Usage

This sample use Logger for output. "Ctrl + Enter" to get your logs.

```javascript
if ((typeof GasLog)==='undefined') { // GasL Initialization. (only if not initialized yet.)
  eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/zixia/gasl/master/src/gas-log-lib.js').getContentText())
} // Class GasLog is ready for use now!

var log = new GasLog()
    
log('Hello, %s!', 'World')
```

## Example 2 - Log to Google Spreadsheet:

This sample use a spreadsheet to output. You can open the URL: https://docs.google.com/spreadsheets/d/1_KRAtoDz2Pdcj9IPZI007I_gMzRyfmXf7gicgxVwYJc/edit#gid=0 , to see your log output.

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

GasL is designed for running javascript on Google Apps Script environment only.

## Module Methods

There's a very simple example at https://github.com/zixia/gasl/blob/master/src/gasl-demo.js , which is the demo sample code of GasL.

### `GasLog`: GasL Module

We use eval to get GasLog module in our code:

```javascript
if ((typeof GasLog)==='undefined') { // GasL Initialization. (only if not initialized yet.)
  eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/zixia/gasl/master/src/gas-log-lib.js').getContentText())
} // Class GasLog is ready for use now!
```
GasLog is the main module name of GasL.

Constructor options:

1. `printer`: Printer Component for DI. See the following `Printer` part.
1. `priority`: Log priority. See the following `log(priority, format, ...)` part.
1. `ident`: The name of the program who are loging.

```javascript
var loggerPrinter = new GasLog.Printer.Logger()

var log = new GasLog({
  printer: loggerPrinter
  , priority: 'INFO'
  , ident: 'foo'
})
```

### `Printer`: Component for output DI

GasLog.Printer is used by injector to enable output to different destination of GasT.

It has 2 Printer now: (more will easy to be support in the furture) 

1. `GasLog.Printer.Logger`
1. `GasLog.Printer.Spreadsheet`
1. `GasLog.Printer.LogEntries`

#### `GasLog.Printer.Logger`: The default Printer of GasLog

It use the Logger.log of Google Apps Script to output.

No need to set any options.

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

It use a Spreadsheet URL or ID to specify a sheet, then log to that sheet.

You need to specify the param of options: 
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

It use cloud logging service LogEntries to output.

[Logentries](https://logentries.com) is a software as a service provider for log management and intelligence. Logentries collects and analyzes data found within log files, in real-time with a cloud-delivered approach.

Create a new log set in LogEntries.com , with `Manual - Token TCP` option. then you will get a TOKEN for your log.

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

Just use it as look:

```javascript
log('Hello, World!')
```

Then you message will be logged.

### `log(priority, format, ...)`: the unix syslog like function

log the message by `format` of `priority`.

1. `format`: only support '%s' because javascript only has this.
1. `priority`: should be one of the follow.
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

Set priority for this log.

```javascript
log.setPriority(log.ERR)
```

### `log.getPriority()`

Get priority for this log.

```javascript
var priority = log.getPriority()
```

### `log.disable()`

Disable for logging. all message will be discarded when the log is in disabled state.

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

A online version of google spreadsheet bounded with GasL google apps scripts can be found here: 
* Spreadsheet - https://docs.google.com/spreadsheets/d/19M2DY3hunU6tDQFX5buJmZ_f3E8VFmlqAtodyC-J8Ag/edit#gid=1761137024
* Script editor - https://script.google.com/a/zixia.net/macros/d/Mta4oea1VMIugfSGRo4QrAnKRT9d30hqB/edit?uiv=2&mid=ACjPJvGt4gnXjJwXnToB0jIMEbSvqKUF6vH-uq-m59SqnjXqTQ03NDn_khlNE6ha_mPnrOAYEnyFk80nHYmt_hppO3AgDkO_vVLrYJXzcPPagwRromd0znfLreNFAu4p0rYTC-Jlo-sAKOM

## How to use GasL in Google Apps Script

Use GasL is very easy: just copy/paste the following javascript code to your Code.gs file, then you are ready to use GasL.

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

## How to implement a NEW Printer

Printer for GasL is a function to write log message to somewhere. 

Add a new Printer is easy, it require two steps:

1. Write a new Printer function. (The default GasL Printer: `LoggerPrinter()` is a good template to start with.)
1. Register the new Printer to GasL.

### Write a new Printer functoin

You can find the default LoggerPrinter() function in gas-log.js. copy & paste it, modify it, then you get your own Printer.

```javascript
function LoggerPrinter() {
  var loggerPrinter_ = function (priority, message) {
    return Logger.log(message)
  }
  
  loggerPrinter_.isPrinter = function () { return 'Logger' }
  return loggerPrinter_
}
```

Notice that the `isPrinter()` is required to return a printer name. If this function is not exist or return false, then GasL will not consider this Printer is usable.

### Register the new Printer to GasL

After wrote your own Printer, the Printer must be register to GasL before use.

Find the following code in gas-log.js, then add your new Printer to the end.

```javascript
gasLog_.Printer = {
  Logger: LoggerPrinter
  , Spreadsheet: SpreadsheetPrinter
  , LogEntries: LogEntriesPrinter
}
```

You are set!


## Support

The GasL source code repository is hosted on GitHub. There you can file bugs on the issue tracker or submit tested pull requests for review. ( https://github.com/zixia/gasl/issues )

For real-world examples from open-source projects using GasL, see Projects Using TasL on the wiki. ( https://github.com/zixia/gasl/wiki )

## Version history

### 0.4.0 (December 14, 2015)
* bug fix for spreadsheet printer
* support multi log instance for different ident

Use v0.4.0 in GAS
```javascript
/**
*
* GasL v0.4.0 Initialization. (only if not initialized yet.)
* https://github.com/zixia/gasl
*
if ((typeof GasLog)==='undefined') { // GasL Initialization. (only if not initialized yet.)
  eval(UrlFetchApp.fetch('https://github.com/zixia/gasl/blob/v0.4.0/src/gas-log-lib.js').getContentText())
} // Class GasLog is ready for use now!
```

### 0.3.0 (December 13, 2015)
* LogEntries support
* new function: disable() & enable() 
* GasLog.Printer implement document

### 0.2.0 (December 11, 2015)
* Support set ident name in options

### 0.1.0 (December 10, 2015)
* Initial public release.

-------------------------------------------
© 2015 Zhuohuan LI. GasL is released under an MIT-style license; see LICENSE for details.
