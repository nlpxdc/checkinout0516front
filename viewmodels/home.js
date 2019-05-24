var app = new Vue({
    el: '#app',
    data: {
        code: ''
    },
    mounted() {
        var url = new URL(location.href);
        console.log(url);
        var codestr = url.searchParams.get('code');
        console.log(codestr);
        this.code = codestr;
    },
    methods: {
        getToken() {
            axios.get('/user/getToken', {
                params: {
                    code: this.code
                }
            })
                .then(function (response) {
                    console.log('success: ', response);

                    const auth = response.data;
                    const wechat_access_token = auth.access_token;
                    const openid = auth.openid;

                    Cookies.set('wechat_access_token', wechat_access_token);
                    Cookies.set('openid', openid);

                    localStorage['wechat_access_token'] = wechat_access_token;
                    localStorage['openid'] = openid;

                    sessionStorage['wechat_access_token'] = wechat_access_token;
                    sessionStorage['openid'] = openid;
                })
                .catch(function (error) {
                    console.log('error: ', error);
                });
        },
        handleGetToken(){
            console.log('get token click');
            this.getToken();
        },
        handleGotoCheckPage(){
            console.log('check page click');
            location.href = 'UserCheck.html';
        }
    }
})