//图片移动
//layui.define([''], function(exports) {
//	
//})
function imgMove(obj) {
    var oUl = document.getElementById(obj);
    var aLi = oUl.getElementsByTagName("li");
    var disX = 0;
    var disY = 0;
    var minZindex = 1;
    var aPos = [];
    var leftbz = 0;
    var topbz = 0;
    for (var i = 0; i < aLi.length; i++) {
        if (leftbz == 5) {
            leftbz = 1;
            topbz += 1;
            var fdiv = (topbz + 1) * 140;
            oUl.style.height = fdiv + 'px';
        }
        else {
            leftbz += 1;
        }
        //var l = aLi[i].offsetLeft;
        //var t = aLi[i].offsetTop;
        //此处注意，我是按照控件算出来的。尴尬。。。/(ㄒoㄒ)/~~
        var l = 170 * (leftbz - 1) + 10;
        var t = 130 * topbz;

        aLi[i].style.top = t + "px";
        aLi[i].style.left = l + "px";
        aPos[i] = { left: l, top: t };
        aLi[i].index = i;


    }
    for (var i = 0; i < aLi.length; i++) {
        aLi[i].style.position = "absolute";
        aLi[i].style.margin = 0;
        setDrag(aLi[i]);
    }
    //拖拽
    function setDrag(obj) {
        obj.onmouseover = function () {
            obj.style.cursor = "move";
        }
        obj.onmousedown = function (event) {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
            obj.style.zIndex = minZindex++;
            //当鼠标按下时计算鼠标与拖拽对象的距离
            disX = event.clientX + scrollLeft - obj.offsetLeft;
            disY = event.clientY + scrollTop - obj.offsetTop;
            document.onmousemove = function (event) {
                //当鼠标拖动时计算div的位置
                $(obj).find('img').addClass('disabled')
                $(obj).find('div').addClass('disabled')
//              obj.getElementsByTagName('img').style.pointerEvents = 'none';obj.getElementsByTagName('div').style.pointerEvents = 'none'
                var l = event.clientX - disX + scrollLeft;
                var t = event.clientY - disY + scrollTop;
                obj.style.left = l + "px";
                obj.style.top = t + "px";
                /*for(var i=0;i<aLi.length;i++){
                    aLi[i].className = "";
                    if(obj==aLi[i])continue;//如果是自己则跳过自己不加红色虚线
                    if(colTest(obj,aLi[i])){
                        aLi[i].className = "active";
                    }
                }*/
                for (var i = 0; i < aLi.length; i++) {
                    aLi[i].className = "";
                }
                var oNear = findMin(obj);
                if (oNear) {
                    oNear.className = "active";
                }
            }
            document.onmouseup = function () {
                document.onmousemove = null;//当鼠标弹起时移出移动事件
                document.onmouseup = null;//移出up事件，清空内存
                document.onclick = null;//移出点击事件，清空内存
                //检测是否普碰上，在交换位置
                var oNear = findMin(obj);
                if (oNear) {
                    oNear.className = "";
                    oNear.style.zIndex = minZindex++;
                    obj.style.zIndex = minZindex++;
                    startMove(oNear, aPos[obj.index]);
                    startMove(obj, aPos[oNear.index]);
                    //交换index
                    oNear.index += obj.index;
                    obj.index = oNear.index - obj.index;
                    oNear.index = oNear.index - obj.index;
                } else {

                    startMove(obj, aPos[obj.index]);
                }
                $(obj).find('img').removeClass('disabled')
                $(obj).find('div').removeClass('disabled')
            }
            clearInterval(obj.timer);
            return false;//低版本出现禁止符号
        }
    }
    //碰撞检测
    function colTest(obj1, obj2) {
        var t1 = obj1.offsetTop;
        var r1 = obj1.offsetWidth + obj1.offsetLeft;
        var b1 = obj1.offsetHeight + obj1.offsetTop;
        var l1 = obj1.offsetLeft;

        var t2 = obj2.offsetTop;
        var r2 = obj2.offsetWidth + obj2.offsetLeft;
        var b2 = obj2.offsetHeight + obj2.offsetTop;
        var l2 = obj2.offsetLeft;

        if (t1 > b2 || r1 < l2 || b1 < t2 || l1 > r2) {
            return false;
        } else {
            return true;
        }
    }
    //勾股定理求距离
    function getDis(obj1, obj2) {
        var a = obj1.offsetLeft - obj2.offsetLeft;
        var b = obj1.offsetTop - obj2.offsetTop;
        return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    }
    //找到距离最近的
    function findMin(obj) {
        var minDis = 999999999;
        var minIndex = -1;
        for (var i = 0; i < aLi.length; i++) {
            if (obj == aLi[i]) continue;
            if (colTest(obj, aLi[i])) {
                var dis = getDis(obj, aLi[i]);
                if (dis < minDis) {
                    minDis = dis;
                    minIndex = i;
                }
            }
        }
        if (minIndex == -1) {
            return null;
        } else {
            return aLi[minIndex];
        }
    }
}
//图片删除
function deleteElement(Obj) {
    Obj.parentNode.parentNode.removeChild(Obj.parentNode);
}
//描述
function divClick(obj) {
    layer.prompt({ title: '请填新的描述，并确认', formType: 2 }, function (text, index) {
        obj.innerHTML = text;
        layer.close(index);
    });
}

//图片裁剪
//layui.config({
//  base: "../static/../../static/js/"
//}).extend({
//  "croppers": "croppers"
//});
function croppers_pic(obj) {
    var src = obj.parentNode.childNodes["0"].src;
    layui.use(["croppers"], function () {
        var croppers = layui.croppers;
        croppers.render({
            area: ['900px', '600px']  //弹窗宽度
            , imgUrl: src
//          , url: "/user/upload.asp"  //图片上传接口返回和（layui 的upload 模块）返回的JOSN一样
            , done: function (url) { //上传完毕回调
                //更改图片src
                obj.parentNode.childNodes["0"].src = url;
            }
        });
    });
}
;
//通过class获取元素
function getClass(cls){
    var ret = [];
    var els = document.getElementsByTagName("*");
    for (var i = 0; i < els.length; i++){
        //判断els[i]中是否存在cls这个className;.indexOf("cls")判断cls存在的下标，如果下标>=0则存在;
        if(els[i].className === cls || els[i].className.indexOf("cls")>=0 || els[i].className.indexOf(" cls")>=0 || els[i].className.indexOf(" cls ")>0){
            ret.push(els[i]);
        }
    }
    return ret;
}
function getStyle(obj,attr){//解决JS兼容问题获取正确的属性值
	return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj,false)[attr];
}
function startMove(obj,json,fun){
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		var isStop = true;
		for(var attr in json){
			var iCur = 0;
			//判断运动的是不是透明度值
			if(attr=="opacity"){
				iCur = parseInt(parseFloat(getStyle(obj,attr))*100);
			}else{
				iCur = parseInt(getStyle(obj,attr));
			}
			var ispeed = (json[attr]-iCur)/8;
			//运动速度如果大于0则向下取整，如果小于0想上取整；
			ispeed = ispeed>0?Math.ceil(ispeed):Math.floor(ispeed);
			//判断所有运动是否全部完成
			if(iCur!=json[attr]){
				isStop = false;
			}
			//运动开始
			if(attr=="opacity"){
				obj.style.filter = "alpha:(opacity:"+(json[attr]+ispeed)+")";
				obj.style.opacity = (json[attr]+ispeed)/100;
			}else{
				obj.style[attr] = iCur+ispeed+"px";
			}
		}
		//判断是否全部完成
		if(isStop){
			clearInterval(obj.timer);
			if(fun){
				fun();
			}
		}
	},30);
}