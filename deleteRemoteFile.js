const Manager = require('./manager')

function deleteRemoteFile(bucket,key) {
  return new Promise((resolve, reject) => {
    Manager.BucketManager.delete(bucket, key, function (err, respBody, respInfo) {
      if (err) {
        console.log('删除远程文件成功失败:', key, err)
        reject()
      } else {
        // console.log(respInfo.statusCode)
        console.log('删除远程文件成功:', key)
        resolve()
      }
    })
  })
}

module.exports = deleteRemoteFile
