var GasLog = (function () {
  'use strict'
  
  /**************************************************************************************
  *
  * GasL - Class GasLog - Google Apps Script Logging-framework
  *
  * Support log to Spreadsheet / Logger / LogEntries(next version) , 
  * and very easy to extended to others.
  *
  * Github: https://github.com/zixia/gasl
  *
  * Example:
    ```javascript
    if ((typeof GasLog)==='undefined') { // Initialize Class GasLog for GasL. (only if not initialized)
      eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/zixia/gasl/master/src/gas-log-lib.js').getContentText())
    } // Class GasLog is ready for use now!
    
    var log = new GasLog()
   
    log('Hello, %s!', 'World')
    ```
  *
  ***************************************************************************************/
  
  var PRIORITIES = { EMERG:    0
                    , ALERT:   1
                    , CRIT:    2
                    , ERR:     3
                    , WARNING: 4
                    , NOTICE:  5
                    , INFO:    6
                    , DEBUG:   7
                   }


  /****************************************************
  *
  * GasLog Constructor
  *
  ****************************************************/ 
  var GasLog = function (options) {
   
    var logPriority = PRIORITIES.DEBUG
    var isDisabled = false
    
    var logPrinter = new LoggerPrinter()
    var logIdent = 'GasLog'

    if (options && options.ident) {
      logIdent = options.ident
    }

    if (options && options.priority) {  
      logPriority = loadPriority(options.priority)
    }
    
    if (options && options.printer) {
      logPrinter = options.printer
           
      if (!logPrinter.isPrinter()) {
        throw Error('options.printer ' + logPrinter + ' is not a GasLog Printer!')
      }
      
    }
    
        
    /*****************************************
    *
    * Instance Methods Export
    *
    *****************************************/

    for (var logName in PRIORITIES) {
       doLog[logName] = PRIORITIES[logName]
    }
    doLog.PRIORITIES = PRIORITIES

    doLog.getIdent = function () { return logIdent }
    doLog.getPrinter = function () { return logPrinter }
    
    doLog.getPriority = getPriority
    doLog.setPriority = setPriority
    doLog.disable = disable
    doLog.enable = enable
    
        
    /**********************************
    *
    * Constructor initialize finished
    *
    ***********************************/
    return doLog

    
    //////////////////////////////////////////////////////////////
    // Instance Methods Implementations
    //////////////////////////////////////////////////////////////
    
    
    /**
    *
    * Log Level Getter & Setter
    *
    */
    function getPriority() { return logPriority >= 0 ? logPriority : 0 }
    function setPriority(priorityName) {
      logPriority = loadPriority(priorityName)
      return this
    }
    
    function disable() { isDisabled = true }
    function enable()  { isDisabled = false }
    
    /**
    *
    *
    * log(priority, msg, params...)
    * or just log(msg)
    *
    *
    */
    function doLog() {
      
      // make a shiftable array from arguments
      var args = Array.prototype.slice.call(arguments)

      // set to default before we parse params
      // max set to 0 , because -1 is the state of disabled.
      var priority = getPriority()
      
      switch (typeof args[0]) {
        case 'number':
          /**
          *
          * determine priority.
          * if the 1st param is a valid log priority(a Integer), then use it as logPriority
          * otherwise, set logPriority to default(priority in instance)
          *
          */
          priority = loadPriority(args.shift())
          break;
          
        case 'string':
        default:
          break          
      }
      
      
      if (isDisabled) return
      
      // no log for lower priority messages than logPriority
      if (priority > logPriority) return
      
      /**
      *
      * build log string & log
      *
      */
      
      var message = ''
      try {
        args = args.map(function (v) { return (typeof v)==='undefined' ? 'undefined' : v })
        if (typeof args[0] != 'string') args[0] = String(args[0]) // compatible with log(new Date()) . or will cause error. 20160213
        message = Utilities.formatString.apply(null, args)
      } catch (e) {
        message = args.join(' !!! ') + e.name + ':' + e.message
      }
            
      // bind this, for access instance logIdent
      logPrinter.call({ident: logIdent}, priority, message)
      
    }
  }
  
  /********************************
  *
  * Class Static Methods Export
  *
  *********************************/
  GasLog.Printer = {
    Logger: LoggerPrinter
    , Spreadsheet: SpreadsheetPrinter
    , LogEntries: LogEntriesPrinter
  }
  
  return GasLog
  
  
  ///////////////////////////////////////////////////////////////////////////////
  // Class Static Method Implementations
  ///////////////////////////////////////////////////////////////////////////////
  
  function LoggerPrinter() {
    
    var loggerPrinter_ = function (priority, message) {
      return Logger.log(message) 
    }
    
    loggerPrinter_.isPrinter = function () { return 'Logger' }
    return loggerPrinter_
  }
  
  /**
  *
  * @param Object options
  *   options.spreadsheet - Spreadsheet Object
  *   options.id          - Spreadsheet ID
  *   options.url         - Spreadsheet URL
  *   options.sheetName   - Name of the sheet tab
  *   options.clear       - true for clear all log sheet. default false
  *   options.scroll      - 'DOWN' or 'UP', default DOWN
  *
  */
  function SpreadsheetPrinter(options) {
    
    if(typeof options != 'object') throw Error('options must set for Spreadsheet Printer')

    var sheetName = options.sheetName || 'GasLogs'    
    var clear = options.clear || false
    var scroll = options.scroll || 'DOWN'
    
    var spreadsheet = options.spreadsheet
    var id = options.id
    var url = options.url

    var ss // Spreadsheet
    
    if (spreadsheet) {
      var isSs = spreadsheet.toString() == 'Spreadsheet'
      if (!isSs) throw Error('options.spreadsheet[' + spreadsheet + '] is a Spreadsheet object!')
      ss = spreadsheet
    } else if (id) {
      ss = SpreadsheetApp.openById(id)
    } else if(url) {
      ss = SpreadsheetApp.openByUrl(url)
    } else {
      throw Error('options must set url or id! for get the spreadsheet')
    }

    if (!ss) throw Error('SpreadsheetPrinter open ' + id + url + ' failed!')
    
    // Sheet for logging
    var sheet = ss.getSheetByName(sheetName)
    if (!sheet) {
      sheet = ss.insertSheet(sheetName)
      if (!sheet) throw Error('SpreadsheetPrint insertSheet ' + sheetName + ' failed!')
    }

    /**
    * initialize headers if not exist in sheet
    */
    var range = sheet.getRange(1, 1, 1, 6)
    var h = range.getValues()[0]
    if (!h[0] && !h[1] && !h[2] && !h[3]) {
      range.setValues([['Date', 'Ident', 'Priority', 'Message', 'Powered by GasL - Google Apps Script Logging-framework', 'https://github.com/zixia/gasl']])
    }   
    
    if (clear && sheet.getMaxRows() > 2) {
      // keep header & first content row (the 1st & 2nd row)
      sheet.deleteRows(3, sheet.getMaxRows()-2)
      // clear content row, for keeping header format
      sheet.getRange(2, 1, 1, sheet.getLastColumn()).clearContent()
    }
    
    /***********************
    *
    * Spreadsheet Printer 
    *
    ************************/
    var spreadsheetPrinter_ = function (priority, message) {
     
      var ident = ''
      if (this && this.ident) {
        ident = this.ident
      }
      
      var MAX_CHAR_NUM = 50000
      if (message.length > MAX_CHAR_NUM) {
        message = message.substring(0, MAX_CHAR_NUM)
      }
      
      var logRow = [new Date(), ident, priority, message]

      if (scroll=='UP') {
        sheet
        .insertRowBefore(2)
        .getRange(2, 1, 1, 4)
        .setValues([logRow])
      } else { // scroll DOWN
        sheet.appendRow(logRow)
      }
    }
    
    spreadsheetPrinter_.isPrinter = function () { return 'Spreadsheet' }

    return spreadsheetPrinter_
  }

  /**
  *
  * LogEntries Printer
  *
  * @param Object options
  *   options.token - LogEntries TOKEN
  *
  */
  function LogEntriesPrinter(options) {
    
    if(typeof options != 'object') throw Error('options must set for LogEntries Printer')

    var TOKEN = options.token
    if (!TOKEN) throw Error('options.token must set for LogEntries Printer')
    
    /***********************
    *
    * LogEntries Printer 
    *
    ************************/
    var logEntriesPrinter_ = function (priority, message) {

      var ident = ''
      if (this && this.ident) {
        ident = this.ident
      }
      
      var payload = ident + '\t' + priority + '\t' + message

      var options = {
        payload: payload
        , method: 'post'
        , muteHttpExceptions: true
      }

      var endPoint = 'https://js.logentries.com/v1/logs/' + TOKEN
      var retCode

      try { 
        var response = UrlFetchApp.fetch(endPoint, options)
        retCode = response.getResponseCode()
      } catch (e) {
        /**
        *
        * XXX for authMode = NONE
        * we drop log and will return false
        *
        */
      }      
      return retCode==200
    }
    
    logEntriesPrinter_.isPrinter = function () { return 'LogEntries' }

    return logEntriesPrinter_
  }
  
  /**
  *
  *
  */
  function loadPriority(priority) {
    if (priority % 1 === 0) {
      
      return priority
      
    } else if (typeof priority == 'string') {
      priority = priority.toUpperCase()
      if (priority in PRIORITIES) {
        
        return PRIORITIES[priority]
        
      }
    } 
    
    throw Error('options.priority[' + priority + '] illegal')
  }

}())