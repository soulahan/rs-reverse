const _random = require('lodash/random');
const dataOper = require('./dataOper');
const parser = require('./parser/');
const gv = require('./globalVarible');

const {
  fixedValue20,
  factorial,
  fibonacci,
  numToNumarr2,
  numToNumarr4,
  numToNumarr8,
  uuid,
  string2ascii,
  execRandomByNumber,
  execNumberByTime,
  hexnum,
  ascii2string,
  getFixedNumber,
  numarrAddTime,
  decode,
  decrypt,
  encryptMode1,
  encryptMode2,
  numarrJoin,
  numarr2string,
  numarrEncrypt,
  xor,
  runTask,
} = parser;

module.exports = class {
  constructor(ts, r2mkaText, coder, vmcode) {
    this.coder = coder;
    this.vmcode = vmcode;
    parser.init(ts, r2mkaText)
    this.config = {
      r2mkaTime: +ascii2string(gv.keys[21]), // r2mka文本解析出来的时间
      ...gv.makecookieRuntimeConfig,
    }
  }

  getBasearr(deep = 0) {
    if (deep >= 1000) throw new Error('生成cookie尝试次数过多')
    const basearr = this[`getBasearr_v${gv.version}`]();
    if (gv.version === 3 && numarrEncrypt(basearr).length !== 111) return this.getBasearr(deep + 1);
    return basearr;
  }

  run() {
    const basearr = this.getBasearr()
    const nextarr = numarrJoin(
      numarrJoin(
        2,
        numToNumarr4([this.config.r2mkaTime, this.config.startTime]),
        gv.keys[2]
      ),
      encryptMode1(
        xor(
          numarrEncrypt(basearr),
          gv.keys[2],
          16
        ),
        numarrAddTime(gv.keys[17], this.config.runTime, this.config.random)[0],
        0
      )
    )
    return '0' + numarr2string(
      encryptMode1(
        [
          ...numToNumarr4(uuid(nextarr)),
          ...nextarr
        ],
        numarrAddTime(gv.keys[16], this.config.runTime, this.config.random)[0],
        1,
        this.config.random
      )
    );
  }

  getBasearr_v3() {
    // 第3版计算cookie基础数组，cookie位数257位(当gv.keys[22]存在值)
    return numarrJoin(
      3,
      numarrJoin(
        1,
        this.config['window.navigator.maxTouchPoints'],
        this.config['window.eval.toString().length'],
        128,
        ...numToNumarr4(uuid(this.config['window.navigator.userAgent'])),
        string2ascii(this.config['window.navigator.platform']),
        ...numToNumarr4(this.config.execNumberByTime),
        ...execRandomByNumber(98, this.config.random),
        0,
        0,
        ...numToNumarr4(Number(hexnum('3136373737323136'))),
        ...numToNumarr4(this.getTaskNumber('0>one>60-197', 56)),
        ...numToNumarr2(this.config['window.innerHeight']),
        ...numToNumarr2(this.config['window.innerWidth']),
        ...numToNumarr2(this.config['window.outerHeight']),
        ...numToNumarr2(this.config['window.outerWidth']),
        ...numToNumarr8(this.getTaskNumber('0>one>60-197', 61)),
      ),
      10, // 下标43
      (() => {
        const flag = +ascii2string(gv.keys[24]);
        return [
          flag > 0 && flag < 8 ? 1 : 0,
          13,
          ...numToNumarr4(this.config.r2mkaTime + this.config.runTime - this.config.startTime), // ramka串返回的时间 + 当前时间 - 启动时间
          ...numToNumarr4(+ascii2string(gv.keys[19])),
          ...numToNumarr8(Math.floor((this.config.random || Math.random()) * 1048575) * 4294967296 + (((this.config.currentTime + 0) & 4294967295) >>> 0)),
          flag,
        ];
      })(),
      7, // 下标64
      [
        ...numToNumarr4(16777216), // gv.cp2取得
        ...numToNumarr4(0), // 任务编号0-0的任务列表取得
        ...numToNumarr2(4117),
        ...this.getCodeUid(),
      ],
      0, // 任务编号0>one>63-287的任务列表取得
      [0], // 任务编号0>one>63>one>4-290的任务列表取得
      6, // 下标81
      [ // 编号510方法执行返回
        1,
        ...numToNumarr2(1), // 判断某程序代码是否执行，执行后会取当前时间缓存备用，通过缓存值变量名和undefined做对比，如果存在则执行Math.round((缓存时间 - 当前时间) / 100)，执行出来的结果是Math.round(1.26)
        ...numToNumarr2(1), // math.round((0 + (!document.hidden ? 某个时间 - 当前时间)) / 100), 某个时间与上一行缓存的时间值一致，不确定是否同一个值
        this.config['window.document.hidden'] ? 0 : 1,
        ...encryptMode2(decrypt(ascii2string(gv.keys[22])), numarrAddTime(gv.keys[16])[0]),
        ...numToNumarr2(+decode(decrypt(ascii2string(gv.keys[22])))),
      ],
      2, // 下标99
      fixedValue20(),
      9, // 下标105
      (() => { // 编号133方法
        const { connType } = this.config['window.navigator.connection'];
        const { charging, chargingTime, level } = this.config['window.navigator.battery']
        const connTypeIdx = ['bluetooth', 'cellular', 'ethernet', 'wifi', 'wimax'].indexOf(connType) + 1;
        let oper = 0;
        if (level) oper |= 2;
        if (charging) oper |= 1;
        if (connTypeIdx !== undefined) oper |= 8
        return [
          oper,
          level * 100,
          ...numToNumarr2(chargingTime),
          connTypeIdx,
        ]
      })(),
      13,
      [0],
      15,
      (() => {
        const [key, valstr] = ascii2string(gv.keys[40]).split(':');
        const val = ((str) => {
          if (typeof str !== 'string') throw new Error('传入参数非字符串');
          str = str.replace(/[^A-Za-z0-9\+\/\=]/g, '')
          if (str.length !== 4) throw new Error('字符长度非4个未做适配');
          const data = [...str].map(it => gv.alphabet.indexOf(it));
          const val1 = (data[0] << gv.cp2[54]) | (data[1] >> gv.cp2[13]);
          const val2 = ((gv.cp2[15] & data[1]) << gv.cp2[13]) | (data[2] >> gv.cp2[54]);
          const val3 = ((gv.cp2[42] & data[2]) << gv.cp2[45]) | data[3];
          if (val2 === 4) return val3;
          throw new Error(`解析${str}j结果中中间值不为二会在数据组装时传回{k:"[E]"}, 当前案例{k:1}为正确值`)
        })(valstr);
        const arr = string2ascii(`{"${key}":${val}}`);
        return [ arr.length , ...arr ];
      })(),
    )
  }

  getBasearr_v2() {
    // 第2版计算cookie基础数组，cookie位数257位(当gv.keys[22]存在值)
    return numarrJoin(
      3,
      numarrJoin(
        1,
        this.config['window.navigator.maxTouchPoints'],
        this.config['window.eval.toString().length'],
        128,
        ...numToNumarr4(uuid(this.config['window.navigator.userAgent'])),
        string2ascii(this.config['window.navigator.platform']),
        ...numToNumarr4(this.config.execNumberByTime),
        ...execRandomByNumber(98, this.config.random),
        0,
        0,
        ...numToNumarr4(Number(hexnum('3136373737323136'))),
        ...numToNumarr4(0),
        ...numToNumarr2(this.config['window.innerHeight']),
        ...numToNumarr2(this.config['window.innerWidth']),
        ...numToNumarr2(this.config['window.outerHeight']),
        ...numToNumarr2(this.config['window.outerWidth']),
      ),
      10, // 下标43
      (() => {
        const flag = +ascii2string(gv.keys[24]);
        return [
          flag > 0 && flag < 8 ? 1 : 0,
          13,
          ...numToNumarr4(this.config.r2mkaTime + this.config.runTime - this.config.startTime), // ramka串返回的时间 + 当前时间 - 启动时间
          ...numToNumarr4(+ascii2string(gv.keys[19])),
          ...numToNumarr8(Math.floor((this.config.random || Math.random()) * 1048575) * 4294967296 + (((this.config.currentTime + 1) & 4294967295) >>> 0)),
          flag,
        ];
      })(),
      7, // 下标64
      [
        ...numToNumarr4(16777216), // gv.cp2取得
        ...numToNumarr4(0), // 任务编号0-0的任务列表取得
        ...numToNumarr2(getFixedNumber()), // 固定值5900
        ...this.getCodeUid(),
      ],
      0, // 任务编号0>one>63-287的任务列表取得
      [0], // 任务编号0>one>63>one>4-290的任务列表取得
      6, // 下标81
      [ // 编号510方法执行返回
        1,
        ...numToNumarr2(0),
        ...numToNumarr2(0),
        this.config['window.document.hidden'] ? 0 : 1,
        ...encryptMode2(decrypt(ascii2string(gv.keys[22])), numarrAddTime(gv.keys[16])[0]),
        ...numToNumarr2(+decode(decrypt(ascii2string(gv.keys[22])))),
      ],
      2, // 下标99
      (() => {
        const taskmap = {}
        runTask('0>one>71>one>4-342', [taskmap]);
        return [29, 30, 31, 32].map(it => {
          return taskmap[ascii2string(gv.keys[it])]();
        })
      })(),
      9, // 下标105
      (() => { // 编号133方法
        const { connType } = this.config['window.navigator.connection'];
        const { charging, chargingTime, level } = this.config['window.navigator.battery']
        const connTypeIdx = ['bluetooth', 'cellular', 'ethernet', 'wifi', 'wimax'].indexOf(connType) + 1;
        let oper = 0;
        if (level) oper |= 2;
        if (charging) oper |= 1;
        if (connTypeIdx !== undefined) oper |= 8
        return [
          oper,
          level * 100,
          chargingTime >> 8,
          chargingTime & 255,
          connTypeIdx,
        ]
      })(),
      13,
      [0],
    )
  }

  getBasearr_v1() {
    // 第1版计算cookie基础数组，cookie位数236位
    const { getTaskNumber: gtn } = this;
    return numarrJoin(
      3,
      numarrJoin(
        gtn('0>one>62>one>30-272', 550),
        this.config['window.navigator.maxTouchPoints'],
        this.config['window.eval.toString().length'],
        gtn('0>one>62>one>28-270', 1) | (gtn('0>one>62>one>28-270', 92) << 7),
        ...numToNumarr4(uuid(this.config['window.navigator.userAgent'])),
        string2ascii(this.config['window.navigator.platform']),
        ...numToNumarr4(_random(500, 1000)),
        ...execRandomByNumber(),
        gtn('0>one>62>one>12-246', 28),
        gtn('0>one>62-235', 36),
        ...numToNumarr4(Number(hexnum(gv.cp0_96(6, 76))))
      ),
      10,
      (() => {
        const flag = +ascii2string(gv.keys[24]);
        return [
          flag > 0 && flag < 8 ? 1 : 0,
          13,
          ...numToNumarr4(this.r2mkaTime + this.runTime - this.startTime), // ramka串返回的时间 + 当前时间 - 启动时间
          ...numToNumarr4(+ascii2string(gv.keys[19])),
          ...numToNumarr8(Math.floor(Math.random() * 1048575) * 4294967296 + (((this.runTime * 1000) & 4294967295) >>> 0)),
          flag,
        ];
      })(),
      7,
      [
        ...numToNumarr4(Number(hexnum(gv.cp0_96(6, 76)))),
        ...numToNumarr4(gtn('0-0', 92)),
        ...numToNumarr2(getFixedNumber()),
        ...numToNumarr2(46228), // 根据方法的toString()计算
      ],
      0,
      [0],
      6,
      (() => {
        const name = this.config['window.name'].split('&').reduce((ans, it) => {
          const [key, val] = it.split('=');
          return { ...ans, [key]: val };
        }, {});
        return [
          1, 0, 0, 0, 0, 0,
          ...encryptMode2(decrypt(name.$_YWTU || ''), numarrAddTime(gv.keys[16])[0]),
          ...numToNumarr2(+decode(decrypt(name.$_YVTX || ''))),
        ];
      })(),
      2,
      [
        factorial(5) - factorial(3) * 2,
        fibonacci(11) + 37,
        factorial(6) / 4,
        11,
      ],
      9,
      (() => {
        const { connType } = this.config['window.navigator.connection'];
        const { charging, chargingTime, level } = this.config['window.navigator.battery']
        const connTypeIdx = ['bluetooth', 'cellular', 'ethernet', 'wifi', 'wimax'].indexOf(connType) + 1;
        let oper = 0;
        if (level) oper |= 2;
        if (charging) oper |= 1;
        if (connTypeIdx !== undefined) oper |= 8
        return [
          oper,
          level * 100,
          chargingTime >> 8,
          chargingTime & 255,
          connTypeIdx,
        ]
      })(),
      13,
      [0],
    );
  }

  getTaskNumber(name, idx) {
    return gv.r2mka(name).taskarr[idx];
  }

  getCodeUid() {
    if (this.config.codeUid) return numToNumarr2(this.config.codeUid);
    const mainFunctionCode = this.vmcode.slice(...this.coder.mainFunctionIdx);
    const one = uuid(this.coder.functionsNameSort[ascii2string(gv.keys[33])].code);
    const len = parseInt(mainFunctionCode.length / 100);
    const start = len * ascii2string(gv.keys[34]);
    const two = uuid(mainFunctionCode.substr(start, len))
    return numToNumarr2((one ^ two) & 65535);
  }
}
