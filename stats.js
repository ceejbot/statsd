/*jshint node:true, laxcomma:true */

var core = require('./core')
  , config = require('./lib/config')
  , logger = require('./lib/logger')
  , util    = require('util')
  ;

var conf;

process.title = 'statsd';

function exitGracefully() {
  if (conf.debug) {
    util.log('Starting Final Flush');
  }
  core.setHealthStatus('down');
  process.exit();
}

process.on('exit', function () {
  core.flushMetrics();
});

process.on('SIGINT', exitGracefully);
process.on('SIGTERM', exitGracefully);

config.configFile(process.argv[2], function (config, oldConfig) {
  conf = config;
  var l = new logger.Logger(config.log || {});
  core.createServer(config, l);
});
