
module.exports = function (wep) {

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
            file: './package.json',
            name: 'xxoo/config.json',
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
        url: 'http://inner.up.cdn.qq.com:8080/uploadserver/uploadfile.jsp',
        qs: {
          appname: 'hospital_img',
          user: 'ancheltong',
        },
        headers: {
          'X-CDN-Authentication': 'EB2522599A6CBAF6DC4450BC7FA1AAF7'
        },
        // proxy: 'http://127.0.0.1:8888'
      },
      files: [
        {
          src: ['./README.md'],
          dest: '/wenzhen/ancheldev/doctor/xxoo/aa'
        },
        {
          options: {
            qs: { isunzip: 1 },
            headers: {},
          },
          src: ['./tmp/dist.zip', './tmp/dist2.zip'],
          dest: '/wenzhen/ancheldev/doctor/xxoo'
        },
      ]
    }

  });

  wep.loadDefaultTask(['env', 'zip', 'upload']);

  wep.registerTask('default', ['env', 'zip', 'upload'])
};
