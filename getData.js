
// https://xueqiu.com/v4/statuses/user_timeline.json?page=8&user_id=2807872168&type=0&_=1717478351392



// =================== dependencies ===================================
const { service } = require('./service')
const fs = require('fs');
const XLSX = require('xlsx-js-style');
const regex = /<[^>]*>/g;



// ======================= code ===================================
String.prototype.removeTag = function () {
    return this.replace(regex, '').trim();
};

String.prototype.removeStock = function () {
    return this.replace(/\$.*?\$/g, '').trim();
};



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

const simpifyList = (list, kw) => {
    return list
        .filter(item => item.title.removeTag().includes(kw) || item.text.removeTag().includes(kw))
        .map(item => ({
            '标题': item.title.removeTag().removeStock() || item.text.removeStock().removeTag().slice(0, 20),
            '链接': `https://xueqiu.com${item.target}`,
            '日期': new Date(item.created_at).toLocaleDateString(),
            '得分': item.score,
            '正文': item.text
        }));
};


// 将对象数组转换为数组的数组
const getArrayData = (data) => {
    let arrayData = [];
    let headers = Object.keys(data[0]); // 获取对象的键作为表头

    arrayData.push(headers.map(header => header)); // 添加表头

    data.forEach(item => {
        let row = headers.map(header => item[header]);
        arrayData.push(row);
    });

    return arrayData
}




const setArrToExcel = (list, obj, sortfields) => {
    let workbook = XLSX.utils.book_new();
    Object.keys(sortfields).forEach(key => {
        let fmtList = sortSearchData(list, sortfields[key]);
        let smpList = simpifyList(fmtList, obj.kw);
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
        ['A1', 'B1', 'C1', 'D1', 'E1'].forEach(cell => {
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
    XLSX.writeFile(workbook, `${obj.fileName}.xlsx`);
    console.log(`save to ${obj.fileName}.xlsx`);
}

const processDataFromFile = (obj) => {

    fs.readFile(obj.fileName + '.json', 'utf8', (err, data) => {
        if (err) {
            console.error('读取文件时出错:', err);
            return;
        }
        try {
            const list = JSON.parse(data);
            setArrToExcel(list, obj);
        } catch (parseErr) {
            console.error('解析JSON时出错:', parseErr);
        }
    });
}





const searchSpecInvestorsArticle = (obj, sortfields) => {
    return new Promise(async (resolve, reject) => {
        obj.fileName = `./data/${obj.name}_${obj.kw}`;

        let url = `https://xueqiu.com/query/v1/user/status/search.json?q=${obj.kw}&page=1&uid=${obj.uid}&sort=time&comment=0&_=${new Date().getTime()}`;

        let { maxPage, list } = await service.get(url);
        console.log(`url:${url}`);
        for (let p = 2; p <= maxPage; p++) {
            url = `https://xueqiu.com/query/v1/user/status/search.json?q=${obj.kw}&page=${p}&uid=${obj.uid}&sort=time&comment=0&_=${new Date().getTime()}`;
            let { list: addList } = await service.get(url);
            list = [...addList, ...list];
            console.log(`${p}/${maxPage}页`);
        }
        // saveDataToFile(list, `${obj.fileName}.json`);
        // processDataFromFile(obj);
        setArrToExcel(list, obj, sortfields);

        resolve(true);
    })


}




module.exports = {
    searchSpecInvestorsArticle
}