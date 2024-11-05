function calculateAverage(arr) {
    // 检查数组是否为空
    if (arr.length === 0) {
        return 0; // 或者抛出错误，或者返回null等，根据需要处理
    }

    // 使用reduce方法累加数组中的所有元素
    const sum = arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    // 计算平均值
    const average = sum / arr.length;

    return average.toFixed(2);
}

const averageList = (list, count) => {
    // 第一个和最后一个都是用count倍的自己
    // 
    // 左右补位，左边补第一个元素，补count-1个，右边补左右一个元素，补count-1个
    let leftArr = new Array(count - 1).fill(list[0]);
    let rightArr = new Array(count - 1).fill(list[list.length - 1]);
    let newList = [...leftArr, ...list, ...rightArr];
    // for (let index = 0; index < list.length; index++) {
    // }
    return list.map((item, index) => {
        let start = index + Math.floor(count / 2);
        let end = start + count;
        let spliceArr = newList.slice(start, end);
        let v = calculateAverage(spliceArr)
        // console.log(v, spliceArr);
        return v;
    });
}



var getOption = (dataArr, uid) => {
    let xAxis = [], yReply = [], yRetweet = [], yLike = [];
    xAxis = dataArr.map(item => item.created_at);
    yReply = dataArr.map(item => item.reply_count);
    yRetweet = dataArr.map(item => item.retweet_count);
    yLike = dataArr.map(item => item.like_count);

    if(window.AVG){
        yReply = averageList(yReply,window.AVG);
        yRetweet = averageList(yRetweet,window.AVG);
        yLike = averageList(yLike,window.AVG);
    }

    console.log(yReply);

    return {
        title: {
            text: window.IdObj[uid] + '转赞评',
            left: 'center',
        },
        xAxis: {
            type: 'category',
            data: xAxis
        },
        yAxis: {
            type: 'value'
        },
        legend: {
            data: ['Reply', 'Like', 'Retweet'],
            right: 30
        },
        tooltip: {
            trigger: 'axis'
        },

        series: [
            {
                name: 'Reply',
                data: yReply,
                type: 'line',
                smooth: true,
                markLine: {
                    data: [
                        { type: 'average', name: '平均值' }
                    ]
                },
            },
            {
                name: 'Like',
                data: yLike,
                type: 'line',
                smooth: true,
                markLine: {
                    data: [
                        { type: 'average', name: '平均值' }
                    ]
                },
            },
            {
                name: 'Retweet',
                data: yRetweet,
                type: 'line',
                smooth: true,
                markLine: {
                    data: [
                        { type: 'average', name: '平均值' }
                    ]
                },
            },
        ],
        dataZoom: [
            {
                show: true,
                realtime: true,
                start: 75,
                end: 100
            },
        ],
    };
}

