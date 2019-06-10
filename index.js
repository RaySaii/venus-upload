#!/usr/bin/env node

const qiniu = require('qiniu')
const program = require('commander')
const path = require('path')
const fs = require('fs')

function initProgram() {
  //定义参数,以及参数内容的描述
  program
      .version('0.0.1')
      .usage('[options] [value ...]')
      .option('-n, --namespace <string>', 'namespace')
      .option('-e, --env <string>', 'environment')
  //解析commandline arguments
  program.parse(process.argv)
  const { namespace, env } = program
  if (!namespace) throw Error('必须输入命名空间')
  if (!env) throw Error('必须输入上传环境')
  return { namespace, env }
}

function initUploader() {
  //自己七牛云的秘钥
  const ACCESS_KEY = 'UOVklBxmPD2ypU5BVM8SLLo6f7yKYfgFYcwWb0d-'
  const SECRET_KEY = 'Avq7_BhxAZ8fRwnIHvupCFkFO0AuGzGDCvvSH_C7'
  const Mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY)
  const Config = new qiniu.conf.Config()
  // 空间对应的机房，zone_z1代表华北，其他配置参见七牛云文档
  Config.zone = qiniu.zone.Zone_z0
  // 是否使用https域名
  //config.useHttpsDomain = true;
  // 上传是否使用cdn加速
  //config.useCdnDomain = true;
  const FormUploader = new qiniu.form_up.FormUploader(Config)
  const PutExtra = new qiniu.form_up.PutExtra()
  return { FormUploader, PutExtra, Mac }
}

function upload(filePath, { RemoteDir, FormUploader, PutExtra, Mac }) {
  //RemoteDir这里是空间里的文件前缀
  const KEY = RemoteDir + filePath.split('dist/')[1]
  const LOCAL_FILE = './' + filePath
  const BUCKET = `melly:${KEY}`
  const PutPolicy = new qiniu.rs.PutPolicy({ scope: BUCKET, MimeType: 0 })
  const uploadToken = PutPolicy.uploadToken(Mac)

  FormUploader.putFile(uploadToken, KEY, LOCAL_FILE, PutExtra, function (respErr, respBody, respInfo) {
    if (respErr) {
      throw respErr
    }
    if (respInfo.statusCode == 200) {
      console.log(respBody)
    } else {
      console.log(respInfo.statusCode)
      console.log(respBody)
      if (respBody.error) {
        console.log(respBody.error)
      }
    }
  })
}

//遍历文件夹
function ergodicAndUpload(filePath, { RemoteDir, FormUploader, PutExtra, Mac }) {


  function ergodic(_filePath) {
    //转换为绝对路径
    fs.stat(_filePath, function (err, stats) {
      //如果是目录的话，遍历目录下的文件信息
      if (stats.isDirectory()) {
        fs.readdir(_filePath, function (err, list) {
          list.forEach((item) => {
            //遍历之后递归调用查看文件函数
            //遍历目录得到的文件名称是不含路径的，需要将前面的绝对路径拼接
            const absolutePath = path.join(_filePath, item)
            //var absolutePath = path.resolve(path.join(param, e));
            ergodic(absolutePath)
          })
        })
      } else {
        upload(_filePath, { RemoteDir, FormUploader, PutExtra, Mac })
      }
    })
  }

  ergodic(filePath)

}

function main() {
  const { FormUploader, PutExtra, Mac } = initUploader()
  const { namespace, env } = initProgram()
  const RemoteDir = `${namespace}/${env}/`
  ergodicAndUpload('./dist', { RemoteDir, FormUploader, PutExtra, Mac })
}

main()
