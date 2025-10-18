**开源兄弟项目(补环境框架sdenv)：[sdenv](https://github.com/pysunday/sdenv)**

## 0. 声明

该项目下代码仅用于个人学习、研究或欣赏。通过使用该仓库相关代码产生的风险与仓库代码作者无关！

该项目的研究网站仅做参考，项目不鼓励直接请求该研究网站，算法逆向研究请直接使用`example`目录下的样例文件，如：`node main.js makecookie -m 3`，其中3表示用例3的外层虚拟机代码文件+ts文件。

## 1. 博客文章

1. [瑞数vmp-代码格式化后无法正常运行原因分析](https://blog.howduudu.tech/article/420dc80bfb66280ddbb93d87864cadd1/)
2. [瑞数vmp-动态代码生成原理](https://blog.howduudu.tech/article/95f60638eaa0647bcf327fb4f2c2887c/)
3. [补环境-document.all的c++方案1](https://blog.howduudu.tech/article/00bb5f4a997c39858e25fa962e8cd5b8/)
4. [补环境-document.all的c++方案2](https://blog.howduudu.tech/article/de942bdea377f7f3ce6878fc04a8c76c/)

## 2. 瑞数算法还原

**`npx rs-reverse *`与在当前目录下运行`node main.js *`相对应, 当然也支持npm全局安装(`npm install -g rs-reverse`)，npm全局安装后也可以直接使用命令`rs-reverse`**

如npx运行的包不是最新的，可以加上-p参数后执行如：`npx -p rs-reverse@latest rs-reverse makecookie`，非官方源可能存在版本不同步问题，建议拉取时使用官方源：`--registry=https://registry.npmjs.org`。

### 2.1. makecode子命令

执行子命令`makecode`生成动态代码, 可以传入包含`$_ts.nsd`和`$_ts.cd`的文本文件或者直接给url让程序自己去拿，命令示例:

1. npx方式：`npx rs-reverse makecode`
2. 文件方式：`node main.js makecode`

**命令后不接参数则从example文件中取**

```bash
$ npx rs-reverse makecode -h
rs-reverse makecode

根据传入的ts文件、网站地址、js文件地址等，生成全量ts文本、静态文本、内外层虚拟机
代码等文件

Options:
  -h             显示帮助信息                                          [boolean]
  -f, --file     含有nsd, cd值的json文件                                [string]
  -j, --jsurls   瑞数加密的js文件链接或者本地js文件路径                  [array]
  -u, --url      瑞数返回204状态码的请求地址                            [string]
  -o, --output   输出文件目录                     [string] [default: "./output"]
  -l, --level    日志打印等级，参考log4js，默认为warn                   [string]
  -v, --version  显示版本号                                            [boolean]

Examples:
  main.js makecode
  main.js makecode -f /path/to/ts.json
  main.js makecode -u https://url/index.html
  main.js makecode -u https://url/index.html -f /path/to/ts.json
  main.js makecode -j https://url/main.js -f /path/to/ts.json
  main.js makecode -j /path/to/main.js -f /path/to/ts.json
```

调用示例：

```bash
$ npx rs-reverse makecode
代码还原成功！用时：20ms

  原始$_ts：output/makecode/ts.json
  外层虚拟机生成的$_ts：output/makecode/ts-full.json
  静态文本：output/makecode/immucfg.json
  内层虚拟机代码：output/makecode/dynamic.js
```

```bash
$ npx rs-reverse makecode -u http://epub.cnipa.gov.cn/
代码还原成功！用时：20ms

  原始$_ts：output/makecode/ts.json
  外层虚拟机生成的$_ts：output/makecode/ts-full.json
  静态文本：output/makecode/immucfg.json
  html代码：output/makecode/index.html
  外层虚拟机代码：output/makecode/2h9AIDg9eZgY.b4c45da.js
  内层虚拟机代码：output/makecode/2h9AIDg9eZgY.b4c45da-dynamic.js
```

```bash
$ npx rs-reverse makecode -j ./example/codes/main.js -f ./example/codes/\$_ts.json
代码还原成功！用时：21ms

  原始$_ts：output/makecode/ts.json
  外层虚拟机生成的$_ts：output/makecode/ts-full.json
  静态文本：output/makecode/immucfg.json
  外层虚拟机代码：output/makecode/rs-reverse
  内层虚拟机代码：output/makecode/main-dynamic.js
```

### 2.2. makecookie子命令

执行子命令`makecookie`生成cookie, 调用方式与`makecode`类型，调用示例：

1. npx方式：`npx rs-reverse makecookie`
2. 文件方式：`node main.js makecookie`

该命令首先会执行`makecode`子命令拿到完整的`$_ts`值，再运行`makecookie`的还原算法生成cookie。

```bash
$ npx rs-reverse makecookie -h
rs-reverse makecookie

生成cookie字符串，包含后台返回+程序生成，可直接复制使用

Options:
  -h             显示帮助信息                                          [boolean]
  -f, --file     含有nsd, cd值的json文件                                [string]
  -j, --jsurls   瑞数加密的js文件链接或者本地js文件路径                  [array]
  -u, --url      瑞数返回204状态码的请求地址                            [string]
  -o, --output   输出文件目录                     [string] [default: "./output"]
  -l, --level    日志打印等级，参考log4js，默认为warn                   [string]
  -c, --config   配置对象，传入对象或者json文件路径                     [string]
  -v, --version  显示版本号                                            [boolean]

Examples:
  main.js makecookie
  main.js makecookie -f /path/to/ts.json
  main.js makecookie -u https://url/index.html
  main.js makecookie -u https://url/index.html -f /path/to/ts.json
  main.js makecookie -j https://url/main.js -f /path/to/ts.json
  main.js makecookie -j /path/to/main.js -f /path/to/ts.json
```

调用示例：

```bash
$ npx rs-reverse makecookie
成功生成cookie（长度：257），用时：452ms
cookie值: NOh8RTWx6K2dT=0ZK_YwqARCOV48f5MytP.z2lBEFTw4HA13MXbR1GTiAUYKjBNDvplDJHvHqEqZokbTH0GOFnJBK_gTUtPFlSCO6ZR_rxAoJ_bIdun2bwWVY2fIjtRdrMmP5_nRKtY31ssUOdpY32p.1p_8.jtXg.5_K3rXsxFni2_FWPY3KfSllqfBfinkSC_fGXWCS5QaXcHQ_B_xFWDU1mKRjnubcWpLuA92kRI.WQtkqdCqJws1eMyEEUO_Tq.jKWsJw4jqYIt
```

```bash
$ npx rs-reverse makecookie -u http://epub.cnipa.gov.cn/
存在meta-content值：piJeXiBbMVwSY.RzK9PuCXlYX3q2tMGVa6sK8TDCr1ofMwpuOFpDMQC6XwnyM6_u
解析结果：/

成功生成cookie（长度：257），用时：468ms
cookie值: NOh8RTWx6K2dT=0fn94RGsF4csEJdjKSQGglp7JJsyygxwX41K3EN_8zAy_Vkb39b52CguVfp.c2oCjG0ClJmn44AUJiyeDDxXOPZTNArQL7dIEUjZY6dm90PLrWbctdKh_C7S7EAENxP5mRM0dEYPzPkP3Gn31Ks_AetjfB.iTcRU08r1BQlwDApsCw82GPa2OYxRQS1gHnLFuoPv4Q5o4GCzEP2ovC_exBd9EiqvhnT1JDwPGdszC8pB1DVNV4KwxPZIq1XQTIgrC;NOh8RTWx6K2dS=60huPIhB3g0NtcdtIXWnZKOWO3XOt_iJI91EVnlh4q4laQIEWadqUFW7Fx2UGZn.0S3aapmdRGIKrIRKdH5RlaoA;WEB=20111132
```

```bash
$ npx rs-reverse makecookie -j ./example/codes/main.js -f ./example/codes/\$_ts.json
成功生成cookie（长度：257），用时：452ms
cookie值: NOh8RTWx6K2dT=03VUWCfzYo6zqFXp0ppbAHJwSF8HPhEhez9zocfuWCrpMrXQHBtMkeG6RfTzXkbqlZ0u05FsBDVo0aOQadHzYTH010D5LxGF6QDtAeSHfTcv.M5UTbviUDkqBq0tw6ndDbDazZvPmrtcqrVpwniKHi7qtJPdnbP_DhUJk_uI6sZEwscsic2JtznhgGjIUao_8g0O4ZyH1U8wf7wb27WWZZtLTcu2IvPIYgjpb2XGoiRscXvvCKIXY5O_N.0ljExzG
```

### 2.3. makecode-high子命令

执行子命令`makecode-high`生成网站代码，解码两次请求返回的网站代码(功能涵盖makecode子命令)，调用示例：

1. npx方式：`npx rs-reverse makecode-high -u url`
2. 文件方式：`node main.js makecode-high -u url`

该命令第一次请求生成cookie带入第二次请求，将两次请求返回的加密代码及动态代码解码后保存到`output/makecode-high`目录中，和makecode命令区别为该命令只提供-u方式执行!

需要注意的是，请避免连续执行该命令以免触发风控报错，报错如：

![makecode-high风控报错](./static/error-makecode-high.png)

```bash
$ npx rs-reverse makecode-high -h
rs-reverse makecode-high

接收网站地址，生成两次请求对应的全量ts文本、静态文本、内外层虚拟机代码等文件

Options:
  -h             显示帮助信息                                          [boolean]
  -m
  -u, --url      瑞数返回204状态码的请求地址                 [string] [required]
  -o, --output   输出文件目录                     [string] [default: "./output"]
  -l, --level    日志打印等级，参考log4js，默认为warn                   [string]
  -v, --version  显示版本号                                            [boolean]

Examples:
  main.js makecode-high -u https://url/index.html
```

调用示例：

```bash
$ npx rs-reverse makecode-high -u https://zhaopin.sgcc.com.cn/sgcchr/static/home.html
代码还原成功！用时：600ms

  
第1次请求保存文件：

  原始$_ts：output/makecode-high/first/ts.json
  静态文本：output/makecode-high/first/immucfg.json
  外层虚拟机生成的$_ts：output/makecode-high/first/ts-full.json
  html代码：output/makecode-high/first/home.html
  外层虚拟机代码：output/makecode-high/first/xJahSVSLf92v.d07207d.js
  内层虚拟机代码：output/makecode-high/first/xJahSVSLf92v.d07207d-dynamic.js
  
第2次请求保存文件：

  原始$_ts：output/makecode-high/second/ts.json
  静态文本：output/makecode-high/second/immucfg.json
  外层虚拟机生成的$_ts：output/makecode-high/second/ts-full.json
  html代码：output/makecode-high/second/home.html
  外层虚拟机代码：output/makecode-high/second/acRLbC1q9RHN.d07207d.js
  内层虚拟机代码：output/makecode-high/second/acRLbC1q9RHN.d07207d-dynamic.js
```

### 2.4. exec子命令

exec子命令用于开发中或者演示时使用。命令示例：

1. npx方式：`npx rs-reverse exec -c 'gv.cp2'`
2. 文件方式：`node main.js exec -c 'gv.cp2'`

```bash
$ npx rs-reverse exec -h
rs-reverse exec

直接运行代码，用于开发及演示时使用

Options:
  -h                  显示帮助信息                                     [boolean]
  -f, --file, --file  含有nsd, cd值的json文件                           [string]
  -j, --jsurls        瑞数加密的js文件链接或者本地js文件路径             [array]
  -l, --level         日志打印等级，参考log4js，默认为warn              [string]
  -c, --code          要运行的代码，如：gv.cp2，即打印cp2的值[string] [required]
  -v, --version       显示版本号                                       [boolean]

Examples:
  main.js exec -f /path/to/ts.json -c gv.cp0
```

调用示例：

```bash
$ npx rs-reverse exec -c '+ascii2string(gv.keys[21])'
输入：+ascii2string(gv.keys[21])
  输出：1757038222
```

```bash
$ npx rs-reverse exec -c '+ascii2string(gv.keys[21])' -j ./example/codes/main.js -f ./example/codes/\$_ts.json
输入：+ascii2string(gv.keys[21])
  输出：1757038222
```

## 3. 其它

### 3.1. 网站适配情况

从[Issues:瑞数vmp网站征集](https://github.com/pysunday/rs-reverse/issues/1)中获取。

名称 | makecode | makecookie | makecode-high | 是否逆向验证
---- | -------- | ---------- | ------------- | --------------
[epub.cnipa.gov.cn](http://epub.cnipa.gov.cn) | 👌 | 👌 | 👌 | Y
[zhaopin.sgcc.com.cn](https://zhaopin.sgcc.com.cn/sgcchr/static/home.html) | 👌 | 👌 | 👌 | Y

## 4. 技术交流

加作者微信进技术交流群: `howduudu_tech`(备注rs-reverse)

订阅号不定时发表版本动态及技术文章：码功

<img src="https://github.com/pysunday/sdenv/raw/main/static/qrcode.png" alt="订阅号：码功" width="320">
