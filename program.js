const program = require('commander')
const Manager = require('./manager')

class Program {
  constructor() {
    this.init = this.init.bind(this)
  }

  init() {
    //定义参数,以及参数内容的描述
    program
        .version('0.0.1')
        .usage('[options] [value ...]')
        .option('-n, --namespace <string>', 'namespace')
        .option('-a, --access <string>', 'access-key')
        .option('-s, --secret <string>', 'secret-key')
        .option('-e, --env <string>', 'environment')
    //解析commandline arguments
    program.parse(process.argv)
    const { env, namespace,access,secret } = program
    if (!access) throw Error('必须输入access-key')
    if (!secret) throw Error('必须输入secret-key')
    Manager.init(access, secret)
    if (!namespace) throw Error('必须输入上传空间')
    if (!env) throw Error('必须输入上传环境')
    this.remoteDir = namespace + '/'
    this.env = env
  }
}

module.exports = new Program()
