const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const getHelpCode = (command) => {
  return [
    '```bash',
    `$ npx rs-reverse ${command}`,
    execSync(`node main.js ${command}`, { encoding: 'utf8' }).trim().replace('main.js', 'rs-reverse'),
    '```',
  ].join('\n');
}

const helpMap = {
  makecodeHelp: getHelpCode('makecode -h'),
  makecodeHighHelp: getHelpCode('makecode-high -h'),
  makecookieHelp: getHelpCode('makecookie -h'),
  execHelp: getHelpCode('exec -h'),
  execExample: [
    getHelpCode("exec -m 2 -c '+ascii2string(gv.keys[21])'"),
    getHelpCode("exec -m 3 -c '+ascii2string(gv.keys[21])'"),
  ].join('\n\n'),
  makecodeExample: [
    getHelpCode('makecode -m 2'),
    getHelpCode('makecode -u http://epub.cnipa.gov.cn/'),
  ].join('\n\n'),
  makecodeHighExample: [
    getHelpCode('makecode-high -u http://epub.cnipa.gov.cn/'),
  ].join('\n'),
  makecookieExample: [
    getHelpCode('makecookie -m 2'),
    getHelpCode('makecookie -u http://epub.cnipa.gov.cn/'),
  ].join('\n\n'),
}

const template = fs.readFileSync(path.resolve(__dirname, '../README.template.md'), 'utf8');

const newReadme = Object.entries(helpMap).reduce((ans, [key, text]) => ans.replace(`<!-- ${key} -->`, text), template);

fs.writeFileSync(path.resolve(__dirname, '../README.md'), newReadme, 'utf8');
