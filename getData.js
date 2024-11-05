
// https://xueqiu.com/v4/statuses/user_timeline.json?page=8&user_id=2807872168&type=0&_=1717478351392


const UID = '1429872781';
const KEYWORD = '药明';
const SortFieldObj = {
    '转赞评': `reply_count,reply_count,fav_count,like_count`,
    '文章长度': 'text'
}






// =================== dependencies ===================================
const { service } = require('./service')
const fs = require('fs');
const moment = require('moment');
const XLSX = require('xlsx-js-style');
const regex = /<[^>]*>/g;
const fileName = `./data/xueqiu_search_${UID}_${KEYWORD}`;
const jsonFile = `${fileName}.json`;

// ======================= code ===================================
String.prototype.removeTag = function () {
    return this.replace(regex, '').trim();
};

String.prototype.removeStock = function () {
    return this.replace(/\$.*?\$/g, '').trim();
};

const getXueqiuData = (id, page) => new Promise((resolve, reject) => {
    let url = `https://xueqiu.com/v4/statuses/user_timeline.json?page=${page}&user_id=${id}&type=0&_=${new Date().getTime()}`;
    service.get(url).then(r => {
        resolve(r);
    })
});


const saveDataToFile = (val, filePath) => {
    let jsonData;
    if (typeof val === 'object') {
        jsonData = JSON.stringify(val, null, 2);
    } else {
        jsonData = val;
    }
    fs.writeFile(filePath, jsonData, (err) => {
        if (err) {
            console.error('写入文件时出错:', err);
        } else {
            console.log('JSON数据写入成功');
        }
    });

}

const processDataItem = (item) => {
    let mainField = [
        "title",
        "description",
        "created_at",
        "edited_at",
        "target",
        "mark",
        // ----
        "reply_count", // 评论数
        "retweet_count", // 转发数
        "like_count", // 点赞数
        // "view_count", // 自己才有的阅读数
        // "reward_count",
        // "fav_count",
        // "reward_amount",
        // "reward_user_count",
    ]

    let obj = {};
    mainField.forEach(key => {
        let val = item[key];
        if (key === 'target') {
            val = 'https://xueqiu.com' + item[key];
        }
        if (key == 'created_at' || key == 'edited_at') {
            val = item[key];
            if (val) {
                val = moment(val).format('YYYY/MM/DD HH:mm')
            }
        }
        obj[key] = val;
    });
    return obj;
}


const sortSearchData = (list, sortField) => {
    /* 
        reply_count, 评论
        retweet_count, 转发
        view_count, 阅读
        created_at,
        fav_count, 收藏
        like_count, 点赞
        text
        target,

        转赞评：retweet_count
         */

    const getFieldValue = (item, field) => {
        let val = item[field];
        if (typeof val === 'string' && !/^\d+$/.test(val)) {
            val = val.removeTag().removeStock().length;
        } else {
            val = parseInt(val) || 0;
        }
        return val;
    };


    list = list.map(item => ({
        ...item,
        score: sortField.split(',').reduce((pre, cur) => pre + getFieldValue(item, cur), 0)
    }));

    return list.sort((a, b) => b.score - a.score);
}

const simpifyList = (list, keywords) => {
    return list
        .filter(item => item.title.replace(regex, '').includes(keywords) || item.text.replace(regex, '').includes(keywords))
        .map(item => ({
            '标题': item.title.removeTag().removeStock() || item.text.removeStock().removeTag().slice(0, 20),
            '链接': `https://xueqiu.com${item.target}`,
            '日期': new Date(item.created_at).toLocaleDateString(),
            '得分': item.score,
            '正文': item.text.removeStock().removeTag()
        }));
};


const getArrayData = (data) => {
    // 将对象数组转换为数组的数组
    let arrayData = [];
    let headers = Object.keys(data[0]); // 获取对象的键作为表头

    arrayData.push(headers.map(header => header)); // 添加表头

    data.forEach(item => {
        let row = headers.map(header => item[header]);
        arrayData.push(row);
    });

    return arrayData
}


// 自动计算列宽
const getMaxColumnWidth = (data) => {
    const columnWidths = [];
    data.forEach(row => {
        row.forEach((cell, colIndex) => {
            const cellLength = String(cell).length; // 获取单元格内容的长度
            if (!columnWidths[colIndex] || cellLength > columnWidths[colIndex]) {
                columnWidths[colIndex] = cellLength; // 更新最大宽度
            }
        });
    });
    return columnWidths.map(width => ({ wpx: width * 8 })); // 乘以10以增加宽度
};


const setArrToExcel = (list) => {
    let workbook = XLSX.utils.book_new();
    Object.keys(SortFieldObj).forEach(key => {
        let fmtList = sortSearchData(list, SortFieldObj[key]);
        let smpList = simpifyList(fmtList, KEYWORD);
        let arrayData = getArrayData(smpList);

        // 将数组数据转换为工作表
        let worksheet = XLSX.utils.aoa_to_sheet(arrayData);

        // worksheet['!cols'] = getMaxColumnWidth(arrayData); // 设置列宽
        worksheet['!cols'] = [
            { wpx: 300 }, // 第一列宽度 标题
            { wpx: 260 },  // 第二列宽度 链接
            { wpx: 60 },  // 日期 
            { wpx: 50 },  // 得分
            { wpx: 1800 },  // 正文
        ];

        const headerStyle = {
            fill: {
                patternType: 'solid',
                fgColor: { rgb: '1f497d' },
            },
            font: {
                color: { rgb: 'ffffff' }, // 红色字体
                bold: true
            },
        };

        // 应用样式到表头
        ['A1', 'B1', 'C1', 'D1','E1'].forEach(cell => {
            worksheet[cell].s = headerStyle;
        });


        // 设置B列超链接，但代码不生效
        // const startRow = 2;
        // for (let row = startRow; row <= 199; row++) {
        //     const cellRef = 'B' + row; // 获取当前单元格的引用，例如'B2', 'B3', ...
        //     worksheet[cellRef].l = {
        //       target: "https://www.example.com", // 超链接的目标URL
        //       tooltip: "Visit Example", // 鼠标悬停时的提示
        //     };
        //   }

        // 构造工作簿并添加工作表

        XLSX.utils.book_append_sheet(workbook, worksheet, key);

    })
    // 将工作簿写入Excel文件
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    console.log(`save to ${fileName}.xlsx`);
}

const processDataFromFile = () => {

    fs.readFile(jsonFile, 'utf8', (err, data) => {
        if (err) {
            console.error('读取文件时出错:', err);
            return;
        }
        try {
            const list = JSON.parse(data);
            setArrToExcel(list, KEYWORD);
        } catch (parseErr) {
            console.error('解析JSON时出错:', parseErr);
        }
    });
}





const searchSpecInvestorsArticle = async () => {
    let url = `https://xueqiu.com/query/v1/user/status/search.json?q=${KEYWORD}&page=1&uid=${UID}&sort=time&comment=0&_=${new Date().getTime()}`;

    if (fs.existsSync(jsonFile)) { // 文件存在
        processDataFromFile();
    } else {
        let { maxPage, list } = await service.get(url);
        console.log(`url:${url}`);
        for (let p = 2; p <= maxPage; p++) {

            url = `https://xueqiu.com/query/v1/user/status/search.json?q=${KEYWORD}&page=${p}&uid=${UID}&sort=time&comment=0&_=${new Date().getTime()}`;
            let { list: addList } = await service.get(url);
            list = [...addList, ...list];
            console.log(`${p}/${maxPage}页`);
        }
        saveDataToFile(list, `./data/xueqiu_search_${UID}_${KEYWORD}.json`);

        processDataFromFile();
    }


}

const MainFunc = async () => {
    let id = '1505944393';
    let { maxPage } = await getXueqiuData(id);
    let jsonArr = [];
    for (let p = 1; p <= maxPage; p++) {
        let { statuses } = await getXueqiuData(id, p);
        statuses = statuses.map(item => processDataItem(item));
        jsonArr = [...statuses, ...jsonArr];
        console.log(`${p}/${maxPage}页`);
    }

    jsonArr = jsonArr.filter(item => item.mark == 0);
    jsonArr = jsonArr.map(item => {
        delete item.mark;
        return item;
    });

    console.log('共' + jsonArr.length + "组数据");
    saveDataToFile(jsonArr, `./data/xueqiu${id}.json`);
}


searchSpecInvestorsArticle();