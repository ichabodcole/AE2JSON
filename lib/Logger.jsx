// Logger v1.0
//
// Copyright (c) 2012 Cole Reed. All rights reserved.
// email: info AT auralgrey DOT com    
//
// Logger is a helper class to beautify console output.

// A quick addition to the String class so we can repeat characters easily.
String.prototype.repeat = function(num) {
    return new Array( num + 1 ).join(this);
}

//
var Logger = (function(){

  function Logger(){
    this.name         = "Logger"
    this.mute         = false;
    this.indent       = true;
    this.indentLevel  = 0;
    this.indentChar   = "--";
    this.indentString = "";
  }

  // Prints an objects properties to the console
  Logger.prototype.inspect = function(object) {
    try{
      for(var prop in object) {
        this.puts(prop);
      }
    }catch(err){
      this.puts(err);
    }
  }

  // Writes a message to the console
  Logger.prototype.puts = function(message, indentLevel) {
    var indent;
    if(this.indent == true) {
      // do some automatic indenting if no indentLevel is defined.
      if(typeof indentLevel != 'number') {
        this.indentString += this.indentChar;
        indent = this.indentString + " ";
      }else{
        indent = this.indentString + this.indentChar.repeat(indentLevel) + " ";
      }
    }else{
      indent = "";
    }
    
    try{
      var myLog = indent + message.toString();
    } catch (err){
      var myLog = err;
    }
    
    if(!this.mute) { $.writeln(myLog) };
  }

  // Reset the indent string
  Logger.prototype.reset = function() {
    this.indentString = "";
    if(!this.mute) { $.writeln(this.indentString) };
  }

  // Stop logging to console
  Logger.prototype.stop = function() {
    this.mute = true;
  }

  // Start logging to console
  Logger.prototype.start = function() {
    this.mute = false;
  }

  // Indent messages
  Logger.prototype.indentOn = function(bool){
    this.indent = (bool == true) ? true : false;
  }

  return Logger;
})();