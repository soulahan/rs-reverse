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
  m: {
    alias: 'mode',
    describe: `与-f参数一起使用，表示使用的模式版本，当前最新模式版本为${mode_version}`,
    default: mode_version,
    type: 'number',
    coerce: (input) => {
      if (isNaN(input) || input < 1 || input > mode_version) throw new Error(`模式版本不合法！取值应该在1~${mode_version}之间`);
      gv._setAttr('version', input);
      return input;
    },
  },
  u: {
    alias: 'url',
    describe: '瑞数返回204状态码的请求地址, 与-a命令一起使用',
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
    describe: '日志打印等级，参考log4js，默认为info',
    type: 'string',
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
    const immucfg = argv.url ? getImmucfg(argv.url.jscode.code) : gv.config.immucfg;
    command(ts, immucfg, outputResolve, _merge(argv.url || {}, argv.jsurls || {}));
  } catch (err) {
    logger.error(err.stack);
  }
}

module.exports = yargs
  .help('h')
  .alias('v', 'version')
  .version(pkg.version)
  .usage('使用: node $0 <commond> [options]')
  .command({
    command: 'makecode',
    describe: '接收ts.json文件生成immucfg、ts、ts-full文件，如果传入的是url则还会生成html、主代码、动态代码文件，还可通过-j命令接收多个$_ts.l__处理的文件url并生成该js文件及解密后的js文件',
    builder: {
      ...commandBuilder,
      j: {
        alias: 'jsurls',
        describe: '$_ts.__l方法执行的js文件链接(必须带上查询参数)，多个时需要按顺序传入，如：-j "https://host/chunk.js?4VGu1xaT=a728b2" -j "https://host/app.js?4VGu1xaT=a728b2"',
        type: 'array',
        coerce: getCode,
      }
    },
    handler: commandHandler.bind(null, makeCode),
  })
  .command({
    command: 'makecode-high',
    describe: '解码两次请求返回的网站代码(功能涵盖makecode子命令)',
    builder: {
      ..._omit(commandBuilder, ['f']),
      u: {
        ...commandBuilder.u,
        demandOption: true,
      }
    },
    handler: commandHandler.bind(null, makeCodeHigh),
  })
  .command({
    command: 'makecookie',
    describe: '生成cookie字符串，可直接复制使用',
    builder: {
      ...commandBuilder,
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
    },
    handler: commandHandler.bind(null, makeCookie),
  })
  .command({
    command: 'exec',
    describe: '直接运行代码，用于开发及演示时使用',
    builder: {
      l: {
        alias: 'level',
        describe: '日志打印等级，参考log4js，默认为info',
        type: 'string',
      },
      c: {
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
      },
      ..._pick(commandBuilder, ['f', 'm']),
    },
    handler: (argv) => {
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
  })
  .command({
    command: 'basearr',
    describe: '接收压缩前数字数组的序列化文本并格式化解析',
    builder: {
      l: {
        alias: 'level',
        describe: '日志打印等级，参考log4js，默认为info',
        type: 'string',
      },
      b: {
        alias: 'basearr',
        describe: '压缩前数字数组的序列化文本',
        type: 'array',
        demandOption: true,
      }
    },
    handler: (argv) => {
      debugLog(argv.level);
      basearrParse(argv.basearr);
    }
  })
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
  .epilog('')
  .argv;

