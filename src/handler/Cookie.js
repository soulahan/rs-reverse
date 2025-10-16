const logger = require('@utils/logger');
const parser = require('./parser/');
const gv = require('./globalVarible');
const getBasearr = require('./basearr');

const {
  numToNumarr4,
  uuid,
  ascii2string,
  numarrAddTime,
  encryptMode1,
  numarrJoin,
  numarr2string,
  numarrEncrypt,
  xor,
} = parser;

module.exports = class {
  constructor(ts, r2mkaText, coder, vmcode) {
    this.coder = coder;
    this.vmcode = vmcode;
    parser.init(ts, r2mkaText)
    this.config = { ...gv.makecookieRuntimeConfig };
    if (!this.config.codeUid) this.config.codeUid = this.getCodeUid();
    if (!this.config.r2mkaTime) this.config.r2mkaTime = +ascii2string(gv.keys[21]);
    // console.log(this.config);
  }

  run() {
    const basearr = getBasearr(this.config)
    logger.info(`basearr【${basearr.length}】: [${basearr}]`)
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

  getCodeUid() {
    const mainFunctionCode = this.vmcode.slice(...this.coder.mainFunctionIdx);
    const one = uuid(this.coder.functionsNameSort[ascii2string(gv.keys[33])].code);
    const len = parseInt(mainFunctionCode.length / 100);
    const start = len * ascii2string(gv.keys[34]);
    const two = uuid(mainFunctionCode.substr(start, len))
    return (one ^ two) & 65535;
  }
}
