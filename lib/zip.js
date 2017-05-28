
var os = require('os');
var path = require('path');
var fs = require('fs');
var ora = require('ora');
var _ = require('lodash');
var co = require('co');
var moment = require('moment');
var zipDir = require('zip-dir');
var rimraf = require('rimraf');
var archiver = require('archiver');
var cloneDeep = require('clone-deep');
var mkdirpromise = require('mkdir-promise');
var util = require('./util');

let pwd = process.cwd();


function* zip(wepConfig) {
  return co(function* () {
    if (!wepConfig.zip) {
      throw new Error('no zip on wepConfig')
    }
    let zips = cloneDeep(wepConfig.zip);
    if (!Array.isArray(wepConfig.zip)) {
      let arr = [];
      _.each(zips, function (item, key) {
        let _o = { name: key };
        Object.assign(_o, item)
        arr.push(_o)
      })
      zips = arr;
    }
    // console.log('zips', JSON.stringify(zips, '', 2));
    let rets = [];
    for (let zipItem of zips) {
      let singleRet = yield singleZip(zipItem, wepConfig);
      rets.push(singleRet)
    }
    return rets;
  })
}

/**
 * @param {*} zipItem 
 * {
 *  name: '',
 *  src: [{
 *    file: '',
 *    name: '',
 *    pattern: '',
 *    cwd: ''
 *  }]
 * }
 */
function* singleZip(zipItem, wepConfig) {
  return co(function* () {
    let destzippath = yield getDestZipPath(zipItem.name);
    zipItem.destzippath = destzippath;
    if (fs.existsSync(destzippath)) {
      rimraf.sync(destzippath);
    }
    console.log(`zip ${zipItem.name} ...`)
    return new Promise(function (resolve, reject) {
      if (!Array.isArray(zipItem.src)) {
        reject(new Error('src should be an array'))
        return;
      }

      var archive = archiver('zip', {
        store: true // Sets the compression method to STORE. 
      });

      var fileOutput = fs.createWriteStream(destzippath);

      fileOutput.on('close', function () {
        resolve(zipItem);
      });

      fileOutput.on('error', function (err) {
        reject(err);
      });

      zipItem.src.forEach(function (srcItem) {
        srcItem.file = util.getCfgVal(wepConfig.envcfg, srcItem.file)
        srcItem.name = util.getCfgVal(wepConfig.envcfg, srcItem.name)
        srcItem.cwd = util.getCfgVal(wepConfig.envcfg, srcItem.cwd)
        if (srcItem.file) {
          // append a file from stream
          let filePath = path.resolve(pwd, srcItem.file)
          let filename = srcItem.name || path.basename(filePath);

          archive.append(fs.createReadStream(filePath), { name: filename });

        } else if (srcItem.pattern) {
          let options = {};
          if (srcItem.cwd) {
            Object.assign(options, { cwd: srcItem.cwd });
          }
          // append files from a glob pattern
          archive.glob(srcItem.pattern, options);
        }
      })
      archive.pipe(fileOutput);

      archive.on('error', function (err) {
        reject(err)
      });
      archive.finalize();
    })
  });
}

function* getDestZipPath(name) {
  return co(function* () {
    let tmpdir = pwd || os.tmpdir();
    let destdir = path.join(tmpdir, 'tmp');
    if (!fs.existsSync(destdir)) {
      yield mkdirpromise(destdir);
    }
    return path.join(destdir, name + '.zip')
  })
}

module.exports = zip;