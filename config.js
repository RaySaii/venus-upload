const Program = require('./program')

module.exports = function () {
  let config = {
    qa: {
      BUCKET: 'meilly-h5-qa',
    },
    qb: {
      BUCKET: 'meilly-h5-qb',
    },
  }
  Object.assign(config, {
    release: {
      BUCKET: 'meilly-h5',
      copyFromBucket: config.qa.BUCKET,
    },
  })
  return config[Program.env]
}()
