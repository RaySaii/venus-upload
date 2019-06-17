#!/usr/bin/env node

const ergodic = require('./ergodic')
const ergodicRemote = require('./ergodicRemote')
const uploadFile = require('./uploadFile')
const deleteRemoteFile = require('./deleteRemoteFile')
const copyRemoteToRelease = require('./copyRemoteToRelease')
const Program = require('./program')
const Manager = require('./manager')

Program.init()
Manager.init(Program.access_key, Program.secret_key)

async function main() {

  const config = require('./config')

  if (Program.env == 'release') {
    const fileList = await ergodicRemote(config.copyFromBucket, Program.remoteDir)
    await Promise.all(fileList.map(file => copyRemoteToRelease(config.copyFromBucket, file.key, config.BUCKET)))
    console.log()
    console.log('共拷贝', fileList.length, '个文件')
    return
  }

  const fileList = await ergodicRemote(config.BUCKET, Program.remoteDir)
  console.log()
  console.log(`======== 删除 ${config.BUCKET} 下文件 =========`)
  console.log()
  await Promise.all(fileList.map(file => deleteRemoteFile(config.BUCKET, file.key)))
  console.log()
  console.log('共删除', fileList.length, '个文件')
  console.log()
  console.log(`======== 开始上传 -> ${config.BUCKET} =========`)
  console.log()
  const localFileList = ergodic(Program.localDir)
  await Promise.all(localFileList.map(filePath => uploadFile(filePath, config.BUCKET, Program.remoteDir)))
  console.log()
  console.log('共上传', localFileList.length, '个文件')

}

main()




