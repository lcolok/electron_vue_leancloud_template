var AV = require('leanengine');

AV.Cloud.define('updateShimo', (request) => { return updateShimo(request) })



var axios = require('axios');
const Qs = require("qs");
var fs = require('fs');
var request = require('request');
// var FormData = require('form-data');




var newDiscussionID = "K8CWmBMqMtYYpU1f";
var getAttachmentID = "K8CWmBMqMtYYpU1f";

// console.log(process.env.shimoCookie);

var shimoCookie = process.env.shimoCookie;

var genericHeaders = {//一定要填充这个请求头才能规避那个频次过高的检测
    "Accept": "application/vnd.shimo.v2+json",
    "Accept-Encoding": "br, gzip, deflate",
    "Accept-Language": "zh-cn",
    "Authorization": "Bearer 62cbbe058449d3db514c7aece09afe0c13d0e501ed07624478704405d6cef617200823a164c086b87153edbba7acabcbc78c475c53a19a89df10cc2f872855a8",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16B92",
    'Cookie': shimoCookie
};


async function tryCatch(promise) {
    try {
        const ret = await promise
        return [ret, null]
    } catch (e) {
        return [null, e]
    }
}

function http(config) {
    return tryCatch(
        axios.create({
            // timeout: 1500,
            transformRequest: [data => Qs.stringify(data)]
        })(config)
    )
}

function KB2GB(KB) {
    return (KB / (1024 * 1024 * 1024)).toFixed(2);
}

async function getDiscussion(fileID) {
    var content, list;
    var contentList = [];
    var headers = {
        "Accept": "*/*",
        "Accept-Encoding": "br, gzip, deflate",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Referer": "https://shimo.im/docs/K8CWmBMqMtYYpU1f",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.1 Safari/605.1.15",
        "X-CSRF-Token": "JDvV3azC-fmyRaI4kR98csJiXEhmprm78WMw",
        "Cookie": shimoCookie + "_csrf=q4MNRquXrxATGBLCwExHVcIs;"
    }

    const [resp, error] = await http({
        method: "get",
        url: `https://shimo.im/smapi/files/${fileID}/discussions?limit=99999999`,
        headers: headers,
    })
    if (error) {
        return console.log("getDiscussion请求出错: " + error);
    }
    // console.log("getDiscussion请求成功");

    list = resp.data.data.list;

    for (var i in list) {
        var item = list[i];
        contentList.push(item.data.content);
    }
    // console.log(contentList);

    //contentList.reverse();//顺序倒过来，正常来说最新的内容在最上面
    //console.log(contentList.join("\n"));
    return contentList;
}

async function getAttachment(fileID) {
    //var origUrl = "https://api.shimo.im/files/" + fileID + "?contentUrl=true";
    //var origResp = UrlFetchApp.fetch(origUrl);
    //var contentUrl = JSON.parse(origResp).contentUrl;
    //console.log(contentUrl);


    var url = "https://api.shimo.im/files/" + fileID + "?content=true";
    const [resp, error] = await http({
        method: "get",
        url: url,
        headers: genericHeaders,
    });
    if (error) {
        return console.log("getAttachment请求出错: " + error);
    }
    // console.log("getAttachment请求成功 ");



    var attachmentsList = [];
    var orig = resp.data.content;
    orig = JSON.parse(orig);

    for (var i = 0; i < orig.length; i++) {
        var attachment = orig[i][1].attachment;
        if (attachment) {
            attachmentsList.push(attachment);
            // var name = attachment.name;
            // var url = attachment.url;
        }
    }

    // console.log(attachmentsList);

    return attachmentsList;
}


async function postDiscussion(fileID, content) {


    const [resp, error] = await http({
        method: "post",
        url: "https://shimo.im/smapi/files/" + fileID + "/discussions",
        headers: {
            "Cookie": shimoCookie,
        },
        data: {
            'content': content
        },
    })
    if (error) {
        return console.log("Discussion请求出错: " + error);
    };

    if (resp.data.code !== 0) {
        console.log('讨论上传失败，错误信息：『' + resp.message + '』\n' + "详情请查看：" + "https://shimo.im/docs/" + fileID);
        return "error";
    } else {
        return resp.data;
    }


}

async function shortenURL(input) {

    var longURL = input.match(/[a-zA-z]+:\/\/[^\s]*/g);

    for (i = 0; i < longURL.length; i++) {
        var url = 'http://api.weibo.com/2/short_url/shorten.json?source=2849184197&url_long=' + encodeURIComponent(longURL[i]);
        var response = await axios.get(url);
        var json = response.data;
        var shortURL = json['urls'][0]["url_short"];
        var input = input.replace(longURL[i], shortURL);
    }
    // console.log(clearHTTP);
    return input;
}

function cutHTTP(input) {
    return input.replace(/[a-zA-z]+:\/\//g, '');
}

async function googleTranslateByPost(orig) {

    var sl = 'auto';
    var tl = 'zh-CN';
    try {
        var response = await axios({
            method: 'POST',
            url: "http://translate.google.cn/translate_a/single",
            params: { "dt": "t", "q": orig, "tl": tl, "ie": "UTF-8", "sl": sl, "client": "ia", "dj": "1" },
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "br, gzip, deflate",
                "Accept-Language": "zh-cn",
                "Connection": "keep-alive",
                "Cookie": "NID=154=Vf6msfWVov9Icm1WMYfq3dQ3BGHUlq6Txh5RHjnBtN48ZIZAdE_iQjxrrOMsOhbRlXXHtReYEm1rRKGUD3WsP1DhA0sO0nDf5S-J69qEBYRzIAY8nd1cE20wAKOr3cXxxPgwN12Dc5ly07v-F7RY-6Uv3ldkWGYeXWTgwkPR6Cs",
                "Host": "translate.google.cn",
                "User-Agent": "GoogleTranslate/5.26.59113 (iPhone; iOS 12.1; zh_CN; iPhone10,3)"
            }
        });

        var i;
        var output = '';
        var trans = response.data.sentences;
        if (trans.length > 1) {
            for (i = 0; i < trans.length; ++i) {
                output += trans[i]['trans'] + '\n';
            }
        }
        else {
            output = trans[0]['trans'];
        }
        console.log("谷歌翻译成功结果：" + output);
        return output;
    } catch (e) {
        console.log("谷歌翻译失败");
        return orig;
    }

}

function emoji(suffix) {
    var emoji;

    if (suffix.match(/[a-zA-Z]/g)) {
        if (suffix.match(/mp4|mov|avi/ig)) {//根据后缀给出emoji
            emoji = "🎬";//常规视频文件
        } else if (suffix.match(/webm|mkv|avi/ig)) {
            emoji = "▶️";//手机无法播放的非常规视频文件
        } else if (suffix.match(/mp3|ogg|wav|flac|ape|alca|aac/ig)) {
            emoji = "🎵";//音频文件
        } else if (suffix.match(/zip|7z|rar/ig)) {
            emoji = "📦";//压缩包
        } else if (suffix.match(/dmg|iso/ig)) {
            emoji = "💽";//光盘映像
        } else if (suffix.match(/ai|psd|aep/ig)) {
            emoji = "📐";//工程文件
        } else if (suffix.match(/ppt|pptx|key/ig)) {
            emoji = "📽️";//演示文件
        } else if (suffix.match(/ttf|otf/ig)) {
            emoji = "🔤️";//字体文件
        } else if (suffix.match(/doc|pdf/ig)) {
            emoji = "️📄";//文档
        } else {
            emoji = "❓";//未知格式
        }
    } else {
        emoji = suffix;
    }
    return emoji;
}





async function update(newDiscussionID, getAttachmentID) {//更新上传专用的石墨文档的项目是否与评论区同步
    var joinList, realName, name, attachment, attachmentsList, content, dic;
    var result = [];
    var sumSize = 0;
    var count = 0;
    var list = await getDiscussion(newDiscussionID);//post评论区的文档
    var total = list.length;


    attachmentsList = await getAttachment(getAttachmentID);//get附件的文档




    if (list.length != 0) {//检测评论区目标是否一条评论都没有
        joinList = list.join("\n");
    } else {
        joinList = "";
    }

    for (var j in list) {
        if ((list[j]).match("size")) {
            sumSize += Number(JSON.parse(list[j]).size);
        }
    }


    attachmentsList.forEach(async e => {

        var attachment = e;
        var realName = attachment.name.split(".");
        var type = realName.pop();
        var name = realName.join('.');


        if (joinList.match(attachment.url)) {//查重检测
            // console.log("跳过重复文件:"+attachment.name);
            return;
        }

        var params = {
            type: type,
            name: name,
            size: attachment.size,
            uploaderURL: attachment.url
        }

        var output = await save2DataBase(params);

        result.push(output);
    })

    //统计评论区里面的文件上传总数和累计已上传的体积
    var count = result.length;
    if (count != 0) {
        console.log("共增加" + count + "个新项目" + "，已上传 " + (total + count) + " 个文件，累计 " + KB2GB(sumSize) + " GB");
        console.log('\n' + result.join('\n') + '\n');
    } else {
        console.log("已上传 " + total + " 个文件，累计 " + KB2GB(sumSize) + " GB");
    }
    return result;
    //newRevert(getAttachmentID,dataHistoryID);//更新完成后，马上清空「上传专用」文档，清零作用
}

async function save2DataBase(params) {

    params.shortURL = await shortenURL(params.uploaderURL);
    params.name_trans = await googleTranslateByPost(params.name.toLowerCase());
    
    content = JSON.stringify(params);

    var resp = await postDiscussion(newDiscussionID, content);//上传到评论区

    params.id = resp.data.id;
    params.unixus = resp.data.unixus;

    AV.Cloud.run('save2LeanCloud', params);//上传到leancloud的数据储存

    var output = `${emoji(params.type)} ${params.name} | ${cutHTTP(params.shortURL)}`;//输出到控制台

    return output
}

async function updateShimo(request) {

    var feedback;



    if (request && request.params.code == 0)//如果传入了石墨上传成功后返回的参数(code:0),那么就直接进行save2DataBase,否则就进行常规的update
    {

        var e = request.params.data;
        console.log('\033[1;31;47m已经成功传入updateShimo这里了\033[0m');

        var chosenClass = request.params.class || 'ShimoBed';

        var params = {
            type: e.type,
            name: e.name,
            size: e.size,
            uploaderURL: e.url,
            lottieURL: request.params.lottieURL,
            chosenClass: chosenClass,
        }

        // console.log(params);

        save2DataBase(params);
        feedback = [params];
    } else {

        feedback = await update(newDiscussionID, getAttachmentID);
    }

    return feedback//返回更新了多少个文件

}


require('../tools/identifier.js').run({
    rules: '!vscode||local',
    func: () => {
        updateShimo();
    }
}) 