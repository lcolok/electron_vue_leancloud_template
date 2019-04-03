var AV = require('leanengine');

/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function (request) {
  return 'Hello world!';
});

AV.Cloud.define('getLotte', function (request) {
  var lotteURL = request.params.lotteURL;
  if (lotteURL) {
    var middle = lotteURL.match(/lottiefiles\.com\/[0-9]*/im)[0];
    var index = middle.match(/[0-9]+/)[0];
    var donwloadURL = "https://lottiefiles.com/download/public/" + index;
    return donwloadURL;
  }
});
