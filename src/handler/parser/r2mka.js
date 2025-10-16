const gv = require('../globalVarible');
const logger = require('@utils/logger');

function gtHandler(str, curr) {
  function oper(step = 1) {
    // console.log(`[r2mka] current: ${curr}(${str.charCodeAt(curr)}) step: ${step}(${str.charCodeAt(curr + step)})`);
    curr += step;
  }
  return {
    getCurr: function() {
      return curr;
    },
    getCode: function() { 
      const code = str.charCodeAt(curr);
      oper()
      return code;
    },
    getLine: function() {
      const end = this.getCode();
      if (end === 0) return '';
      const ans = str.substr(curr, end);
      oper(end);
      return ans;
    },
    getList: function() {
      const ans = this.getLine()
      if (!ans) return [];
      return ans.split(String.fromCharCode(255));
    },
  }
}

const parse = (() => {
  let count = 0;
  const valMap = {};
  const uids = [];
  const checkUid = (uid, key) => {
    if (uids.includes(uid)) {
      // logger.warn(`task: 【 ${key}】uid: 【${uid}】重复定义`);
    } else {
      uids.push(uid);
    }
    return uid;
  }
  return function(val, deep = 0, deeps = [0], parent = null) {
    const str = val.taskstr;
    val.parent = parent;
    val.taskstr = str;
    val.val = {};
    if (!str) {
      val.taskarr = [];
    } else {
      val.taskarr = str.split('').map(it => it.charCodeAt());
    }
    val.taskori = [...val.taskarr]; // taskarr会被动态修改，因此存一个备份
    val.key = `${deeps.join('>')}-${count++}`;
    valMap[val.key] = val;
    const uid = [deep, val.lens, val.isReset, val.taskarr.length, val.child_one.length, val.child_two.length].join('-');
    val.uid = checkUid('U' + gv.utils.string2ascii(gv.utils.hexnum(uid)).join(''), val.key);
    if (!valMap[val.uid]) valMap[val.uid] = [];
    valMap[val.uid].push(val)
    val.child_one.map((it, idx) => {
      if (it) {
        parse(it, deep + 1, [...deeps, 'one', idx], val);
      }
    });
    val.child_two.map((it, idx) => {
      if (it) {
        parse(it, deep + 1, [...deeps, 'two', idx], val);
      }
    });
    return (key) => {
      if (!key) return val;
      return valMap[key];
    }
  }
})();

exports.parse = function(str) {
  if (!str) str = gv.config.immucfg.globalText3;
  const r2mka_len = 'r2mka'.length;
  const flag = str.charAt(r2mka_len) === '1';
  const gt = gtHandler(str, r2mka_len + 1);
  function deepParse() {
    const ans = {
      lens: gt.getCode(), // 当isReset为否时或者循环开始入口，设置入参数组的长度
      isReset: gt.getCode(), // 标志位，标记是否重置循环参数
      taskstr: gt.getLine(), // 循环的下标取值来源
    }
    let curr = gt.getCode();
    ans.child_one = new Array(curr + 2);
    for (let i = 0; i < curr; i++) {
      ans.child_one[i + 2] = deepParse();
    }
    curr = gt.getCode();
    ans.child_two = new Array(curr);
    for (let i = 0; i < curr; i++) {
      ans.child_two[i] = deepParse();
    }
    return ans;
  }
  gt.getList().concat(gt.getList()); // 未发现用处
  const windowIdx = gt.getCode(); // 首次循环入参配置，window变量存储下标
  const resourceIdx = gt.getCode(); // 首次循环如参配置，资源变量存储下标
  return parse(deepParse());
};

exports.init = function(r2mkaText) {
  gv._setAttr('r2mka', exports.parse(r2mkaText || gv.config.immucfg.globalText3));
  logger.debug('头r2mka标识字符串完成解析!')
}
