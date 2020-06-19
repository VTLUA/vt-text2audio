## NodeJs + express 实现文本合成语音功能
*初稿*

#### 结构
在目录下创建app.js和用来存放音频的目录static

#### 安装express和baidu-aip-sdk百度API接口
```
  npm i express --save
  npm i baidu-aip-sdk --save

```

#### app.js
```
let fs = require('fs');   // 引入fs模块
let express = require('express'); // 引入express
let AipSpeechClient = require("baidu-aip-sdk").speech;  // 引入百度API语音合成

// 设置APPID/AK/SK （PS：可以前往百度API的控制台拿到一下的ID和KEY https://login.bce.baidu.com/?account=&redirect=http%3A%2F%2Fconsole.bce.baidu.com%2F）
let APP_ID = '******';
let API_KEY = '******************';
let SECRET_KEY = '*******************';

// 实例化对象
let client = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY);


 // 调用接口生成音频文件的方法
function crateAudio (text) {
    // 返回一个Promise对象
    return new Promise((resolve, reject) => {
        client.text2audio(text).then(function (result) {
            if (result.data) {
                let time = new Date().getTime();
                // 利用fs.writeFileSync同步把音频写入audio目录
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


let app = express();

// 静态资源中间件
app.use(express.static('static'));

// 跨域处理
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', '*');
    res.append('Access-Control-Allow-Content-type', '*');
    next();
})

// 首页
app.get('/', (req, res) => {
    res.send('语音合成');
})

// 写一个get接口
app.get('/api/audio', async (req, res) => {
    // 获取前端URL带过来的text
    let text = req.query.text;
    // 调用封装好的方法crateAudio进行文字转音频
    let audioLink = await crateAudio(text);
    res.json({audioLink});
})

// 启动一个本地服务
app.listen(6666, () => {
    console.log('server start : ', 'http://localhost:6666');
})

```

#### 调试
打开http://localhost:6666/api/audio?text=这是转成音频的内容