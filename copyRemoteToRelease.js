const Manager = require('./manager')

function copyRemoteToRelease(srcBucket,srcKey,targetBucket) {
  // 强制覆盖已有同名文件
  const options = {
    force: true,
  }
  return new Promise((resolve, reject) => {
    Manager.BucketManager.copy(srcBucket, srcKey, targetBucket, srcKey, options, function (
        err, respBody, respInfo) {
      if (err) {
        console.log(err)
        //throw err;
        console.log('拷贝远程文件失败:',srcBucket,'->',targetBucket,':',srcKey)
        reject()
      } else {
        //200 is success
        // console.log(respInfo.statusCode)
        // console.log(respBody)
        console.log('拷贝远程文件成功:',srcBucket,'->',targetBucket,':',srcKey)
        resolve()
      }
    })
  })
}
module.exports=copyRemoteToRelease
