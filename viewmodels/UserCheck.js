console.log('load wechat.js');

// const access_token = '17_Wi7SeShqk1mfoZhLCjtH9Xpd56-0gFoqKTw86Ni4jWzfXNUoOBco5eTRo_BohtfogQR3sqJTSQXuIhRrEG-cqM8nvyIKVr3jS9BF6cSZG-QuftGgZ5-dXUpjG7DdqGr3HNAPT1ga9_aoo8NEGOQiAAAUCE';
const ticket = 'LIKLckvwlJT9cWIhEQTwfJuU557garB7J1tppEvMocVgGqpkkOvxHkNCo54beFYVgLWZPJljfaw7XllFMlkI0A';
console.log('ticket:',ticket)

const appId = 'wx0c14a6dfeab19166';
const timestamp = Date.now();
const nonceStr = Math.random().toString(16).substr(2);

const url = location.href;
console.log(url);

const originParams =
    'jsapi_ticket=' + ticket
    + '&noncestr=' + nonceStr
    + '&timestamp=' + timestamp
    + '&url=' + url;

var shaObj = new jsSHA("SHA-1", "TEXT");
shaObj.update(originParams);
var signature = shaObj.getHash("HEX");

wx.config({
    debug: false,
    appId: appId,
    timestamp: timestamp,
    nonceStr: nonceStr,
    signature: signature,
    jsApiList: [
        'getLocation'
    ]
});

wx.error(function (res) {
    console.log('wx error');
    console.log(res);
});

wx.ready(function () {
    console.log('wx ready');

    app = new Vue({
        el: '#app',
        data: {
            currentLatitude: '',
            currentLongitude: '',
            selectedCheckType: '',
            checkTypes: [
                {
                    label: '上班打卡',
                    value: 0
                },
                {
                    label: '下班打卡',
                    value: 1
                }
            ],
            checkEnabled: true

        },
        computed: {
            currentTime() {
                return Date.now();
            }
        },
        mounted() {
            console.log('view mounted');
            this.getLocation();
        },
        methods: {
            getLocation() {
                wx.getLocation({
                    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function (res) {
                        console.log(res);
                        app.currentLatitude = res.latitude;
                        app.currentLongitude = res.longitude;
                        console.log(res.latitude,res.longitude);
                        console.log(app.currentLatitude, app.currentLongitude);
                        app.canCheck(app.currentLatitude, app.currentLongitude);
                    },
                    fail: function (error) {
                        console.error(error);
                    }
                });
            },
            canCheck(latitude, longitude) {
                console.log('call can check');
                axios.get('/user/canCheck', {
                    params: {
                        latitude: latitude,
                        longitude: longitude
                    }
                })
                    .then(function (response) {
                        console.log(response);
                        app.checkEnabled = false;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }
    })
});


