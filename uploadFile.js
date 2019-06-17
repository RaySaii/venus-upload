const getFileMime = require('./getFileMime')
const qiniu = require('qiniu')
const Manager = require('./manager')
const Program = require('./program')

function uploadFile(filePath, bucket,remoteDir) {
  const KEY = remoteDir + filePath.split(Program.localDir+'/')[1]
  const LOCAL_FILE = './' + filePath
  const scope = `${bucket}:${KEY}`
  const PutPolicy = new qiniu.rs.PutPolicy({ scope, MimeType: 0 })
  const UPLOAD_TOKEN = PutPolicy.uploadToken(Manager.Mac)

  return new Promise((resolve, reject) => {
    Manager.FormUploader.putFile(UPLOAD_TOKEN, KEY, LOCAL_FILE, Manager.PutExtra, function (respErr, respBody, respInfo) {

      if (respErr) {
        throw respErr
      }
      if (respInfo.statusCode == 200) {
        const type = getFileMime(KEY)
        Manager.BucketManager.changeMime(bucket, KEY, type, function (err, respBody, respInfo) {
          if (err) {
            console.log(err)
            //throw err;
          } else {
            //200 is success
            // console.log(respInfo.statusCode);
            console.log('上传成功', KEY, '-', type)
            resolve()
          }
        })
      } else {
        // console.log(respInfo.statusCode)
        // console.log(respBody)
        console.log('上传失败', KEY, respBody.error)
        reject()
      }
    })
  })
}

module.exports = uploadFile
