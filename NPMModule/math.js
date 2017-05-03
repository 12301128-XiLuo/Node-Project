var PI = Math.PI;

//平均值
exports.average = function(arr){
    var sum = 0;
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        sum += parseInt(arr[i]);
    };
    var avg = sum/len;
    return avg;
};

//方差
exports.variance = function(arr){
    var avg = 0;  
    var sum = 0;  
    var len = arr.length;
    for(var i = 0; i < len; i++){  
        sum += parseInt(arr[i]);  
    }  
    avg = sum / len;  
    sum = 0;  
    for(var i=0; i < len; i++){  
        sum += Math.pow(arr[i] - avg , 2);  
    }  
    return sum/len;
};

