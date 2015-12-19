function gaslTestRunner() {
  'use strict'
  /**
  *
  * GasL - Logger-framework for Google Apps Script
  *
  * Github: https://github.com/zixia/gasl
  *
  * Example:
  ```
  if ((typeof GasLog)==='undefined') { // GasL Initialization. (only if not initialized yet.)
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/zixia/gasl/master/src/gas-log-lib.js').getContentText())
  } // Class GasLog is ready for use now!
  
  var log = new GasLog()
  
  log('Hello, %s!', 'World')
  ```
  */
  
  
  gaslForPrinter()
  gaslForTestPriority()
  gaslForSpreadSheet()
  gaslForLogEntries()
  
  
  return
  
  
  ////////////////////////////////////////////////////////////////////////////////////////
  
  
  
  /**
  *
  * 0. debug
  *
  */
  function gaslForPrinter() {
    
    var loggerLog = new GasLog({
      ident: 'Logger'
    })
    
    
    var printer = new GasLog.Printer.Spreadsheet({
      url: 'https://docs.google.com/spreadsheets/d/1_KRAtoDz2Pdcj9IPZI007I_gMzRyfmXf7gicgxVwYJc/edit#gid=0'
      , sheetName: 'Logs'
    })
    
    var sheetLog1 = new GasLog({
      printer: printer
      , ident: 'SheetLog1'
    })
    
    var sheetLog2 = new GasLog({
      printer: printer
      , ident: 'SheetLog2'
    })
    
    loggerLog('a ' + loggerLog.getPrinter().isPrinter())
    sheetLog1('a ' + sheetLog1.getPrinter().isPrinter())
    sheetLog2('a ' + sheetLog2.getPrinter().isPrinter())
    
    loggerLog('a ' + loggerLog.getPrinter().isPrinter())
    sheetLog1('a ' + sheetLog1.getPrinter().isPrinter())
    sheetLog2('a ' + sheetLog2.getPrinter().isPrinter())
    
    loggerLog('a ' + loggerLog.getPrinter().isPrinter())
    sheetLog1('a ' + sheetLog1.getPrinter().isPrinter())
    sheetLog2('a ' + sheetLog2.getPrinter().isPrinter())
    
    
    return
  }    
    
  /////////////////////////////////////////////////////////
    
    
  
  /*************************************************
  *
  * 1. Logger (Google Apps Script default logger)
  *
  **************************************************/
  function gaslForTestPriority() {
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // GasLog include header start
    //
    if ((typeof GasLog)==='undefined') { // GasL Initialization. (only if not initialized yet.)
      eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/zixia/gasl/master/src/gas-log-lib.js').getContentText())
    } // Class GasLog is ready for use now!
    //
    // GasLog include header end
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    var log = new GasLog()
    
    //  log.disable()
    
    for (var n=0; n<=log.DEBUG; n++) {
      testLog_(n)
    }
    
    //  log.enable()
    
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
  
  
  /*************************************************
  *
  * 2. Spreadsheet
  *
  **************************************************/
  function gaslForSpreadSheet() {
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // GasLog include header start
    //
    if ((typeof GasLog)==='undefined') { // GasL Initialization. (only if not initialized yet.)
      eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/zixia/gasl/master/src/gas-log-lib.js').getContentText())
    } // Class GasLog is ready for use now!
    //
    // GasLog include header end
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    
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
  
  /*************************************************
  *
  * 3. LogEntries
  *
  **************************************************/
  function gaslForLogEntries() {
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // GasLog include header start
    //
    if ((typeof GasLog)==='undefined') { // GasL Initialization. (only if not initialized yet.)
      eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/zixia/gasl/master/src/gas-log-lib.js').getContentText())
    } // Class GasLog is ready for use now!
    //
    // GasLog include header end
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // This logentries is my test log. Say hello to me is welcome! :]
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
}