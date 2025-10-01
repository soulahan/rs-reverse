const paths = require('@utils/paths');
const fs = require('fs');
const { init } = require('@src/handler/parser/');
const logger = require('./logger');
const gv = require('@src/handler/globalVarible');
const Coder = require('@src/handler/Coder');

module.exports = function(argv) {
  gv._setAttr('argv', argv);
  const filepath = argv.file ? argv.file : paths.exampleResolve('codes', `${argv.mode}-\$_ts.json`);
  logger.debug(`初始化GlobalVarible变量，$_ts配置文件：${filepath}`);
  const coder = new Coder(JSON.parse(fs.readFileSync(filepath, 'utf8')));
  const { code, $_ts } = coder.run();
  init($_ts);
  return gv;
};
