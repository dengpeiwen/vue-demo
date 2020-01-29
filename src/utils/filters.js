// 转小写
let lower = value => value.toLowerCase();

// 转大写
let upper = value => value.toUpperCase();

// 时间过滤器
let time = timestamp => {
    return new Date(timestamp).toLocaleTimeString()
}
// 缩略超过规定长度的字符串
let ellipsisText = (text, size)=> {
    return (size > 0 && text.length > size) ? text.slice(0, size) + '...' : text;
}

let percentNumber = num => {
    const NUM = Number(num);
    if (Object.is(NUM, NaN)) {
        return '— —';
    } else {
        // 一个数转为百分比形式需要放大100倍，但是浮点数的计算可能导致精度丢失，因此需要先将原数按小数位数放大成整数再运算
        const numParts = NUM.toString().split('.');
        let bit = 0; // 小数的位数
        if (numParts.length > 1) { // 带小数部分
            bit = numParts[1].length;
        }
        return `${Math.round(NUM * Math.pow(10, bit)) / Math.pow(10, bit - 2)}%`; // 变为整数时要用到 Math.round()
    }
}
export {
    lower,
    upper,
    time,
    ellipsisText,
    percentNumber
}
