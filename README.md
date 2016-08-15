# grunt-webpcss-enhance

> 适配webp格式图片处理样式表的grunt插件

## Getting Started
This plugin requires Grunt `~0.4.5`


## 用法

### 1.安装
```shell
  npm install grunt-webpcss --save-dev
```

### 2.gruntfile 基本用法
```js
   grunt.loadNpmTasks('grunt-webpcss');
    ...
      webpcss: {

          mytask: {
              options: {
                  suffix:['.png', '.jpg'],
                  rules:{
                      from:'../images',
                      to:'../images/webp'
                  }
              },
              files: {
                 './app2.css': ['./test/app.css']
              }
          }
        }
    ...
```


