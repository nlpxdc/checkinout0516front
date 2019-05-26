app = new Vue({
    el: '#app',
    data: {
        ticket: 'LIKLckvwlJT9cWIhEQTwfJuU557garB7J1tppEvMocWYceaaflsOr_IsIMyzBF5AcbOXObAKaeDhZLIm3GjpTg',
        appId: 'wx0c14a6dfeab19166',


        openid: '',
        currentLatitude: '',
        currentLongitude: '',
        selectedCheckType: '',
        checkTypes: [
            {
                label: '上班打卡',
                value: '0'
            },
            {
                label: '下班打卡',
                value: '1'
            }
        ],
        checkEnabled: true

    },
    computed: {
        currentTime() {
            return Date.now();
        },
        nonceStr() {
            return Math.random().toString(16).substr(2);
        },
        originParams() {
            const originParams =
                'jsapi_ticket=' + this.ticket
                + '&noncestr=' + this.nonceStr
                + '&timestamp=' + this.currentTime
                + '&url=' + location.href;

            return originParams;
        },
        signature() {
            const shaObj = new jsSHA("SHA-1", "TEXT");
            shaObj.update(this.originParams);
            const signature = shaObj.getHash("HEX");
            return signature;
        },
        checkBtnText() {
            var text = '';
            switch (this.selectedCheckType) {
                case '0':
                    text = '签到';
                    break;
                case '1':
                    text = '签退';
                    break;

                default:
                    break;
            }
            return text;
        }
    },
    mounted() {
        console.log('view mounted');

        wx.config({
            debug: false,
            appId: this.appId,
            timestamp: this.currentTime,
            nonceStr: this.nonceStr,
            signature: this.signature,
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
            app.getLocation();
        });

        this.openid = localStorage['openid'];
        this.getCurrentStatus();
    },
    methods: {
        getLocation() {
            wx.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function (res) {
                    console.log(res);
                    app.currentLatitude = res.latitude;
                    app.currentLongitude = res.longitude;
                    console.log(res.latitude, res.longitude);
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
        },
        getCurrentStatus() {
            axios.get('/user/getCurrentStatus', {
                params: {
                    openid: 'oUwXe58JsPM6MBFsI3YvnbFIpg-8'
                }
            })
                .then(function (response) {
                    console.log(response);
                    var currentStatus = response.data;
                    switch (currentStatus) {
                        case 0:
                            console.log('00000000000')
                            app.selectedCheckType = '0';
                            break;
                        case 1:
                            console.log('111111111111');
                            app.selectedCheckType = '1';
                            break;
                        default:
                            break;
                    }
                    console.log('current status', currentStatus);
                    console.log('select check type', app.selectedCheckType);
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        handleCheck() {
            console.log('check click');
            axios.post('/user/check', null, {
                params: {
                    openid: this.openid,
                    type: this.selectedCheckType
                }
            })
                .then(function (response) {
                    console.log(response);
                    alert('打卡成功');
                })
                .catch(function (error) {
                    console.log(error);
                    alert('打卡失败');
                });
        }
    }
})


