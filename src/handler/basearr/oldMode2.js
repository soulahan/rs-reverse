// 兼容mode：1的生成cookie方式
const parser = require('../parser/');
const gv = require('../globalVarible');

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
  const getTaskNumber = (name, idx) => gv.r2mka(name).taskarr[idx];
  return numarrJoin(
    3,
    numarrJoin(
      1,
      config['window.navigator.maxTouchPoints'],
      config['window.eval.toString().length'],
      128,
      ...numToNumarr4(uuid(config['window.navigator.userAgent'])),
      string2ascii(config['window.navigator.platform']),
      ...numToNumarr4(config.execNumberByTime),
      ...execRandomByNumber(98, config.random),
      0,
      0,
      ...numToNumarr4(Number(hexnum('3136373737323136'))),
      ...numToNumarr4(0),
      ...numToNumarr2(config['window.innerHeight']),
      ...numToNumarr2(config['window.innerWidth']),
      ...numToNumarr2(config['window.outerHeight']),
      ...numToNumarr2(config['window.outerWidth']),
    ),
    10,
    (() => {
      const flag = +ascii2string(gv.keys[24]);
      return [
        flag > 0 && flag < 8 ? 1 : 0,
        13,
        ...numToNumarr4(config.r2mkaTime + config.runTime - config.startTime),
        ...numToNumarr4(+ascii2string(gv.keys[19])),
        ...numToNumarr8(Math.floor((config.random || Math.random()) * 1048575) * 4294967296 + (((config.currentTime + 1) & 4294967295) >>> 0)),
        flag,
      ];
    })(),
    7,
    [
      ...numToNumarr4(16777216),
      ...numToNumarr4(0),
      ...numToNumarr2(getFixedNumber()),
      ...numToNumarr2(config.codeUid),
    ],
    0,
    [0],
    6,
    [
      1,
      ...numToNumarr2(0),
      ...numToNumarr2(0),
      config['window.document.hidden'] ? 0 : 1,
      ...encryptMode2(decrypt(ascii2string(gv.keys[22])), numarrAddTime(gv.keys[16])[0]),
      ...numToNumarr2(+decode(decrypt(ascii2string(gv.keys[22])))),
    ],
    2,
    (() => {
      const taskmap = {}
      runTask('0>one>71>one>4-342', [taskmap]);
      return [29, 30, 31, 32].map(it => {
        return taskmap[ascii2string(gv.keys[it])]();
      })
    })(),
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
  )
}

module.exports = getBasearr;
