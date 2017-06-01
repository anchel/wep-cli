
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
            cwd: './lib/'
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
        url: 'www.anchel.cn',
        qs: {
          appname: 'hospital_img',
          // user: 'ancheltong',
        },
        headers: {
          
        }
      },
      files: [
        {
          src: ['./README.md'],
          dest: '/wenzhen/ancheldev/doctor/xxoo/bb'
        },
        {
          options: {
            qs: { isunzip: 1 },
            headers: {},
          },
          src: ['./tmp/dist.zip', {pattern: './lib/**/*.js'}, './tmp/dist2.zip'],
          dest: '/wenzhen/ancheldev/doctor/xxoo/${envcfg.cdn.userDir}bb'
        },
      ]
    }

  });

  wep.loadDefaultTask(['env', 'zip', 'upload']);

  wep.registerTask('default', ['env', 'zip', 'upload'])
};
