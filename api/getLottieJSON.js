var AV = require('leanengine');
var axios = require('axios');
var cheerio = require('cheerio');
const fs = require('fs');


AV.Cloud.define('getLottieJSON', request => getLottieJSON(request));

function getLottieJSON(request) {
    var jsonURL = request.params.jsonURL;
    if (jsonURL) {


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
                jsonURL: `https://uploader.shimo.im/f/E5oEK6IjYc8FgKUl.json`
            }
        })
        console.log(feedback);
    }
}) 