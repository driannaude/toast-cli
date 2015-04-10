#!/usr/bin/env node


//  ____                   _    
// / ___| _ __   ___  _ __| | __
// \___ \| '_ \ / _ \| '__| |/ /
//  ___) | |_) | (_) | |  |   < 
// |____/| .__/ \___/|_|  |_|\_\
// =============================

//Define Globals
var program;
//Set Dependencies
program = require("commander");
colors = require('colors');
 
colors.setTheme({
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  highlight: 'magenta',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

//Helper Functions and Prototype extensions for commander

var largestWidth = 0;

function setLargestWidth(value){
	if(value > largestWidth){
		largestWidth = value;
	}
}

function pad(str, width) {
  var len = Math.max(0, width - str.length);
  return str + ' ' +Array(len + 1).join(colors.data('.'));
}
/**
 * Takes an argument an returns its human readable equivalent for help usage.
 *
 * @param {Object} arg
 * @return {String}
 * @api private
 */

function humanReadableArgName(arg) {
  var nameOutput = arg.name + (arg.variadic === true ? '...' : '');

  return arg.required
    ? '<' + nameOutput + '>'
    : '[' + nameOutput + ']'
}


program.Command.prototype.helpInformation = function() {
  var desc = [];
  if (this._description) {
    desc = [
      '  ' + this._description
      , ''
    ];
  }

  var cmdName = this._name;
  if (this._alias) {
    cmdName = cmdName + '|' + this._alias;
  }
  var usage = [
    ''
    ,'  ' + this.usage()
    , ''
  ];

  var cmds = [];
  var commandHelp = this.commandHelp();
  if (commandHelp) cmds = [commandHelp];

  var options = [
    '  '+ colors.info('Options:')
    , ''
    , '' + this.optionHelp().replace(/^/gm, '    ')
    , ''
    , ''
  ];

  return usage
    .concat(cmds)
    .concat(desc)
    .concat(options)
    .join('\n');
};

program.Command.prototype.optionHelp = function() {
  var width = this.largestOptionLength();
  setLargestWidth(width);

  // Prepend the help information
  return [colors.warn(pad('-h, --help', largestWidth)) + colors.data('.......... ') + 'output usage information']
    .concat(this.options.map(function(option) {
      return colors.warn(pad(option.flags, largestWidth)) + colors.data('.......... ') + option.description;
      }))
    .join('\n');
};


program.Command.prototype.version = function(str, flags) {
  if (0 == arguments.length) return this._version;
  this._version = str;
  flags = flags || '-V, --version';
  this.option(flags, 'output the version number');
  this.on('version', function() {
    process.stdout.write(str + '\n');
    process.exit(0);
  });
  return this;
};


program.Command.prototype.commandHelp = function() {
  if (!this.commands.length) return '';

  var commands = this.commands.map(function(cmd) {
    var args = cmd._args.map(function(arg) {
      return humanReadableArgName(arg);
    }).join(' ');

    return [
      cmd._name
        + (cmd._alias
          ? '|' + cmd._alias
          : '')
        + (cmd.options.length
          ? ' [options]'
          : '')
        + ' ' + args
    , cmd.description()
    ];
  });

  var width = commands.reduce(function(max, command) {
    return Math.max(max, command[0].length);
  }, 0);
  setLargestWidth(width);
  return [
      ''
    , '  '+colors.info('Commands:')
    , ''
    , commands.map(function(cmd) {
      return colors.warn(pad(cmd[0], largestWidth)) + colors.data('.......... ') + cmd[1];
    }).join('\n').replace(/^/gm, '    ')
    , ''
  ].join('\n');
};



 
console.log('');
console.log('   ____                   _    ');
console.log('  / ___| _ __   ___  _ __| | __');
console.log('  \\___ \\| \'_ \\ / _ \\| \'__| |/ /');
console.log('   ___) | |_) | (_) | |  |   < ');
console.log('  |____/| .__/ \\___/|_|  |_|\\_\\  CLI version 0.1.0')
console.log('  =============================');
console.log('');
program
  .version('0.0.1')
  .usage(colors.highlight('Usage: spork [command]'))
  .command('create [options] <PATH>', 'Creates a new spork Project');
  
program.parse(process.argv);

program.on('--help', function(){
  console.log(colors.blue('  Example: spork\ create mySpork projects/new/'));
  console.log('');
});

if (!process.argv.slice(2).length) {
    console.log('');
    console.log(colors.error('  [ERROR] ') + 'Please Specify a Command.');
    console.log('');
    program.help();
  }
