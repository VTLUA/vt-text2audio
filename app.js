let fs = require('fs');
let express = require('express');
let AipSpeechClient = require("baidu-aip-sdk").speech;

// 设置APPID/AK/SK
let APP_ID = '******';
let API_KEY = '******************';
let SECRET_KEY = '*******************';

// 实例化对象
let client = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY);

function crateAudio (text) {
    return new Promise((resolve, reject) => {
        // 调用接口生成音频文件
        client.text2audio(text).then(function (result) {
            if (result.data) {
                let time = new Date().getTime();
                fs.writeFileSync(`static/audio/voice${time}.mp3`, result.data);
                resolve(`audio/voice${time}.mp3`);
            } else {
                reject('文件输入出错');
            }
        }, function (err) {
            reject(err);
        })
    })
}


// 搭建后端
let app = express();

// 静态资源中间件
app.use(express.static('static'));

// 跨域处理
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', '*');
    res.append('Access-Control-Allow-Content-type', '*');
    next();
})

app.get('/', (req, res) => {
    res.send('语音合成');
})

app.get('/api/audio', async (req, res) => {
    // 获取前端文本
    let text = req.query.text;
    let audioLink = await crateAudio(text);
    res.json({audioLink});
})

app.listen(9999, () => {
    console.log('server start : ', 'http://localhost:9999');
})