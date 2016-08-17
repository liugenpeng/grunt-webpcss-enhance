/*
 * grunt-webpcss
 * https://github.com/liugenpeng/grunt-webpcss
 *
 * Copyright (c) 2016 liugenpeng
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    

    // Configuration to be run (and then tested).
    webpcss: {

      mytask: {
          options: {
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
                  semanticMerging:false,
                  keepBreaks:true,
                  compatibility:'ie8',
                  rebase: false,
                  advanced:false
              }
          },
          files: {
             './app2.css': ['./test/app.css']
          }
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');


  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['webpcss']);


};
