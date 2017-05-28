
var co = require('co')
var path = require('path')
var fs = require('fs')
var request = require('request')
var _ = require('lodash')
var cloneDeep = require('clone-deep')
var util = require('./util')

let pwd = process.cwd()

function* upload (wepConfig) {
  return co(function* () {
    if (!wepConfig.upload) {
      throw new Error('no upload on wepConfig')
    }
    let defaultOptions = wepConfig.upload.options || {};
    let files = wepConfig.upload.files || [];
    let rets = [];
    for (let item of files) {
      let tmpOptions = {};
      item.options = item.options || {};
      item.options = _.merge({}, defaultOptions, item.options)
      
      item.src = item.src || []
      item.src = item.src.map(function (name) {
        return util.getCfgVal(wepConfig.envcfg, name)
      })
      item.remoteDir = util.getCfgVal(wepConfig.envcfg, item.remoteDir)
      // console.log('uploadItem: ', item);
      for (let name of item.src) {
        let srcItem = {name: name, remoteDir: item.remoteDir, options: cloneDeep(item.options)}
        // console.log('upload srcItem: ', srcItem);
        rets.push(yield uploadSingle(srcItem))
      }
    }

    return rets;
  })
}

function* uploadSingle (srcItem) {
  return new Promise(function (resolve, reject) {
    let filepath = path.resolve(pwd, srcItem.name);
    if (!fs.existsSync(filepath)) {
      reject(new Error('文件不存在 ' + srcItem.name));
      return;
    }
    let query = getParams(srcItem);
    let uploadOpt = {
      
      method: 'post',
      qs: query,
      formData: {
        name: query.filename,
        filedatas: fs.createReadStream(filepath)
      },
      timeout: 6000,
    };
    _.merge(uploadOpt, srcItem.options);
    console.log('uploading ' + path.basename(filepath) + ' ...');
    // console.log('uploadOpt: ', uploadOpt)
    
    request(uploadOpt, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        if (info.errcode === 0) {
          resolve()
        } else {
          reject(new Error(info.errmsg))
        }
      } else {
        reject(new Error(error ? error.message : '上传发生错误'))
      }
    })
  });
}

function getParams (srcItem) {
  let filepath = path.resolve(pwd, srcItem.name)
  let extName = path.extname(filepath);
  let stats = fs.statSync(filepath)
 
  let query = {
    filename: path.basename(filepath, extName),
    filetype: extName,
    filesize: stats.size,
  };
  if (query.filetype && query.filetype.indexOf('.') === 0) {
    query.filetype = query.filetype.slice(1)
  }
  return query;
}

module.exports = upload;
