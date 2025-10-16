const { numarrEncrypt } = require('../parser/');
const gv = require('../globalVarible');

function getBasearr(func, config, deep = 0) {
  if (deep >= 1000) throw new Error('生成cookie尝试次数过多')
  const basearr = func(config);
  if (func.encryptLens && numarrEncrypt(basearr).length !== func.encryptLens) return getBasearr(func, config, deep + 1);
  return basearr;
}

function checkUrl(urls) {
  if (!gv.argv.url?.url) return false;
  const currentUrl = gv.argv.url.url.split('/')[2];
  return urls.filter(url => url === currentUrl).length;
}

module.exports = (config) => {
  if (checkUrl(['epub.cnipa.gov.cn'])) {
    return getBasearr(require('./len133-encrypt111.js'), config);
  }
  if (checkUrl(['zhaopin.sgcc.com.cn'])) {
    return getBasearr(require('./len127.js'), config);
  }
  if (gv.version === 1) return getBasearr(require('./oldMode1.js'), config);
  if (gv.version === 2) return getBasearr(require('./oldMode2.js'), config);
  if (gv.version === 3) return getBasearr(require('./len133-encrypt111.js'), config);
}
