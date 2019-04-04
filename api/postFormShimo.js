var AV = require('leanengine');
var http = require('request');
AV.Cloud.define('postFormShimo', (request) => { return postFormShimo(request) })



async function postFormShimo(request) {

    var token = await AV.Cloud.run('getShimoTokenRaw');
    var data = request.params.data;
    var filename = request.params.filename;
    return new Promise((resolve, reject) => {
        const r = http.post({
            url: 'https://uploader.shimo.im/upload2',
            // header: headers,
        }, function optionalCallback(err, httpResponse, body) {//上传成功后的callback
            // console.log(body);
            var json = JSON.parse(body);

            var arr = filename.split('.');
            var suffix = arr.pop();
            var realName = arr.join('.');

            json.data.type = suffix;
            json.data.name = realName;
            json.class = request.params.class;
            json.lottieURL = request.params.lottieURL;

            var feedback = AV.Cloud.run('updateShimo', json);
            resolve(feedback);
        })
        const form = r.form();
        form.append('server', 'qiniu');
        form.append('type', 'attachments');
        form.append('accessToken', token);
        form.append('file', data, { filename: filename });//这个可以强制改名字

        /*         var start = new Date();
                var prev;
                var interval = setInterval(() => {
        
                    var uploaded = r.req.connection._bytesDispatched;
                    var mb = uploaded / (1024 * 1024);
                    var percent = (uploaded / size * 100).toFixed(0);
                    if (percent >= 100) {
                        clearInterval(interval);
                    }
        
                    prev = percent;
                    var end = new Date();
                    var duration = (end - start) / 1000;
                    var speed = mb / duration;
                    console.log(`Uploaded: ${mb.toFixed(2)} MB; Progress: ${percent}%; Upload_Speed: ${speed.toFixed(2)} MB/s`);
        
                }, 500); */
    })

}