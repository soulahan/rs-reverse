const fs = require('fs');
const logger = require('@utils/logger');
const paths = require('@utils/paths');
const getImmucfg = require('@utils/getImmucfg');

module.exports = (gv) => {
  const config = {offsetConst: {}};
  const code = gv.argv.mate.jscode?.code || fs.readFileSync(paths.exampleResolve('codes', `main.js`), 'utf8');
  const val = code.match(/_\$[\$_A-Za-z0-9]{2}=_\$[\$_A-Za-z0-9]{2}\(0,([0-9]+),_\$[\$_A-Za-z0-9]{2}\(/);
  if (val && val.length === 2) {
    config.keynameNum = parseInt(val[1]);
  } else {
    throw new Error('keyname长度未匹配到!');
  }
  Object.assign(config, {
    hostname: gv.argv.mate.url?.split('/')[2] || undefined,
    immucfg: getImmucfg(code),
    adapt: [
      'XElMWxdaV1BJWBdeVk8XWlc=',
      'Q1FYVklQVxdKXlpaF1pWVBdaVw==',
    ],
  });
  gv._setAttr('config', config);
}
