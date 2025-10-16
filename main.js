#!/usr/bin/env node
const JSON5 = require('json5');
const path = require('path');
const paths = require('./utils/paths');
require('module-alias')(path.dirname(paths.package));
const yargs = require('yargs');
const fs = require('fs');
const makeCode = require('@src/makeCode');
const makeCodeHigh = require('@src/makeCodeHigh');
const makeCookie = require('@src/makeCookie');
const basearrParse = require('@src/basearrParse');
const utils = require('@utils/');
const { logger, getCode, getImmucfg } = utils;
const pkg = require(paths.package);
const log4js = require('log4js');
const gv = require('@src/handler/globalVarible');
const _merge = require('lodash/merge');
const _omit = require('lodash/omit');
const _pick = require('lodash/pick');
const _get = require('lodash/get');
const { mode_version } = require('@src/config/');

function debugLog(level) {
  if (level) {
    if (!log4js.levels.levels.map(it => it.levelStr).includes(level.toUpperCase())) {
      throw new Error('日志等级输入错误，请检查!');
    }
    logger.level = level;
  }
  logger.trace('execPath:', __dirname);
  logger.trace('filePath:', __filename);
  logger.trace('processCwd:', process.cwd());
  logger.trace('paths:\n', JSON.stringify(paths, null, 2));
}

const commandBuilder = {
  f: {
    alias: 'file',
    describe: '含有nsd, cd值的json文件, 不传则取与模式版本(-m)匹配的默认ts文件',
    type: 'string',
    coerce: (input) => {
      input = paths.resolveCwd(input);
      if (!fs.existsSync(input)) throw new Error(`输入文件不存在: ${input}`);
      return input;
    }
  },
  j: {
    alias: 'jsurls',
    describe: '瑞数加密的js文件链接或者本地js文件路径',
    type: 'array',
    coerce: getCode,
  },
  m: {
    alias: 'mode',
    describe: `与-f参数一起使用，表示使用的模式版本，当前最新模式版本为${mode_version}，用于内置用例开发调试`,
    default: mode_version,
    type: 'number',
    coerce: (input) => {
      if (isNaN(input) || input < 1 || input > mode_version) throw new Error(`模式版本不合法！取值应该在1~${mode_version}之间`);
      return input;
    },
  },
  u: {
    alias: 'url',
    describe: '瑞数返回204状态码的请求地址',
    type: 'string',
    coerce: getCode,
  },
  o: {
    alias: 'output',
    describe: '输出文件目录',
    type: 'string',
    default: './output',
    coerce: (path) => {
      return paths.resolveCwd(path);
    }
  },
  l: {
    alias: 'level',
    describe: '日志打印等级，参考log4js，默认为warn',
    type: 'string',
  },
  c: {
    alias: 'config',
    describe: '配置对象，传入对象或者json文件路径',
    type: 'string',
    coerce: (input) => {
      const inputCwd = paths.resolveCwd(input);
      if (fs.existsSync(inputCwd) && fs.statSync(inputCwd).isFile()) {
        input = fs.readFileSync(inputCwd, 'utf8')
      }
      const data = JSON5.parse(input);
      gv._setAttr('makecookieRuntimeConfig', data)
      return data;
    },
  },
  b: {
    alias: 'basearr',
    describe: '压缩前数字数组的序列化文本',
    type: 'array',
    demandOption: true,
  },
}

const commandHandler = (command, argv) => {
  gv._setAttr('argv', argv);
  debugLog(argv.level);
  const outputResolve = (...p) => path.resolve(argv.output, ...p);
  const ts = (() => {
    if (argv.file) return JSON.parse(fs.readFileSync(argv.file, 'utf8'));
    if (argv.url) return argv.url.$_ts;
    const tspath = paths.exampleResolve('codes', `${argv.mode}-\$_ts.json`)
    return JSON.parse(fs.readFileSync(tspath, 'utf8'))
  })();
  logger.trace(`$_ts.nsd: ${ts.nsd}`);
  logger.trace(`$_ts.cd: ${ts.cd}`);
  try {
    const jscode = _get(gv.argv, 'mate.jscode.code');
    const immucfg = jscode ? getImmucfg(jscode) : gv.config.immucfg;
    command(ts, immucfg, outputResolve, gv.argv.mate);
  } catch (err) {
    logger.error(err.stack);
  }
}

module.exports = yargs
  .help('h')
  .alias('v', 'version')
  .version(pkg.version)
  .usage('使用: node $0 <commond> [options]')
  .command(
    'makecode',
    '根据传入的ts文件、网站地址、js文件地址等，生成全量ts文本、静态文本、内外层虚拟机代码等文件',
    (yargs) => {
      return yargs
        .option('f', commandBuilder.f)
        .option('j', commandBuilder.j)
        .option('m', commandBuilder.m)
        .option('u', commandBuilder.u)
        .option('o', commandBuilder.o)
        .option('l', commandBuilder.l)
        .example('$0 makecode')
        .example('$0 makecode -m 3 -f /path/to/ts.json')
        .example('$0 makecode -u https://url/index.html')
        .example('$0 makecode -u https://url/index.html -f /path/to/ts.json')
        .example('$0 makecode -j https://url/main.js -f /path/to/ts.json')
        .example('$0 makecode -j /path/to/main.js -f /path/to/ts.json');
    },
    commandHandler.bind(null, makeCode),
  )
  .command(
    'makecode-high',
    '接收网站地址，生成两次请求对应的全量ts文本、静态文本、内外层虚拟机代码等文件',
    (yargs) => {
      return yargs
        .option('m', commandBuilder.m)
        .option('u', { ...commandBuilder.u, demandOption: true })
        .option('o', commandBuilder.o)
        .option('l', commandBuilder.l)
        .example('$0 makecode-high -u https://url/index.html');
    },
    commandHandler.bind(null, makeCodeHigh),
  )
  .command(
    'makecookie',
    '生成cookie字符串，包含后台返回+程序生成，可直接复制使用',
    (yargs) => {
      return yargs
        .option('f', commandBuilder.f)
        .option('j', commandBuilder.j)
        .option('m', commandBuilder.m)
        .option('u', commandBuilder.u)
        .option('o', commandBuilder.o)
        .option('l', commandBuilder.l)
        .option('c', commandBuilder.c)
        .example('$0 makecookie')
        .example('$0 makecookie -m 3 -f /path/to/ts.json')
        .example('$0 makecookie -u https://url/index.html')
        .example('$0 makecookie -u https://url/index.html -f /path/to/ts.json')
        .example('$0 makecookie -j https://url/main.js -f /path/to/ts.json')
        .example('$0 makecookie -j /path/to/main.js -f /path/to/ts.json');
    },
    commandHandler.bind(null, makeCookie),
  )
  .command(
    'exec',
    '直接运行代码，用于开发及演示时使用',
    (yargs) => {
      return yargs
        .option('l', commandBuilder.l)
        .option('c', {
          alias: 'code',
          describe: '要运行的代码，如：gv.cp2，即打印cp2的值',
          type: 'string',
          demandOption: true,
          coerce: (input) => {
            const inputCwd = paths.resolveCwd(input);
            if (fs.existsSync(inputCwd) && fs.statSync(inputCwd).isFile()) {
              return fs.readFileSync(inputCwd, 'utf8')
            }
            return input;
          },
        })
        .option('f', commandBuilder.f)
        .option('m', commandBuilder.m)
        .example('$0 exec -m 3 -f /path/to/ts.json -c gv.cp0');
    },
    (argv) => {
      debugLog(argv.level);
      Math.random = () => 0.1253744220839037;
      const gv = require('@utils/initGv')(argv);
      Object.assign(global, gv.utils);
      Object.assign(global, require('@src/handler/viewer/'));
      let output = '';
      if (argv.code) {
        output = JSON.stringify(eval(argv.code));
        console.log([`\n  输入：${argv.code}`, `输出：${output}\n`].join('\n  '));
      } else {
        eval(fs.readFileSync(paths.resolve('utils/consoles/keys.js'), 'utf8'));
      }
    }
  )
  .command(
    'basearr',
    '接收压缩前数字数组的序列化文本并格式化解析',
    (yargs) => {
      return yargs
        .option('l', commandBuilder.l)
        .option('b', commandBuilder.b)
        .example("$0 basearr -b '[3,49,...,103,...,125]' -b '[3,49,...,87,...,125]'")
    },
    (argv) => {
      debugLog(argv.level);
      basearrParse(argv.basearr);
    }
  )
  .updateStrings({
    'Show version number': '显示版本号',
    'Show help': '显示帮助信息',
  })
  .example('$0 makecode -u http://url/path')
  .example('$0 makecookie -f /path/to/ts.json -m 3')
  .example('$0 makecookie -u http://url/path')
  .example('$0 makecode-high -u http://url/path')
  .example("$0 exec -m 3 -c 'ascii2string(gv.keys[21])'")
  .example("$0 basearr -b '[3,49,...,103,...,125]' -b '[3,49,...,87,...,125]'")
  .demandCommand(1, '请指定要运行的命令')
  .epilog('更多信息请访问：https://github.com/pysunday/rs-reverse')
  .strict()
  .argv;

