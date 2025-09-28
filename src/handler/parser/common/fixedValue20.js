const gv = require('@src/handler/globalVarible');

module.exports = function () {
  const values = [
    103, 0, 102, 203, 224,
    181, 108, 240, 101, 126,
    103, 11, 102, 203, 225,
    181, 208, 180, 100, 127
  ];
  const maps = values.reduce((ans, value, idx) => {
    ans[gv.ts.cp[1][gv.r2mka("0>one>71>one>4-355").taskarr[idx * 7 + 6]]] = value;
    return ans;
  }, {})
  return Object.values(gv.keys).filter(it => it.length === 4).map(it => maps[gv.utils.ascii2string(it)]);
}
