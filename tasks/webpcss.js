/*
 * grunt-webpcss
 * https://github.com/liugenpeng/grunt-webpcss
 *
 * Copyright (c) 2016 liugenpeng
 * Licensed under the MIT license.
 */

'use strict';
var path = require('path');
var postcss = require('postcss');
var postcssWebp = require('../lib/postcss-webp');
var path = require('path');
var _ = require('lodash');
var CleanCSS = require('clean-css');
module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('webpcss', '为支持webp格式图片处理css', function(options) {
      // Merge task-specific and/or target-specific options with these defaults.
      var options = this.options({
          webpClass:'.webp',
          noWebpClass:"",
          imgRules:{
              replace_from:/\.(png|jpg|jpeg)/,
              replace_to:".webp"
          },
          urlRules:{
              replace_from:'../images',
              replace_to:'../images/webp'
          },
          cssStyles:{
              compatibility:true,
              keepBreaks:true,
              advanced:false
          }
      });
      var webpOptions = _.extend({}, options);
      var done = this.async();
      // Iterate over all specified file groups.
      this.files.forEach(function(f) {
         
          var src = f.src.filter(function(filepath) {
            //当文件不存在
              if (!grunt.file.exists(filepath)) {
                  grunt.log.warn('源文件："' + filepath + '" 不存在.');
                  return false;
              } else {
                  return true;
              }
          });

          if (src.length === 0) {
              grunt.log.error('源文件不存在.');
              return done();
          }

          src.map(function(filepath){
              var css = grunt.file.read(filepath, {
                  encoding:'utf-8'
              });
             
              webpOptions = _.extend(webpOptions, {
                  dest:path.normalize(f.dest)
              });
              
              postcss()
                  .use(postcssWebp(
                    webpOptions
                  ))
                  .process(css).then(function(result){
                      var processCss = result.root._bs_result;
                      
                      new CleanCSS(webpOptions.cssStyles).minify(processCss, function (error, minified) {
                         
                          var css_buff = new Buffer(minified.styles, 'utf8');
                    
                          grunt.file.write(webpOptions.dest, css_buff, {
                              encoding:"utf8"
                          });
                          
                          return done();
                      });
                  });
          });
  
      });


    });

};
