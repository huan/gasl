(function () {
  /**
   *
   * GasL - Logger-framework for Google Apps Script
   *
   * Github: https://github.com/zixia/gasl
   *
   * ChangeLog:
   *    2015/10/31 init version
   *    2015/12/04 modulization
   *    2015/12/10 githubed!
   *
   */
  
  var LOG_LEVELS = { EMERG:    0
                    , ALERT:   1
                    , CRIT:    2
                    , ERR:     3
                    , WARNING: 4
                    , NOTICE:  5
                    , INFO:    6
                    , DEBUG:   7
                   }

  var LOG_LEVEL = LOG_LEVELS.INFO
  //LOG_LEVEL = LOG_LEVELS.DEBUG

  // default for GAS
  var PRINT_DRIVER = loadPrintDriver('Logger')
  
  var gasLog_ = function (options) {
    var logLevel = LOG_LEVEL
    var printDriver = PRINT_DRIVER
    
    if (options && options.logLevel) {  
      logLevel = loadLogLevel(options.logLevel)
    }
    
    if (options && options.printDriver) {
      printDriver = loadPrintDriver(options.printDriver)
    }
    
    this.printDriver = printDriver
    this.logLevel = logLevel

    for (var logName in LOG_LEVELS) {
       doLog[logName] = LOG_LEVELS[logName]
    }
    doLog.LOG_LEVELS = LOG_LEVELS

    doLog.getLogLevel = getLogLevel
    doLog.setLogLevel = setLogLevel
    
    // return log function
    return doLog

    //////////////////////////////////////////////////////////////
    function getLogLevel() { return logLevel }
    function setLogLevel(levelName) {
      logLevel = loadLogLevel(levelName)
      return this
    }
    
    /**
    *
    *
    * log(printDriver, level, msg, params...)
    * or just log(printDriver, msg)
    *
    *
    */
    function doLog() {
      
      // make a shiftable array from arguments
      var args = Array.prototype.slice.call(arguments)

      var level = logLevel // set to default before we parse params
      
      switch (typeof args[0]) {
        case 'number':
          /**
          *
          * determine LOG_LEVEL.
          * if the 1st param is a valid log level(a Integer), then use it as log_level
          * otherwise, set log_level to default(LOG_DEBUG)
          *
          */
          level = args.shift()
          level = loadLogLevel(level)
          break;
          
        case 'string':
          break;
          
        default:
          throw Error('doLog(' + args[0] + ') need 1st param either be string or number!')
          break;
      }
      
      // no log for lower priority messages then LOG_LEVEL
      if (level > logLevel) return
      
      /**
      *
      * build log string & log
      *
      */
      
      var message = ''
      try {
        message = Utilities.formatString.apply(null, args);
      } catch (e) {
        message = args.join(' !!! ')
      }
      
      printDriver(level, message)
      
    }
  }
  
  return gasLog_
  
///////////////////////////////////////////////////////////////////////////////
  
  /**
  *
  * a print driver is a function that accept 2 params: level & msg , and print them.
  *
  */
  function loadPrintDriver(driverName) {
    
    var driver = function (level, msg) { throw Error('unimplenment print driver') }
    
    switch (true) {
      case /Logger/i.test(driverName):
        driver = function (level, msg) { return Logger.log(msg) }
        break;
      default:
        throw Error('unsupported driverName: ' + driverName)
    }
    return driver
  }  
  

  /**
  *
  *
  */
  function loadLogLevel(level) {
    if (level % 1 === 0) {
      
      return level
      
    } else if (typeof level == 'string') {
      level = level.toUpperCase()
      if (level in LOG_LEVELS) {
        
        return LOG_LEVELS[level]
        
      }
    } 
    
    throw Error('options.logLevel[' + level + '] illegel')
  }

}())
