// 兼容mode：1的生成cookie方式
const parser = require('../parser/');
const gv = require('../globalVarible');
const _random = require('lodash/random');

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

function getBasearr(config) {
  const gtn = (name, idx) => gv.r2mka(name).taskarr[idx];
  return numarrJoin(
    3,
    numarrJoin(
      gtn('0>one>62>one>30-272', 550),
      config['window.navigator.maxTouchPoints'],
      config['window.eval.toString().length'],
      gtn('0>one>62>one>28-270', 1) | (gtn('0>one>62>one>28-270', 92) << 7),
      ...numToNumarr4(uuid(config['window.navigator.userAgent'])),
      string2ascii(config['window.navigator.platform']),
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
        ...numToNumarr4(this.r2mkaTime + this.runTime - this.startTime),
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
      ...numToNumarr2(46228),
    ],
    0,
    [0],
    6,
    (() => {
      const name = config['window.name'].split('&').reduce((ans, it) => {
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
      const { connType } = config['window.navigator.connection'];
      const { charging, chargingTime, level } = config['window.navigator.battery']
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

module.exports = getBasearr;
