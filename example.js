// This Gruntfile automates different tasks for front-end development
// Type "grunt" to see a list of commands

module.exports = function (grunt) {

var inlineCss = require("inline-css");
var userConfig = require("./build.config.js");
var appConfig = grunt.file.readJSON("package.json");

// Load grunt tasks automatically
// see: https://github.com/sindresorhus/load-grunt-tasks

require("load-grunt-tasks")(grunt);

var taskConfig = {
    pkg: appConfig,
    meta: {
      banner:
        "/**\n" +
        " * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today(\"yyyy-mm-dd\") %>\n" +
        " * <%= pkg.homepage %>\n" +
        " *\n" +
        " * Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author %>\n" +
        " */\n"
    },

// Increments the version number, etc.
    bump: {
      options: {
        files: [
          "package.json",
          "bower.json"
        ],
        commit: true,
        commitMessage: "(Release): Bump v%VERSION%",
        commitFiles: [
          "package.json",
          "bower.json"
        ],
        createTag: true,
        tagName: "v%VERSION%",
        tagMessage: "Version %VERSION%",
        push: false,
        pushTo: "origin"
      }
    },

// The directories to delete when `grunt clean` is executed.

    clean: {
      build: [ "<%= build_dir %>", "<%= compile_dir %>"],
      email: [ "email/build/", "email/dist/"]
    },

// The `copy` task just copies files from A to B. We use it here to copy
// our project assets (images, fonts, etc.) and javascripts into
// `build_dir`, and then to copy the assets to `compile_dir`.

    copy: {
      build_app_assets: {
        files: [
          {
            src: [ "**" ],
            dest: "<%= build_dir %>/assets/",
            cwd: "<%= src_dir %>/assets/",
            expand: true
          }
       ]
      },
      build_vendor_assets: {
        files: [
          {
            src: [ "<%= vendor_files.assets %>" ],
            dest: "<%= build_dir %>/",
            cwd: "",
            expand: true,
            // flatten: true
          }
       ]
      },
      build_appjs: {
        files: [
          {
            src: [ "<%= app_files.js %>" ],
            dest: "<%= build_dir %>/",
            cwd: "",
            expand: true
          },{
            src: "<%= src_dir %>/sw.js",
            dest: "<%= build_dir %>/",
            cwd: "",
            expand: true,
            flatten: true
          }
        ]
      },
      build_vendorjs: {
        files: [
          {
            src: [ "<%= vendor_files.js %>" ],
            dest: "<%= build_dir %>/",
            cwd: "",
            expand: true
          }
        ]
      },
      build_vendorcss: {
        files: [
          {
            src: [ "<%= vendor_files.css %>" ],
            dest: "<%= build_dir %>/",
            cwd: "",
            expand: true
          }
        ]
      },
      compile_assets: {
        files: [
          {
            src: ["**"],
            dest: "<%= compile_dir %>/assets",
            cwd: "<%= build_dir %>/assets",
            expand: true
          },
          {
            src: [ "<%= vendor_files.css %>" ],
            dest: "<%= compile_dir %>/",
            cwd: "",
            expand: true
          },{
            src: "<%= build_dir %>/sw.js",
            dest: "<%= compile_dir %>/",
            cwd: "",
            expand: true,
            flatten: true
          }
        ]
      },
      email_plain: {
        files: [
          {
            src: [ "**/*.txt" ],
            cwd: "email/src/",
            dest: "email/dist/",
            expand: true
          }
        ]
      },
      email_dist: {
        files: [
          {
            src: [ "**/*.*" ],
            cwd: "email/dist/",
            dest: "email/templates/",
            expand: true
          }
        ]
      }
    },
    // "grunt concat" concatenates multiple source files into a single file.
    concat: {
      // The "build_css" target concatenates compiled CSS and vendor CSS together.
      build_css: {
        src: [
          "<%= vendor_files.css %>",
          "<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css"
        ],
        dest: "<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css"
      },
      // The "compile_js" target is the concatenation of our application source
      // code and all specified vendor source code into a single file.
      compile_js: {
        options: {
          stripBanners: true,
          banner: "<%= meta.banner %>"
        },
        dest: "<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js",
        src: (function(){
            var cwd = "";
            var files = userConfig.vendor_files.js;

            files = files.map(function (file){
                return cwd + file;
            });
            // files.push("build/assets/scripts/*.js");
            files.push("module.prefix");
            files.push("build/src/**/*.js");
            files.push("build/templates-app.js");
            files.push("build/templates-common.js");
            files.push("module.suffix");
          return files;
        }())
      }
    },
    // "ngAnnotate" annotates the sources before minifying. That is, it allows us
    //  to code without the array syntax.
    ngAnnotate: {
      compile: {
        files: [
          {
            src: [ "<%= app_files.js %>" ],
            cwd: "<%= build_dir %>",
            dest: "<%= build_dir %>",
            expand: true
          }
        ]
      }
    },
    compress: {
      compile: {
        options: {
          mode: 'gzip'
        },
        expand: true,
        src:["<%= compile_dir %>/**/*"]
      }
    },
    // Minify the sources
    uglify: {
      compile: {
        options: {
          mangle : false,
          stripBanners: true,
          banner: "<%= meta.banner %>",
          compress: {
            drop_console: true
          }
        },
        src:"<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js",
        //dest:"<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js",
        expand: true
        },
      sitejs: {
        options: {
          stripBanners: true,
          banner: "<%= meta.banner %>"
        },
        src:" <%= compile_dir %>/assets/site.js",
        expand: true
      }
    },
    // Contains local and production constants / public keys
    ngconstant: {
      // Options for all targets
      options: {
        space: "  ",
        wrap: "\"use strict\";\n\n {\%= __ngModule %}",
        name: "bolt.config",
      },
      // Environment targets
      local: {
        options: {
          dest: "<%= build_dir %>/assets/config.js"
        },
        constants: {
          env: {
            name: "local",
            apiEndpoint: "http://bolt-staging.ap-southeast-1.elasticbeanstalk.com/api/v1",
            intercom: "ed1lcqy8",
            ga: "UA-65332447-5",
            angular_sentry: "",
            stripe: "pk_test_aYyxQWqg3lc0m5xV0Q5Gw8Cr",
            version: "<%= pkg.version %>-<%= grunt.template.today(\"yyyy-mm-dd\") %>"
          }
        }
      },
      local_server: {
        options: {
          dest: "<%= build_dir %>/assets/config.js"
        },
        constants: {
          env: {
            name: "local",
            apiEndpoint: "http://127.0.0.1:8000/api/v1",
            intercom: "ed1lcqy8",
            ga: "UA-65332447-5",
            angular_sentry: "",
            stripe: "pk_test_aYyxQWqg3lc0m5xV0Q5Gw8Cr",
            version: "<%= pkg.version %>-<%= grunt.template.today(\"yyyy-mm-dd\") %>"
          }
        }
      },
      development: {
        options: {
          dest: "<%= build_dir %>/assets/config.js"
        },
        constants: {
          env: {
            name: "development",
            apiEndpoint: "http://bolt-staging.ap-southeast-1.elasticbeanstalk.com/api/v1",
            intercom: "ed1lcqy8",
            ga: "UA-65332447-3",
            angular_sentry: "https://e2e3a16a2d484f0dbe49cb943ab2b879@app.getsentry.com/71147",
            stripe: "pk_test_aYyxQWqg3lc0m5xV0Q5Gw8Cr",
            version: "<%= pkg.version %>-<%= grunt.template.today(\"yyyy-mm-dd\") %>"
          }
        }
      },
      production: {
        options: {
          dest: "<%= build_dir %>/assets/config.js"
        },
        constants: {
          env: {
            name: "production",
            apiEndpoint: "https://api.boltmedia.co/api/v1",
            intercom: "nnuqv8qp",
            ga: "UA-65332447-2",
            angular_sentry:"https://689eaef56cc543b2b87c12d471906da7@app.getsentry.com/71148",
            stripe: "pk_live_5nWBzAeSTDYvHhXXQGdQiKCU",
            version: "<%= pkg.version %>-<%= grunt.template.today(\"yyyy-mm-dd\") %>"
            }
        }
      }
    },

    sass: {
      build: {
        options: {
            style: "nested",
            // loadPath: "src/scss",
            sourcemap: "auto"
        },
          files: [{
            // cwd: "styles",
            // src: ["*.scss"],
            // dest: "../public",
            // ext: ".css"
            src: "<%= app_files.scss %>",
            dest: "<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css"


          }]
          // files: {
          //   "<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css": ["<%= app_files.scss %>"]
          // }
        },
      compile: {
          options: {
              style: "compressed",
              loadPath: ["src/scss","src/app/*"],
              sourcemap: "auto"
          },
          files: {
            "<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css": "<%= app_files.scss %>"
          }
      },
      email: {
        options: {

        },
        src: "email/scss/foundation-emails.scss",
        dest: "email/build/css/style.css"
      }
    },
    /**
     * `jshint` defines the rules of our linter as well as which files we
     * should check. This file, all javascript sources, and all our unit tests
     * are linted based on the policies listed in `options`. But we can also
     * specify exclusionary patterns by prefixing them with an exclamation
     * point (!); this is useful when code comes from a third party but is
     * nonetheless inside `src/`.
     */
    jshint: {
      src: [
        "<%= app_files.js %>"
      ],
      test: [
        "<%= app_files.jsunit %>"
      ],
      gruntfile: [
        "Gruntfile.js"
      ],
      options: {
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true
      },
      globals: {}
    },
    // post process the css to add in vendor prefixes if they don"t already exist.
    postcss: {
      options: {
        map: true, // inline sourcemaps
        processors: [
          require("pixrem")(), // add fallbacks for rem units
          require("autoprefixer")({ browsers:
            ['Android >= 2.3',
             'BlackBerry >= 7',
             'Chrome >= 9',
             'Firefox >= 4',
             'Explorer >= 9',
             'iOS >= 5',
             'Opera >= 11',
             'Safari >= 5',
             'OperaMobile >= 11',
             'OperaMini >= 6',
             'ChromeAndroid >= 9',
             'FirefoxAndroid >= 4',
             'ExplorerMobile >= 9'
          ] }),
          require("cssnano")() // minify the result
        ]
      },
      dist: {
        src: "<%= build_dir %>/assets/*.css"
      }
    },
    // HTML2JS is a Grunt plugin that takes all of your template files and
    // places them into JavaScript files as strings that are added to
    // AngularJS"s template cache. This means that the templates too become
    // part of the initial payload as one JavaScript file. Neat!
    html2js: {
      /**
       * These are the templates from `src/app`.
       */
      app: {
        options: {
          base: "src/app"
        },
        src: [ "<%= app_files.atpl %>" ],
        dest: "<%= build_dir %>/templates-app.js"
      },
      /**
       * These are the templates from `src/common`.
       */
      common: {
        options: {
          base: "src/common"
        },
        src: [ "<%= app_files.ctpl %>" ],
        dest: "<%= build_dir %>/templates-common.js"
      }
    },

// The Karma configurations.
    karma: {
      options: {
        configFile: "<%= build_dir %>/karma-unit.js"
      },
      unit: {
        port: 9019,
        background: true
      },
      continuous: {
        singleRun: true
      },
      travis: {
        singleRun: true,
        browsers: ["PhantomJS"]
      }
    },
    protractor: {
      options: {
        configFile: "node_modules/protractor/example/conf.js", // Default config file
        keepAlive: true, // If false, the grunt process stops when the test fails.
        noColor: false, // If true, protractor will not use colors in its output.
        args: {
          // Arguments passed to the command
        }
      },
      tests: {   // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
        options: {
          configFile: "protractor/protractor.conf.js", // Target-specific config file
          args: {} // Target-specific arguments
        }
      },
    },


// The `index` task compiles the `index.html` file as a Grunt template. CSS
// and JS files co-exist here but they get split apart later.
    index: {
      /**
       * During development, we don"t want to have wait for compilation,
       * concatenation, minification, etc. So to avoid these steps, we simply
       * add all script files directly to the `<head>` of `index.html`. The
       * `src` property contains the list of included files.
      **/
      build: {
        dir: "<%= build_dir %>",
        cwd: "",
        src: [
          "<%= vendor_files.js %>",
          "src/**/*.js",
          "!src/sw.js",
          "!src/**/*.spec.js",
          "!src/assets/**/*.js",
          "<%= build_dir %>/templates-app.js",
          "<%= build_dir %>/templates-common.js",
          "<%= vendor_files.css %>",
          "<%= vendor_files.assets %>",
          "<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css",
          "<%= build_dir %>/assets/config.js",
          // "<%= build_dir %>/assets/scripts/*.js",
        ]
      },

      /**
       * When it is time to have a completely compiled application, we can
       * alter the above to include only a single JavaScript and a single CSS
       * file. Now we"re back!
       */

      compile: {
        dir: "<%= compile_dir %>",
        cwd: "",
        src: [
          "<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js",
          "<%= vendor_files.css %>",
          "<%= vendor_files.assets %>",
          "<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css"
        ]
      }
    },

    /**
     * This task compiles the karma template so that changes to its file array
     * don"t have to be managed manually.
     */
    karmaconfig: {
      unit: {
        dir: "<%= build_dir %>",
        cwd: "",
        src: [
          "<%= vendor_files.js %>",
          "<%= vendor_files.assets %>",
          "<%= html2js.app.dest %>",
          "<%= html2js.common.dest %>",
          "<%= test_files.js %>"
        ]
      }
    },

    /**
     * And for rapid development, we have a watch set up that checks to see if
     * any of the files listed below change, and then to execute the listed
     * tasks when they do. This just saves us from having to type "grunt" into
     * the command-line every time we want to see what we"re working on; we can
     * instead just leave "grunt watch" running in a background terminal. Set it
     * and forget it, as Ron Popeil used to tell us.
     *
     * But we don"t need the same thing to happen for all the files.
     */
    delta: {
      /**
       * By default, we want the Live Reload to work for all tasks; this is
       * overridden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729, which your browser
       * plugin should auto-detect.
       */
      options: {
        livereload: true
      },

      /**
       * When the Gruntfile changes, we just want to lint it. In fact, when
       * your Gruntfile changes, it will automatically be reloaded!
       */
      gruntfile: {
        files: "Gruntfile.js",
        tasks: [ "jshint:gruntfile" ],
        options: {
          livereload: true
        }
      },

      server: {
        files: "server.js",
        tasks: [ "bgShell:freePort", "express:dev" ],
        options: {
          livereload: true
        }
      },
      /**
       * When our JavaScript source files change, we want to run lint them and
       * run our unit tests.
       */
      jssrc: {
        files: [
          "src/**/*.js"
        ],
        // tasks: [ "jshint:src", "karma:unit:run", "copy:build_appjs" ]
        tasks: [ "jshint:src", "copy:build_appjs", "replace:sw" ]
      },

      /**
       * When assets are changed, copy them. Note that this will *not* copy new
       * files, so this is probably not very useful.
       */
      assets: {
        files: [
          "src/assets/**/*"
        ],
        tasks: [ "copy:build_app_assets", "copy:build_vendor_assets" ]
      },

      /**
       * When index.html changes, we need to compile it.
       */
      html: {
        files: [ "src/index.html" ],
        tasks: [ "index:build" ]
      },

      email: {
        files: [
          "email/**/*"
        ],
        tasks: [ "inky", "sass:email","inline_css_custom", "email_test_templates","replace"]
      },
      /**
       * When our templates change, we only rewrite the template cache.
       */
      tpls: {
        files: [
          "<%= app_files.atpl %>",
          "<%= app_files.ctpl %>"
        ],
        tasks: [ "html2js" ]
      },

      /**
       * When the CSS files change, we need to compile and minify them.
       */
      sass: {
        files: [ "src/**/*.scss" ],
        tasks: [ "sass:build" ]
      },
      /**
       * When a JavaScript unit test file changes, we only want to lint it and
       * run the unit tests. We don"t want to do any live reloading.
       */
      jsunit: {
        cwd: "",
        files: [
          "<%= app_files.jsunit %>"
        ],
        tasks: [ "jshint:test", "karma:continuous" ],
        // tasks: ["karma:continuous"],
        options: {
          livereload: true
        }
      }
    },

    // lets us run shell commands. Left django one for example only
    // see: https://npmjs.org/package/grunt-bg-shell
    bgShell: {
      _defaults: {
        bg: true
      },
      runDjango: {
        cmd: "python manage.py runserver"
      },
      freePort: {
        cmd: "lsof -ti tcp:3000 | xargs kill -9"
      }
    },

    // runs a development server using express
    express: {
      options: {
        // Override defaults here
      },
      dev: {
        options: {
          script: 'server.js'
        }
      },
    },


    replace: {
      sw: {
        options: {
          patterns: [
            {
              match: 'pkg.version',
              replacement: "<%= pkg.version %>-<%= grunt.template.today(\"yy.mm.dd.hh.mm.ss\") %>"
            }
          ]
        },
        files: [
          {
            cwd: "build",
            src: ["*.js", "!templates-app.js", "!karma-unit.js", "!templates-common.js"],
            dest: "build/",
            expand: true,
            flatten: true
          }
        ]
      }
    },

    // optimize image
    imagemin: {
      dynamic: {

        files: [{
          expand: true,
          cwd: "<%= build_dir %>/assets/img/",
          src: ["**/*.{png,jpg,jpeg,gif}"],
          dest: "<%= compile_dir %>/assets/img/"
        }]
      }
    },
    // sass: {
    //   dist:{
    //         options: {
    //             style: "expanded",
    //             lineNumbers: true, // 1
    //             sourcemap: "none"
    //         },
    //         files: [{
    //             expand: true, // 2
    //             cwd: "vendor/angular-material",
    //             src: ["angular-material.scss"],
    //             dest: "vendor/angular-material",
    //             ext: ".css"
    //         }]
    //       }
    //     },
  }; //initConfig

grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

  grunt.renameTask( "watch", "delta" );
  grunt.registerTask( "watch",        [ "build", "karma:unit", 'express:dev', "delta"] );
  grunt.registerTask( "serve",        [ "build", "express:dev", "delta"] );
  grunt.registerTask( "local",        [ "build_local", "express:dev", "delta"] );

  grunt.registerTask( "e2e",          [ "selenium_start", "protractor", "selenium_stop" ]);
  grunt.registerTask( "unit",         [ "karmaconfig", "karma:continuous","delta"]);

  grunt.registerTask( "test",         [ "build", "karmaconfig", "karma:continuous", "e2e" ]);

  grunt.registerTask( "default",      [ "build","compile"] );
  grunt.registerTask( "build",        [ "clean:build", "ngconstant:local", "html2js", "jshint",
                                        "sass:build", "concat:build_css", "copy:build_app_assets",
                                        "copy:build_vendor_assets", "copy:build_appjs",
                                        "copy:build_vendorjs", "copy:build_vendorcss", "replace:sw" ,"postcss",
                                        "index:build"]);
  grunt.registerTask( "build_local",  [ "clean:build", "ngconstant:local_server", "html2js", "jshint",
                                        "sass:build", "concat:build_css", "copy:build_app_assets",
                                        "copy:build_vendor_assets", "copy:build_appjs",
                                        "copy:build_vendorjs", "copy:build_vendorcss", "replace:sw" ,"postcss",
                                        "index:build"]);

  grunt.registerTask( "travis",       [ "jshint", "karmaconfig", "karma:continuous", "e2e"] );
  grunt.registerTask( "compile",      [ "ngconstant:production", "sass:compile", "copy:compile_assets",
                                        "ngAnnotate", "concat:compile_js", "imagemin", "uglify", "compress",
                                        "index:compile"
                                      ]);
  grunt.registerTask( "compileDev",   [ "ngconstant:development", "sass:compile", "copy:compile_assets",
                                        "ngAnnotate", "concat:compile_js","imagemin",
                                        "index:compile"
                                      ]);
  grunt.registerTask( "compileProd",  [ "ngconstant:production", "sass:compile", "copy:compile_assets",
                                        "ngAnnotate", "concat:compile_js","imagemin", "uglify", "compress",
                                        "index:compile"
                                      ]);
  grunt.registerTask( "bolt",         [ "build", "compile" ] );

  // copy each file into the appropraite folder and inline css
  // copy each file to a test folder, inline, and populate with fake data
  // email folder will map to templates folder

  grunt.registerTask("default", "Prints usage", function () {
      grunt.log.writeln("");
      grunt.log.writeln("Grunt Tasks for Bolt");
      grunt.log.writeln("------------------------------------------------------");
      grunt.log.writeln("");
      grunt.log.writeln("* run \"grunt --help\" to get an overview of all commands.");
      grunt.log.writeln("* run \"grunt db\" to run the script to clear out the migrations and db.");
      grunt.log.writeln("* run \"grunt build\" for development and testing.");
      grunt.log.writeln("* run \"grunt delta\" or \"grunt serve\" to track changes and reload");
      grunt.log.writeln("* run \"grunt compileDev \" for staging deployment deployment.");
      grunt.log.writeln("* run \"grunt compileProd\" for production deployment.");
      grunt.log.writeln("* run \"grunt email\" to rebuild the emails.");
      grunt.log.writeln("* run \"grunt emailTest\" output to the email test folder and watch.");
  });

  /**
   * A utility function to get all app JavaScript sources.
   */
  function filterForJS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.js$/ );
    });
  }

  /**
   * A utility function to get all app CSS sources.
   */
  function filterForCSS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.css$/ );
    });
  }


  function removeA(arr) {
      var what, a = arguments, L = a.length, ax;
      while (L > 1 && arr.length) {
          what = a[--L];
          while ((ax= arr.indexOf(what)) !== -1) {
              arr.splice(ax, 1);
          }
      }
      return arr;
  }


 /**
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   **/

  grunt.registerMultiTask( "index", "Process index.html template", function () {
    // grunt.log.write("this file src: ",this);
    var dirRE = new RegExp( "^("+"angular\/"+grunt.config("build_dir")+"|"+"angular\/"+grunt.config("compile_dir")+"|"+grunt.config("build_dir")+"|"+grunt.config("compile_dir")+")\/", "g" );
    // grunt.log.write("this dirRE: ",dirRE);

    var jsFiles = filterForJS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, "" );
    });
    var cssFiles = filterForCSS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, "" );
    });

    // removeA(jsFiles, 'src/sw.js');

    // grunt.log.write(cssFiles);
    // grunt.log.write("JSfiles ",jsFiles);

    grunt.file.copy("src/index.html", ""+this.data.dir+"/index.html", {
      process: function ( contents, path ) {
        return grunt.template.process( contents, {

          data: {
            scripts: jsFiles,
            styles: cssFiles,
            version: grunt.config( "pkg.version" )
          }
        });
      }
    });
  });

 /**
   * In order to avoid having to specify manually the files needed for karma to
   * run, we use grunt to manage the list for us. The `karma/*` files are
   * compiled as grunt templates for use by Karma. Yay!
   **/

  grunt.registerMultiTask( "karmaconfig", "Process karma config templates", function () {
    var jsFiles = filterForJS( this.filesSrc );

    grunt.file.copy( "karma/karma-unit.tpl.js","" + grunt.config( "build_dir" ) + "/karma-unit.js", {
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles
          }
        });
      }
    });
  });

};