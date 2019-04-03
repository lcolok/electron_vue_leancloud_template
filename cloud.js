var AV = require('leanengine');
var axios = require('axios');
/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function (request) {
  return 'Hello world!';
});

AV.Cloud.define('getLottie', request => getLottie(request));

function getLottie(request) {
  var lottieURL = request.params.lottieURL;
  if (lottieURL) {
    var middle = lottieURL.match(/lottiefiles\.com\/[0-9]*/im)[0];
    var index = middle.match(/[0-9]+/)[0];
    var downloadURL = "https://lottiefiles.com/download/public/" + index;
    console.log(downloadURL);
    axios.get(downloadURL, {
      headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Encoding": "br, gzip, deflate",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": "XSRF-TOKEN=eyJpdiI6IjFCOUZ1QlJ0ejQ1TU1hNVl0cW9qTVE9PSIsInZhbHVlIjoiOVRMK2luSnMxaWRBSzMrTCtKMG14czVFR1VMVWlxZGUyTWpyeGtMcVVrVmJcL3BoRU9FZUJDblZcL2tWak53THdPIiwibWFjIjoiNzhjMDJiYzZkNDNhN2NkMWI0ODAzNzBmMzJjMWQxMzExYmVmZmViZjllZTVhOGEyY2VmZGY0M2U4NTMxM2EwNiJ9; lottiefiles_session=eyJpdiI6ImNzRWJMXC9ZQVc2MlR1a3plYWxIRE9nPT0iLCJ2YWx1ZSI6IlIyOVhlOURSdlwvVUs3NjZDNjF2WFVRMnEzaDA5V3NyZlRuS2ZjSjIzS21LbkMyQmlJSHROcXltWWpqdGlCTjZKIiwibWFjIjoiMmMxZWZkZmI0MjAyZTY1ZWU1NjkxNzg3ZDU0OTIwYjdkODg1ZTQzZGMwMWQ5ODMyOWVlZTM1NzVhMTNiMWNmZiJ9; AWSALB=9qSuWHH1fGjIkjcEex4AgJYZStvOiPaKJWajjz/CbIq5sI177bfD5RvvZmPZOhYUvoDV09eHwxyc3RBWMjuNX/7gQJR51Pzz658L4QS0hGO92xPn2URTir6rNm6Z; _ga=GA1.2.1468810957.1537172483",
        "Host": "lottiefiles.com",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/74.0.3729.38 Mobile/15E148 Safari/605.1",
      }
    })
      .then(resp => {
        console.log(resp.data);
      }).catch(e => {
        console.log(e);
      })
    return downloadURL;
  }
}

getLottie({
  params: {
    lottieURL: `https://lottiefiles.com/5289-finger-print-scan`
  }
})