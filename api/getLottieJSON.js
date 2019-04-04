var AV = require('leanengine');
var axios = require('axios');
var cheerio = require('cheerio');
const fs = require('fs');


AV.Cloud.define('getLottieJSON', request => getLottieJSON(request));

async function getLottieJSON(request) {
    var url = request.params.url;
    var jsonURL;
    if (url) {
        if (url.match(/uploader\.shimo/gm)) {
            console.log('已经缓存到石墨上');
            jsonURL = url;
        } else if (url.match(/lottiefiles\.com\/[0-9]*/gm)) {
            console.log('即将采用getLottie的方法');
            jsonURL = await AV.Cloud.run('getLottie', { lottieURL: url });
        }

        return new Promise((resolve, reject) => {
            axios.get(jsonURL).then(resp => {
                resolve(JSON.stringify(resp.data));
            });
            // var data = JSON.stringify(results[1].data);
        })
    }
}




require('../tools/identifier.js').run({
    rules: '!vscode||local',
    func: async () => {

        var feedback = await getLottieJSON({
            params: {
                url: `https://lottiefiles.com/5163-spf`
            }
        })
        console.log(feedback);
    }
}) 