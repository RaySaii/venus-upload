function getFileMime(KEY) {
  //文件类型对应的 mimetype
  const MAP = {
    '.map':'application/x-navimap',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.ico': 'image/vnd.microsoft.icon',
    '.svg': 'image/svg+xml',
    '.html': 'text/html',
  }
  let key = Object.keys(MAP).find(key => KEY.endsWith(key))
  return  MAP[key] || 0
}

module.exports=getFileMime
