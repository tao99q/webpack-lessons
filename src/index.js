const str = require('./components');
import $ from 'jquery'
require('./index.less');
var src = require("./img/1.jpg");
let write = str => {
    document.write(str);
    let img =  document.createElement('img');
    img.src = src;
    document.body.appendChild(img);

};
write(str);
if(__DEV__){
    console.log('开发环境');
}else{

    console.log('生产环境');
}
