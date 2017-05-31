
let wep = require('wep');

wep.init({

  env: {
    liugong_pre: {
      cdn: {
        userDir: '/wenzhen/pre',
        doctorDir: '/wenzhen_doctor/pre'
      }
    },
    liugong: {
      cdn: {
        userDir: '/wenzhen'
      }
    }
  },

  zip: {
    options: {

    },
    files: {
      dist: {
        src: [{
          file: './config/wep.config.js',
          name: 'xxoo/config.js',
        }, {
          pattern: '**/*',
          cwd: './node_modules/async/'
        }],
        dest: './tmp'
      },

      dist2: {
        src: [{
          pattern: '**/*',
          cwd: './node_modules/request/'
        }],
        dest: './tmp'
      }
    }
  },

  upload: {
    options: {
      // url: 'http://inner.up.cdn.qq.com:8080/uploadServer/singleUpload.jsp',
      qs: {
        appName: 'hospital_img',
      },
      headers: {
        'x-xxx': 'sfds'
      },
    },
    files: [
      {
        options: {
          url: 'http://wechat.anchel.cn/upload/uploadimg',
          qs: { isunzip: 1 },
          headers: {},
        },
        src: ['./tmp/dist.zip', './tmp/dist2.zip'],
      },
      {
        options: {
          url: 'http://wechat.anchel.cn/upload/uploadimg',
        },
        src: ['./dist/app.js'],
      }
    ]
  }

});