const path = require('path')
const fs = require('fs')

let fileList = []

function ergodic(filePath) {
  //转换为绝对路径
  let stats = fs.statSync(filePath)
  //如果是目录的话，遍历目录下的文件信息
  if (stats.isDirectory()) {
    const list = fs.readdirSync(filePath)
    list.forEach((item) => {
      //遍历之后递归调用查看文件函数
      //遍历目录得到的文件名称是不含路径的，需要将前面的绝对路径拼接
      const absolutePath = path.join(filePath, item)
      //var absolutePath = path.resolve(path.join(param, e));
      ergodic(absolutePath)
    })
  } else {
    fileList.push(filePath)
  }
  return fileList
}

module.exports = ergodic
