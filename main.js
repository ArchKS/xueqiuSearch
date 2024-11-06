const { searchSpecInvestorsArticle } = require('./getData')




let listObj = [
    {
        uid : '2864315423',
        kw :'药明',
        name: '行藏'
    },
    {
        uid : '1429872781',
        kw :'药明',
        name: 'LTLyra'
    }
]


const sortfields = {
    '转赞评': `reply_count,reply_count,fav_count,like_count`,
    '文章长度': 'text'
}

listObj.forEach(async (obj)=>{
    let mark = await searchSpecInvestorsArticle(obj,sortfields)
})