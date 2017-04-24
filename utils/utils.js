function covertToStarsArray(stars) {
    var number = stars.toString().substring(0, 1);
    var array = [];
    for (var i = 1; i <= 5; i++) {
        if (i <= number) {
            array.push(1);
        } else {
            array.push(0);
        }
    }
    return array;
}
function http(url, callback) {
    wx.request({
        url: url,
        method: 'GET',
        header: {
            'Content-Type': 'json'
        }, // 设置请求的 header
        success: function (res) {
            callback(res.data);
        },
        fail: function (res) {
            console.log("fail")
        },
        complete: function (res) {
            // complete
        }
    })
}
function convertToCastString(casts){
    var castsjoin="";
    for(var idx in casts){
        castsjoin = castsjoin+casts[idx].name+"/";
    }
    return castsjoin.substring(0,castsjoin.length-2);
}

function convertToCastInfos(casts){
    var castsArray=[];
    for (var idx in casts){
        var cast = {
            img:casts[idx].avatars?casts[idx].avatars.large:"",
            name:casts[idx].name
        }
        castsArray.push(cast);
    }
    return castsArray;
}
module.exports = {
    covertToStarsArray: covertToStarsArray, 
    http:http,
    convertToCastString:convertToCastString,
    convertToCastInfos:convertToCastInfos
}