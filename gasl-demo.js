'use strict'
/**
*
* GasL - Logger-framework for Google Apps Script
*
* Github: https://github.com/zixia/gasl
*
* Example:
    ```
    var gasLogLib='https://raw.githubusercontent.com/zixia/gasl/master/gas-log.js'
    var GasLog = eval(UrlFetchApp.fetch(gasLogLib).getContentText())
  
    var log = new GasLog({
      logLevel: 'DEBUG'
    })
    
    log(log.INFO, 'Hello, %s!', 'World')

    ```
*/


function logLoopAll() {
  
  //////////////////////////////////////////////////////////////////////////////////////////
  ///// GasLog include header start
  var gasLogLib='https://raw.githubusercontent.com/zixia/gasl/master/gas-log.js'
  var GasLog = eval(UrlFetchApp.fetch(gasLogLib).getContentText())
  
  var log = new GasLog({
    printDriver: 'Logger'
    , logLevel: 'INFO'
  })
  ///// GasLog include header end
  //////////////////////////////////////////////////////////////////////////////////////////
  
  for (var n=0; n<=log.DEBUG; n++) {
    testLog_(n)
  }
  
  for (var logName in log.LOG_LEVELS) {
    testLog_(logName)
  }

  function testLog_(level) {
    
    log.setLogLevel(level)
    
    log(log.EMERG, '### Current log level is %s : %s ###', level, log.getLogLevel())
    log('Hello, I am a default level message')  
    
    log(log.EMERG  , 'this is a %s level msg', 'EMERG')
    log(log.ALERT  , 'this is a %s level msg', 'ALERT')
    log(log.CRIT   , 'this is a %s level msg', 'CRIT')
    log(log.ERR    , 'this is a %s level msg', 'ERR')
    log(log.WARNING, 'this is a %s level msg', 'WARNING')
    log(log.NOTICE , 'this is a %s level msg', 'NOTICE')
    log(log.INFO   , 'this is a %s level msg', 'INFO')
    log(log.DEBUG  , 'this is a %s level msg', 'DEBUG')
    
  }
  
}

