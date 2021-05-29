// IMPORTS
var fs = require('fs')
// DECLARATIONS
var variables:any = {};
var functions:any = {
  console: (e:any):void => {
    if (e.match(/^".*"$/) || e.match(/^'.*'$/)) console.log(e.slice(1, e.length - 1).slice(0, e.length - 2));
    else if (isCal(e)) {
      console.log(calculate(e))
    }
    else if (e.match(/^[0-9]+$/)) console.log(e * 1);
    else if (e.length) console.log(variables[e]);
  },
  include: (e:string):void => {
    if (isString(e)) {
      readFile(e.slice(1, e.length - 1));
    } else throw new Error('No file specified')
  },
}

// FUNCTIONS
var isString = (str:string):boolean => { 
  if (typeof str != 'string') return false;
  if (str.startsWith('"') && str.endsWith('"') || str.startsWith("'") && str.endsWith("'")) return true; else return false; 
  }

var includesChar = (str:string, char:string):boolean => {
  if (str.indexOf(char) > -1) return true; else return false;
}
var stringify = (str:string):string => {
  return '"' + str + '"';
}

function isNumeric(str:any):boolean {
  if (typeof str != "string") return false;
  return !isNaN(parseInt(str)) && !isNaN(parseFloat(str));
}

var calculate = (str:any):any => {
  if (includesChar(str, '+')) {
    str = str.match(/(.*)([^\s])\s*\+\s*(.*)([^\s])/);
    str[1] = str[1] + str[2]
    str[2] = str[3] + str[4]
    if (!isString(str[2]) && !isNumeric(str[2])) {
      str[2] = variables[str[2]];
      if (!isNumeric(str[2].toString())) str[2] = stringify(str[2]); else str[2] = str[2] * 1;
    }
    if (!isString(str[1]) && !isNumeric(str[1])) {
      str[1] = variables[str[1]];
      if (!isNumeric(str[1].toString())) str[1] = stringify(str[1]); else str[1] = str[1] * 1;
    }
    return eval(str[1] + '+' + str[2]);
  } else if (includesChar(str, '*')) {
    str = str.match(/(.*)([^\s])\s*\*\s*(.*)([^\s])/);
    str[1] = str[1] + str[2]
    str[2] = str[3] + str[4]
    if (!isString(str[2]) && !isNumeric(str[2])) {
      str[2] = variables[str[2]];
      if (!isNumeric(str[2].toString())) str[2] = stringify(str[2]); else str[2] = str[2] * 1;
    }
    if (!isString(str[1]) && !isNumeric(str[1])) {
      str[1] = variables[str[1]];
      if (!isNumeric(str[1].toString())) str[1] = stringify(str[1]); else str[1] = str[1] * 1;
    }
    if (isString(str[1]) && isNumeric(str[2]) || isString(str[2]) && isNumeric(str[1])) {
      if (isString(str[1]) && isNumeric(str[2])) {
        if (str[2] == 0) return '';
        var orig = str[1]
        for (var i = 1; i < str[2] * 1; i++) {
          str[1] += orig;
        }
        return str[1]
      } else {
        if (str[1] == 0) return '';
        var orig = str[2]
        for (var i = 0; i < str[1] * 1; i++) {
          str[2] += orig;
        }
        return str[2]
      }
    }
    return eval(str[1] + '*' + str[2]);
  } else if (includesChar(str, '-')) {
    str = str.match(/(.*)([^\s])\s*-\s*(.*)([^\s])/);
    str[1] = str[1] + str[2]
    str[2] = str[3] + str[4]
    if (!isString(str[2]) && !isNumeric(str[2])) {
      str[2] = variables[str[2]];
      if (!isNumeric(str[2].toString())) str[2] = stringify(str[2]); else str[2] = str[2] * 1;
    }
    if (!isString(str[1]) && !isNumeric(str[1])) {
      str[1] = variables[str[1]];
      if (!isNumeric(str[1].toString())) str[1] = stringify(str[1]); else str[1] = str[1] * 1;
    }
    return eval(str[1] + '-' + str[2]);
  } else if (includesChar(str, '/')) {
    str = str.match(/(.*)([^\s])\s*\/\s*(.*)([^\s])/);
    str[1] = str[1] + str[2]
    str[2] = str[3] + str[4]
    if (!isString(str[2]) && !isNumeric(str[2])) {
      str[2] = variables[str[2]];
      if (!isNumeric(str[2].toString())) str[2] = stringify(str[2]); else str[2] = str[2] * 1;
    }
    if (!isString(str[1]) && !isNumeric(str[1])) {
      str[1] = variables[str[1]];
      if (!isNumeric(str[1].toString())) str[1] = stringify(str[1]); else str[1] = str[1] * 1;
    }
    return eval(str[1] + '/' + str[2]);
  }
}

var isCal = (str:string):boolean => {
  if (includesChar(str, '+')) return true;
  if (includesChar(str, '*')) return true;
  if (includesChar(str, '/')) return true;
  if (includesChar(str, '-')) return true;
  return false;
}

var parseFunc = (line:any):void => {
  line = line.match(/([A-Za-z0-9]+)\((.*)\)/);
  if (!line) return;
  functions[line[1]](line[2])
}
var addVar = (line:any):void => {
  line = line.match(/^([A-Za-z0-9]+)\s*=\s*(.+)$/)
  if (!line) return;
  if (isString(line[2])) variables[line[1]] = line[2].slice(1, line[2].length - 1); else if (isNumeric(line[2])) variables[line[1]] = line[2] * 1; else if (isCal(line[2])) variables[line[1]] = calculate(line[2]);
}
var readFile = (file:string):void => {
  fs.readFile(file, "utf8", (err:any, data:any) => {
    if (err) throw err;
    data = data.toString().split("\n");
    data.forEach((v:string) => {
      if (v.startsWith('//')) return;
      if (!v.length) return;
      addVar(v);
      parseFunc(v);
    })
  })
}
// EXPORTS
module.exports = {
  run: readFile,
}