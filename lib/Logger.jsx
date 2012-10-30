// A quick addition to the String class so we can repeat characters easily.
String.prototype.repeat = function(num) {
    return new Array( num + 1 ).join(this);
}
// Logger is a helper class to beautify console output.
var Logger = (function(){

  function Logger(){
    this.name         = "Logger"
    this.mute         = false;
    this.indent       = true;
    this.indentLevel  = 0;
    this.indentChar   = "--";
    this.indentString = "";
  }

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
    
    var myLog = indent + message.toString();
    if(!this.mute) { $.writeln(myLog) };
  }

  Logger.prototype.reset = function() {
    this.indentString = "";
    if(!this.mute) { $.writeln(this.indentString) };
  }

  Logger.prototype.stop = function() {
    this.mute = true;
  }

  Logger.prototype.start = function() {
    this.mute = false;
  }

  Logger.prototype.indentOn = function(bool){
    this.indent = (bool == true) ? true : false;
  }

  return Logger;
})();