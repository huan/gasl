'use strict'
/**
*
* GasL - Logger-framework for Google Apps Script
*
* Github: https://github.com/zixia/gasl
*
* Example:
```
if (!gaslLib && !GasLog) { // GasL Initialization. (if not initialized yet.)
  var gaslLib='https://raw.githubusercontent.com/zixia/gasl/master/gas-log.js'
  var GasLog = eval(UrlFetchApp.fetch(gaslLib).getContentText());
}

var log = new GasLog()

log('Hello, %s!', 'World')
```
*/


function gaslForTestPriority() {
    
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // GasLog include header start
  //
  if (!gaslLib && !GasLog) {
    var gaslLib='https://raw.githubusercontent.com/zixia/gasl/master/gas-log.js'
//    var GasLog = eval(UrlFetchApp.fetch(gaslLib).getContentText());
  }

  var log = new GasLog()
  //
  // GasLog include header end
  //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
    
  log.disable()
  
  for (var n=0; n<=log.DEBUG; n++) {
    testLog_(n)
  }
  
  log.enable()
  
  for (var logName in log.PRIORITIES) {
    testLog_(logName)
  }

  function testLog_(priority) {
    
    log.setPriority(priority)
    
    log('### Current log priority is %s : %s ###', priority, log.getPriority())
    log('Hello, I am a default priority message')  
    
    log(log.EMERG  , 'this is a %s priority msg', 'EMERG')
    log(log.ALERT  , 'this is a %s priority msg', 'ALERT')
    log(log.CRIT   , 'this is a %s priority msg', 'CRIT')
    log(log.ERR    , 'this is a %s priority msg', 'ERR')
    log(log.WARNING, 'this is a %s priority msg', 'WARNING')
    log(log.NOTICE , 'this is a %s priority msg', 'NOTICE')
    log(log.INFO   , 'this is a %s priority msg', 'INFO')
    log(log.DEBUG  , 'this is a %s priority msg', 'DEBUG')
    
  }
  
}


function gaslForLogEntries() {
  
  var gasLogLib='https://raw.githubusercontent.com/zixia/gasl/master/gas-log.js'
//  var GasLog = eval(UrlFetchApp.fetch(gasLogLib).getContentText())
  
  // This logentries is my test log. 
  // Say hello to me is welcome! :]
  var logentriesPrinter = new GasLog.Printer.LogEntries({
    token: '4ea178f8-928d-3130-99ca-1f20ad803ec2'
  })
  
  var log = new GasLog({
    printer: logentriesPrinter
    , priority: 'INFO'
    , ident: 'GasLog'
  })
  
  log('Hello, I am a default priority message')
  
  log(log.EMERG  , 'this is a %s priority msg', 'EMERG')
  log(log.ALERT  , 'this is a %s priority msg', 'ALERT')
  log(log.CRIT   , 'this is a %s priority msg', 'CRIT')
  log(log.ERR    , 'this is a %s priority msg', 'ERR')
  log(log.WARNING, 'this is a %s priority msg', 'WARNING')
  log(log.NOTICE , 'this is a %s priority msg', 'NOTICE')
  log(log.INFO   , 'this is a %s priority msg', 'INFO')
  log(log.DEBUG  , 'this is a %s priority msg', 'DEBUG')
}


/**
*
* Spreadsheet
*
*/
function gaslForSpreadSheet() {
    
  if (!(typeof gaslLib) && !(typeof GasLog)) { // GasL Init(if not inited)
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/zixia/gasl/master/gas-log.js').getContentText())
    Logger.log('newed: ' + typeof GasLog)
  }

  // This spreadsheet is my public writable doc. 
  // Say hello to me is welcome! :]  
  var spreadsheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1_KRAtoDz2Pdcj9IPZI007I_gMzRyfmXf7gicgxVwYJc/edit#gid=0')

  var printer = new GasLog.Printer.Spreadsheet({
    spreadsheet: spreadsheet
//    , url: 'https://docs.google.com/spreadsheets/d/1_KRAtoDz2Pdcj9IPZI007I_gMzRyfmXf7gicgxVwYJc/edit#gid=0'
//    , id: '1_KRAtoDz2Pdcj9IPZI007I_gMzRyfmXf7gicgxVwYJc'
    , sheetName: 'Logs'
    , clear: true
    , scroll: 'DOWN'
  })
  
  var log = new GasLog({
    printer: printer
    , priority: 'INFO'
    , ident: 'zixia2'
  })
  
  log('Hello, I am a default priority message')
  
  log(log.EMERG  , 'this is a %s priority msg', 'EMERG')
  log(log.ALERT  , 'this is a %s priority msg', 'ALERT')
  log(log.CRIT   , 'this is a %s priority msg', 'CRIT')
  log(log.ERR    , 'this is a %s priority msg', 'ERR')
  log(log.WARNING, 'this is a %s priority msg', 'WARNING')
  log(log.NOTICE , 'this is a %s priority msg', 'NOTICE')
  log(log.INFO   , 'this is a %s priority msg', 'INFO')
  log(log.DEBUG  , 'this is a %s priority msg', 'DEBUG')
}

