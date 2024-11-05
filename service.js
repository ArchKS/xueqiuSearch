
const axios = require('axios')
const service = axios.create({});

service.interceptors.request.use(
    config => {
        config.headers['Cookie'] = 'cookiesu=491712886810042; device_id=30c7ee7935eada3e4b1a21f4861e4975; smidV2=202404120953313538c7fbaa20b5bcee2c6f991de05241000a28d9f78361fb0; s=b415hdamqr; xq_is_login=1; u=3629171097; bid=0cb4d5daf93ad17128b32853f90d3be5_lvdgg5e2; _ga=GA1.2.2146642041.1715911844; _ga_M96YC1H9CR=GS1.1.1717054163.2.0.1717054461.0.0.0; __utmz=1.1717133805.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utma=1.2146642041.1715911844.1723531683.1727329447.18; _c_WBKFRo=0rTnarSsXwgmrc7VmbL8xbV6EZV2HAWL92de6dtf; xq_a_token=367f84c8c2ca68d368c77cdc677149baa2e64b8e; xqat=367f84c8c2ca68d368c77cdc677149baa2e64b8e; xq_id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOjM2MjkxNzEwOTcsImlzcyI6InVjIiwiZXhwIjoxNzMyMjUxNzI4LCJjdG0iOjE3Mjk2NTk3MjgwMzYsImNpZCI6ImQ5ZDBuNEFadXAifQ.a4f-lktgcAllfqBZVl_kXSaV_Lta9qbOAq0Gy_pbqqe3mlTyoI2CICOq55AW4wvmNS2EWkK-QPKFy4pY91v8rE1FsJkB8NBjBf9URq3g_osGhLJej4UWgdL-Cb3Zy0mgYXdp5rpT75EPUkCtvYxyqFELS_WQPc9zJwxDwrhRKI8LUZNwvQPn4acxhdM8Si7Hzh_-Mgwl4uHsCTCPtSyPHRnKS0stwCdiy4z_ug0WJmrK0pcR6oKbbSRQ4eIeFSn577b06dIPnk9AUChRjrMx5u1vSwj_CQg76rl0p0ZuI31yjRByVKLG8y7nkH_3x_-hjx0vFxLbBupmrKKrGTltYQ; xq_r_token=72ad3f1d93c357e9ecda599ce78d91291c410ce4; Hm_lvt_1db88642e346389874251b5a1eded6e3=1729558854,1730179309,1730699146,1730711290; HMACCOUNT=7CFDEF721D2E470D; acw_tc=2760827617307858933547188ebf22fd73a1ab2c1850cafc906cc600b7622c; is_overseas=0; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1730785894; .thumbcache_f24b8bbe5a5934237bbc0eda20c1b6e7=SQ4RksmBN646Ncw29++P1ZcthfZUTb/6oj3r1qbVt46h8b2rRBU8v7Vrj4g8iWqLdmCFLfpL8s0JHLjNwii2Pg%3D%3D; ssxmod_itna=YqRx9DuDcDB0m4eq0Lx0PDQ92Q4UxxuwEhGmxGIUtD/+WID3q0=GFDf47fE8WKj37KADw4PjY+YANHXKBbmxFeileqdG3xCPGnIa6whoD44GTDt4DTD34DYDixibuDiHQDjxGp9u6sV=Dbxi361qDYxDr61KDRxi7DD5DA2PDwx0C6pDK0hxDBhrA7iDD4x0i3iY+C27Qab54YKre6xG1H40H3GdviIMU7j5+2tLGjCKDXhQDv1HQl=TpFDHsBo7PA0RDfDnDQQ2rrGieNG4KY7G3tADeN7G7XGxg+G0BLDeP7DDWDhXDD==; ssxmod_itna2=YqRx9DuDcDB0m4eq0Lx0PDQ92Q4UxxuwEhGmxGItG9F2DBkP7Q7GcDeqTD==';
        return config
    },
    error => {
        Promise.reject(error)
    }
);


service.interceptors.response.use(
    // response => response,
    response => {
        if (response && response.status === 200) {
            return response.data
        }
    },
    error => {
        console.log(error);
        return Promise.reject('error - 01')
    }
)


module.exports = {
    service
}