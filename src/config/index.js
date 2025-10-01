const logger = require('@utils/logger');

// 最新模式版本号
const mode_version = 3;

/*
keynameNum: 由瑞数动态打包时生成的固定值，控制变量名的生成数量
offsetConst(错误的话会导致解析r2mka值解析出错): 动态代码中生成8位解密用的偏移值数组使用，主要是里面的键值是任务数组中的值了，由于瑞数的任务树是打包时动态生成，且值为任务树中最顶层任务生成，不好获取，因此写死，键值可以在gv.r2mka('0-0').task中找到
codemap(工具动态生成): 瑞数主体循环方法生成的配置文件，用于动态代码使用
immucfg(-u命令动态生成): 版本固定值
*/

module.exports = (version = mode_version) => {
  logger.trace(`当前配置版本: ${version}`);
  const config = {};
  switch (version) {
    case 1:
      Object.assign(config, {
        keynameNum: 806,
        offsetConst: {
          81: 3,
          82: 51,
          83: 153,
        },
        functionsPushStart: { 1: 938, 2: 0, 3: 0, 4: 0 },
      });
      break;
    case 2:
      Object.assign(config, {
        keynameNum: 829,
        offsetConst: {
          91: 3,
          92: 51,
          93: 153,
        },
        functionsPushStart: { 1: 938, 2: 0, 3: 0, 4: 0 },
      });
      break;
    case mode_version:
      Object.assign(config, {
        keynameNum: 851,
        offsetConst: {
          92: 3,
          93: 51,
          94: 153,
        },
        /* ** 生成方法排序数据的开始下标
          makecookie的第5循环文件可以找到，前后运行代码如下：
            !_$_6 ? _$aG += -73 : 0;
            _$jA(794);
            try {
              _$_b = _$$z[_$lb[81]];
              _$hC = _$$z[_$iM[72]];
            } catch (_$_v) {}
          * */
        functionsPushStart: { 1: 794, 2: 0, 3: 0, 4: 0 },
      });
      break;
    default:
      throw new Error(`当前配置版本不存在, 版本编号：${version}`);
  }
  return {
    ...config,
    codemap: require(`./codemap_v${version}.json`),
    immucfg: require(`./immucfg_v${version}.json`),
    version,
  };
}

module.exports.mode_version = mode_version;
