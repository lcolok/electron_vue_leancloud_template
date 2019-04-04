var AV = require('leanengine');
var axios = require('axios');
var cheerio = require('cheerio');
const fs = require('fs');


AV.Cloud.define('getLottie', request => getLottie(request));

function getLottie(request) {
    var lottieURL = request.params.lottieURL;
    if (lottieURL) {


        return new Promise((resolve, reject) => {

            var query = new AV.Query('lottieJSON');
            query.equalTo('lottieURL', lottieURL);
            query.find().then((results) => {

                if (results.length > 0) {
                    resolve(results[0].get('uploaderURL'))//返回匹配到lottieURL的第一项
                } else {
                    var middle = lottieURL.match(/lottiefiles\.com\/[0-9]*/im)[0];
                    var index = middle.match(/[0-9]+/)[0];
                    var downloadURL = "https://lottiefiles.com/download/public/" + index;
                    // console.log(downloadURL);

                    var titlePromise = axios.get(lottieURL);


                    var lottieJsonPromise = axios.get(downloadURL, {
                        headers: {
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "Accept-Encoding": "br, gzip, deflate",
                            "Accept-Language": "zh-cn",
                            "Connection": "keep-alive",
                            "Cookie": "XSRF-TOKEN=eyJpdiI6IjFCOUZ1QlJ0ejQ1TU1hNVl0cW9qTVE9PSIsInZhbHVlIjoiOVRMK2luSnMxaWRBSzMrTCtKMG14czVFR1VMVWlxZGUyTWpyeGtMcVVrVmJcL3BoRU9FZUJDblZcL2tWak53THdPIiwibWFjIjoiNzhjMDJiYzZkNDNhN2NkMWI0ODAzNzBmMzJjMWQxMzExYmVmZmViZjllZTVhOGEyY2VmZGY0M2U4NTMxM2EwNiJ9; lottiefiles_session=eyJpdiI6ImNzRWJMXC9ZQVc2MlR1a3plYWxIRE9nPT0iLCJ2YWx1ZSI6IlIyOVhlOURSdlwvVUs3NjZDNjF2WFVRMnEzaDA5V3NyZlRuS2ZjSjIzS21LbkMyQmlJSHROcXltWWpqdGlCTjZKIiwibWFjIjoiMmMxZWZkZmI0MjAyZTY1ZWU1NjkxNzg3ZDU0OTIwYjdkODg1ZTQzZGMwMWQ5ODMyOWVlZTM1NzVhMTNiMWNmZiJ9; AWSALB=9qSuWHH1fGjIkjcEex4AgJYZStvOiPaKJWajjz/CbIq5sI177bfD5RvvZmPZOhYUvoDV09eHwxyc3RBWMjuNX/7gQJR51Pzz658L4QS0hGO92xPn2URTir6rNm6Z; _ga=GA1.2.1468810957.1537172483",
                            "Host": "lottiefiles.com",
                            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/74.0.3729.38 Mobile/15E148 Safari/605.1",
                        }
                    });



                    Promise.all([titlePromise, lottieJsonPromise]).then(async (results) => {
                        $ = cheerio.load(results[0].data);
                        var title = $('h1.text-2xl').text() + '.json';
                        // var data = results[1].data;
                        // console.log(data);
                        var data = JSON.stringify(results[1].data);
                        var feedback = await AV.Cloud.run('postFormShimo', {
                            class: 'lottieJSON',
                            data: data,
                            filename: title,
                            lottieURL: lottieURL
                        });
                        resolve(feedback[0].uploaderURL);
                    }).catch(function (e) {
                        console.log(e);
                    });


                }

            }).catch(e => {
                console.log(e);
            });

        })

    }
}




require('../tools/identifier.js').run({
    rules: '!vscode||local',
    func: async () => {
        var feedback = await getLottie({
            params: {
                lottieURL: `https://lottiefiles.com/5174-stream-swipe-logo`
            }
        })
        console.log(feedback);
    }
}) 