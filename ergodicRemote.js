const Manager = require('./manager')

let fileList=[]



function ergodicRemote(bucket,remoteDir) {

  function ergodic(marker = {}) {
    // options 列举操作的可选参数
    // - prefix    列举的文件前缀
    // - marker    上一次列举返回的位置标记，作为本次列举的起点信息
    // - limit     每次返回的最大列举文件数量
    // - delimiter 指定目录分隔符
    const options = {
      limit: 10,
      prefix: remoteDir,
      ...marker,
    }
    return new Promise((resolve, reject) => {
      Manager.BucketManager.listPrefix(bucket, options,  function (err, respBody, respInfo) {
        if (err) {
          console.log(err)
          throw err
        }
        if (respInfo.statusCode == 200) {
          const items = respBody.items
          let count = items.length == 0
          if (count) {
            console.log(remoteDir, '远程目录下文件为空')
          }
          fileList=fileList.concat(items)
          resolve(respBody)
        } else {
          console.log(respInfo.statusCode)
          console.log(respBody)
          reject()
        }
      })
    }).then(res=>{
      if (res.marker) {
        return ergodic({ marker: res.marker })
      }
      return fileList
    })
  }

  return ergodic()

}

module.exports = ergodicRemote
