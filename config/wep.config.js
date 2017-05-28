

module.exports = {

  envs: {
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
    dist: {
      src: [{
        file: './dist/app.js',
        name: 'xxoo/app.js',
        pattern: '**/*',
        cwd: './dist/'
      }, {
        pattern: '**/*',
        cwd: './node_modules/async/'
      }]
    },

    dist2: {
      src: [{
        pattern: '**/*',
        cwd: './node_modules/request/'
      }]
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
          qs: {isunzip: 1},
          headers: {},
        },
        src: ['./tmp/dist.zip', './tmp/dist2.zip'],
        remoteDir: '/wenzhen/pre'
      },
      {
        options: {
          url: 'http://wechat.anchel.cn/upload/uploadimg',
        },
        src: ['./dist/app.js'],
        remoteDir: '/wenzhen/pre'
      }
    ]
  }

}