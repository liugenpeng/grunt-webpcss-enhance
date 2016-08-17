var postcss = require('postcss');
var helpers = require( 'postcss-helpers');

module.exports = postcss.plugin('postcss-webp', function (opts) {
    var defaultOptions = {
        webpClass:'.webp',
        noWebpClass:"",
        imgRules:{
            replace_from:/\.(png|jpg|jpeg)/,
            replace_to:".webp"
        },
        urlRules:{
            replace_from:'../images',
            replace_to:'../images/webp'
        }
    };
  
    opts = Object.assign({}, defaultOptions, opts);
    //webpclass 样式前缀
    var webpClass = opts.webpClass;
    var imgRules = opts.imgRules;
    var rx = imgRules.replace_from instanceof RegExp ?
            imgRules.replace_from :
            new RegExp(imgRules.replace_from, "g");
    
    var urlRules = opts.urlRules;
    
    function _formatSelector(_mutiSelector) {

        return _mutiSelector.map(function(selector,i){

            if (selector.indexOf(webpClass) > -1) {
                return selector;
            } else {
                return webpClass + " "+ selector;
            } 
              
        });
    }
    //解析并重置对应的background-position属性
    function _formatBpRules(decl,_mutiSelector, bpRules){
       
        var selArr ;
        //是否含有background-position
        if (decl.prop.toLocaleLowerCase().indexOf('background-position') > -1) { 
            
            selArr = _mutiSelector.map(function(selector,i){

                if (selector.indexOf(webpClass) > -1) {
                    return selector;
                } else {
                    return webpClass +' '+ selector;
                } 
              
            });
           
            bpRules.push( selArr.join(',') + " { background-position: "+decl.value +"  }");
        }
        
       
    }

    return function (style, result) {
        var selectors = [];
        var impAttrs = [];
      
        style.walk(function(node){
            
            if (!node.selector) {
                return ;
            }
            
            node.walkDecls(function(decl){
               
                var ruleValue = decl.value;
                //是否为.gif图片。因为大部分gif为动态图，webp支持的并不好，所以先不处理.gif格式图片
                if (!ruleValue || ruleValue.indexOf('.gif')>-1) {
                    return;
                }
                if (node.selector.indexOf('.webp') > -1) {
                    return;
                }
                var _mutiSelector = node.selector.split(',');
                //解析并重置对应的background-position属性
                _formatBpRules(decl, _mutiSelector, impAttrs);

                //不含有url属性，
                if (!ruleValue.match(helpers.regexp.URLS)) { return; }
               
                str = _formatSelector(_mutiSelector).join(',');

                ruleValue = ruleValue.replace(rx, imgRules.replace_to);

                if (ruleValue.indexOf("/webp/") == -1) {
                     ruleValue = ruleValue.replace(urlRules.replace_from, urlRules.replace_to);
                }
            
                selectors.push(str +" {"+decl.prop+":"+ruleValue+"}")
                
              });
          
        });


        var finallyArray =  selectors.concat(impAttrs);
        style._bs_result = finallyArray.join("\n");
      
    };
});