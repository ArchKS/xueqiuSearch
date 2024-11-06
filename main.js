const { searchSpecInvestorsArticle } = require('./getData')

// 本地: http://localhost:3142/index.html?file=%E8%A1%8C%E8%97%8F_%E8%8D%AF%E6%98%8E
// 部署:  https://vercel.com/archks-projects/xueqiu-search
// 外部:  https://xueqiu-search.vercel.app/index.html?file=%E8%A1%8C%E8%97%8F_%E8%8D%AF%E6%98%8E


let listObj = [
    {
        uid: '2864315423',
        kw: '药明',
        name: '行藏'
    },
    {
        uid: '1429872781',
        kw: '药明',
        name: 'LTLyra'
    }
]


const sortfields = {
    '文章长度': 'text',
    '转赞评': `reply_count,reply_count,fav_count,like_count`,
}



for (let index = 0; index < listObj.length; index++) {
    (async () => {
        let obj  = listObj[index];
        let mark = await searchSpecInvestorsArticle(obj, sortfields)
    })();
}