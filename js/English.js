/**
 * Created by faithpercious on 2017/11/6.
 */
//实现连连看的动态生成，点击消除事件
var byId = function (id) {
    return document.getElementById(id);
}
var boxWidth = 90; //格子宽度
var gameBox;
var mapid = 'game-box';//地图 id
//10张图片
var arr = '1,2,3,4,5,6,7,8,9,10'.split(',');
var h = 4;  //图片共8行
var w = 5; //图片共11列
var boxsLength = h*w;
var boxArr = {};    //map对象
var startBox = '';  //开始的格子
var endBox = '';    //结束的格子
window.onload = init;

//初始化
function init() {
    boxsLength = h*w;//图片方框的个数
    boxArr = {};
    startBox = '';
    endBox = '';
    var str = '';
    gameBox = byId(mapid);
    for (var i = 0; i < h; i++) {
        for (var j = 0; j < w; j++) {
            str += '<img class="" onclick="choose(this);" id="t' + i + '_l'
                + j + '" src="img/blank.gif">'
            // alert(str);
        }//id="t0_l0,t0_l1,t0_l2,t0_l3..."
    }
    gameBox.innerHTML = str;
    gameBox.style.width = w * boxWidth + 'px';
    pushBoxArr();
    toHTML();
}

// 随机获取坐标
function getPosition() {
    var t, f;
    (function () {
        t = parseInt(Math.random() * h);
        l = parseInt(Math.random() * w);
        if (('t' + t + '_l' + l) in boxArr) {
            arguments.callee();
        }
    })();
    return {t:t, l:l}
}

// 创建随机坐标的格子
function CearteBox(name) {
    var p = getPosition();
    this.name = name;//图片名
    this.t = p.t;//行
    this.l = p.l;//列
    this.position = 't' + p.t + '_l' + p.l;//位置
    this.love = 0;//这个用于特殊,某些图片不同也可以连接
    switch (name) {
        case '100':
        case '200':
            this.love = 1;
            break;
        case '300':
        case '400':
        case '500':
            this.love = 2;
            break;
        case '600':
        case '700':
            this.love = 3;
            break;
        case '800':
        case '900':
            this.love = 4;
            break;
    }
}

// 产生20个格子（图片框）
function pushBoxArr() {
    var index = 0;
    var last = arr.length - 1;
    for (var i=0; i< h;i++) {
        for (var j=0;j< w;j++) {
            var a = new CearteBox(arr[index]);//用图片名创建,每张图片四次
            boxArr['t' + a.t + '_l' + a.l] = a;//格子的位置(也是每张图片的id)
            if (index === last) {
                index = 0;
            } else {
                index += 1;
            }
        }
    }
}

// 初始化html
function toHTML() {
    for (var i in boxArr) {//遍历所有图片的id
        byId(i).src = 'img/' + boxArr[i].name + '.png';
    }
}

// choose
function choose(el) {
    if (el.src.indexOf('blank') >= 0) {//鼠标点击了空白图片
        return false;
    }else{
        el.className = 'active';//更改点击图片的样式
        //第一次点击或点击了同一张图片
        if (startBox == '' || startBox == el.id) {
            startBox = el.id;
        } else {//点击了第二张图片
            endBox = el.id;
            test(boxArr[startBox], boxArr[endBox]);
        }
    }
}
//干掉格子，删除boxArr中相应格子
function kill(a, b) {
    boxArr[a.position] = null;
    boxArr[b.position] = null;
    boxsLength -= 2;
    startBox = '';
    endBox = '';
}

// 显示链接路径
function showLine(a, b, c, d) {
    var line1 =show2pt(a,b);
    var line2 = show2pt(b,c);
    var line3 = show2pt(c,d);
    var hideLine = function () {
        gameBox.removeChild(line1);
        gameBox.removeChild(line2);
        gameBox.removeChild(line3);
        byId(a.position).src = byId(d.position).src ='img/blank.gif';
        byId(a.position).className = byId(d.position).className = '';
        if (boxsLength<=0) {
            alert('亲，你赢了！好腻害啊。');
            byId('agin').style.display = 'block';
        }
    }
    setTimeout(hideLine, 300);

    function show2pt (a, b){
        var top, left, width, height, line = document.createElement('div');
        var a = a, b = b, temp;
        // 交换位置
        if (a.t > b.t || a.l > b.l) {
            temp = a;
            a = b;
            b = temp;
        }
        top = boxWidth * a.t + 30 + 'px';
        left = boxWidth * a.l + 30 + 'px';
        // 同行(t相等)
        if (a.t == b.t) {
            width = boxWidth * (b.l - a.l) + 1 + 'px';
            height = '1px';
        }
        // 同列(l相等)
        if (a.l == b.l) {
            width = '1px';
            height = boxWidth * (b.t - a.t) + 1 + 'px';
        }
        line.style.top = top;
        line.style.left = left;
        line.style.width = width;
        line.style.height = height;
        return gameBox.appendChild(line);
    }
}

// 单个格子是否空值
function isNull (a) {
    return boxArr['t' + a.t + '_l' + a.l] ? false : true;
}

// 2点是否连通
function link2pt (a, b) {
    var a = a, b = b, temp, canLink = true;
    // 交换位置
    if (a.t > b.t || a.l > b.l) {
        temp = a;
        a = b;
        b = temp;
    }
    if (a.t == b.t) {   //同行（t相等），a在b的左边
        for (var i = a.l + 1, len = b.l - 1; i <= len; i++) {
            if (boxArr['t' + a.t + '_l' + i]) {
                canLink = false;
                break;
            }
        }
    }else if (a.l == b.l) {   //同列（l相等），a在b的上边
        for (var i = a.t + 1, len = b.t - 1; i <= len; i++  ) {
            if(boxArr['t' + i + '_l' + a.l]) {
                canLink = false;
                break;
            }
        }
    } else {
        throw ('位置错误：a.t=' + a.t + ' b.t=' + b.t + ' a.l=' + a.l + ' b.l=' + b.l);
    }
    return canLink;
}

// 4个点是否两两连通
function link4pt (pt1, pt2, pt3, pt4) {
    return link2pt(pt1, pt2) && link2pt(pt2, pt3) && link2pt(pt3, pt4);
}
