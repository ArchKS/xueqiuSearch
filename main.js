const { searchSpecInvestorsArticle } = require('./getData')
const fs = require('fs').promises;
const path = require('path');

const htmlPath = 'index.html';

async function listFilesInDirectory(directory) {
  try {
    // 读取目录内容
    const entries = await fs.readdir(directory, { withFileTypes: true });

    // 过滤出文件，排除目录
    const files = entries.filter(entry => entry.isFile());

    // 打印文件名
    let filePath = files.map(v=>`<a href="?file=/data/${v.name}" target="_blank">${v.name}</a><br>`).join('\n');

    const content = await fs.readFile(htmlPath, 'utf8');
    const regex = /\<\!-- render --\>[\s\S]*?\<\!-- render --\>/g;
    const newContentWithRegex = content.replace(regex, `<!-- render --> \n ${filePath} \n <!-- render -->`);

    await fs.writeFile(htmlPath, newContentWithRegex, 'utf8');
    console.log('Content replaced successfully.');

  } catch (error) {
    console.error('Error reading directory:', error);
  }
}



// 本地: http://localhost:3142/index.html?file=%E8%A1%8C%E8%97%8F_%E8%8D%AF%E6%98%8E
// 部署:  https://vercel.com/archks-projects/xueqiu-search
// 外部:  https://xueqiu-search.vercel.app/index.html?file=%E8%A1%8C%E8%97%8F_%E8%8D%AF%E6%98%8E


let listObj = [
    {
        uid: '8790885129',
        kw: '神华',
        name: '超级鹿鼎公'
    },
    {
        uid: '1505944393',
        kw: '神华',
        name: '雪月霜'
    },
    {
      uid: '7123126150',
      kw: '神华',
      name: '子洲'
    }
]


const sortfields = {
    '文章长度': 'text',
    '转赞评': `reply_count,reply_count,fav_count,like_count`,
}


const main = async ()=>{

    for (let obj of listObj) {
        await searchSpecInvestorsArticle(obj, sortfields);
    }
    
    // 替换成你的data文件夹的路径
    const dataDirectory = path.join(__dirname, 'data');
    listFilesInDirectory(dataDirectory);
}


main();