var log = new GasLog({
  printDriver: 'Logger'
  , level: 'DEBUG'
})

function testLoop() {
  for (var n=0; n<=log.DEBUG; n++) {
    testLog(n)
  }
  
  for (var logName in log.LOG_LEVELS) {
    testLog(logName)
  }
  
}
function testLog(level) {
 
  log.setLogLevel(level)
  
  log(log.EMERG, '### Current log level is %s : %s ###', level, log.getLogLevel())
  log('Hello, I am a default level message')  
  
  log(log.EMERG, 'this is a %s level msg', 'EMERG')
  log(log.ALERT, 'this is a %s level msg', 'ALERT')
  log(log.CRIT, 'this is a %s level msg', 'CRIT')
  log(log.ERR, 'this is a %s level msg', 'ERR')
  log(log.WARNING, 'this is a %s level msg', 'WARNING')
  log(log.NOTICE, 'this is a %s level msg', 'NOTICE')
  log(log.INFO, 'this is a %s level msg', 'INFO')
  log(log.DEBUG, 'this is a %s level msg', 'DEBUG')

}

