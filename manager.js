const qiniu = require('qiniu')

class Manager {

  constructor() {
    this.init = this.init.bind(this)
  }

  init(accessKey, secretKey) {
    this.Mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    this.Config = new qiniu.conf.Config()
    // 空间对应的机房，zone_z1代表华北，其他配置参见七牛云文档
    this.Config.zone = qiniu.zone.Zone_z0
    this.FormUploader = new qiniu.form_up.FormUploader(this.Config)
    this.PutExtra = new qiniu.form_up.PutExtra()
    this.BucketManager = new qiniu.rs.BucketManager(this.Mac, this.Config)
  }
}

module.exports = new Manager()
