var AV = require('leanengine');
var requestJS = require('request');

var filename = __filename.split("/").pop().split(".js").shift();

AV.Cloud.define(filename, async function (request) {
    return await getQiniuJSON(request);
});


async function getQiniuJSON(request) {

    var fileNameArr = request.params.fileNameArr;
    var shimoToken = await AV.Cloud.run('getShimoTokenRaw');
    console.log(shimoToken);
    return new Promise((resolve, reject) => {
        requestJS.post(`https://uploader.shimo.im/token?server=qiniu&type=attachments&accessToken=${shimoToken}`, {
            json: true,
            body: fileNameArr
            /*             headers: {
                            'Cookie': process.env.shimoCookie,
                        } */
        }, (err, httpResponse, body) => {
            if (!err) {
                console.log(body);
                resolve(body)
            } else {
                reject(false);
            }
        })
    })
}


require('../tools/identifier.js').run({
    rules: '!vscode||local',
    func: async () => {

        var feedback = await getQiniuJSON({
            params: {
                fileNameArr: ['test.mp4']
            }
        })
        // console.log(feedback);
    }
}) 