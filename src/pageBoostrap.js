/**
 * 分页插件
 */
var Page = function (obj) {
    //接口
    this.url = obj.url;
    //目标位置
    this.targetDom = obj.targetDom;
    //回掉函数
    this.callback = obj.callback;
    //每一页显示条数
    this.pageNumbers = obj.pageNumbers || 10;
    //当前页
    this.currentPage = obj.currentPage || 1;
    //上一页
    this.prevPage = obj.prevPage || '上一页';
    //首页
    this.firstPage = obj.firstPage || '首页';
    //下一页
    this.nextPage = obj.nextPage || '下一页';
    //尾页
    this.lastPage = obj.lastPage || '尾页';
    //跳转
    this.jumpPage = obj.jumpPage || '跳转';
    //总条数
    this.totalSize = null;
    //总页数
    this.totalPage = null;
    //请求
    this.ajaxRequest(this.url);
}
/**
 * 请求数据
 */
Page.prototype.ajaxRequest = function (url) {
    var xmlhttp, _this = this;
    if (window.XMLHttpRequest) { //IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var data = eval('(' + xmlhttp.responseText + ')');
            if (_this.totalPage == null && _this.totalSize == null) {
                _this.totalPage = data.data.totalPage;
                _this.totalSize = data.data.totalRecord;
                //初始化分页DOM结构
                _this.initDOM();
            }
            _this.callback(data);

        }
    }
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
}
/**
 * 初始化分页，完成分页DOM结构显示
 */
Page.prototype.initDOM = function () {
    var str = '<div style="overflow: hidden;">'
    str += '<ul class="pagination" style="float: left;">';
    str += '<li class="page-item"><a class="page-link" href="javascript:;">'+this.prevPage+'</a></li>';
    str += '<li class="page-item"><a class="page-link" href="javascript:;">'+this.firstPage+'</a></li>';
    for (var i = 0; i < this.totalPage; i++) {
        if (i == 0) {
            str += '<li class="page-item page-item'+(i+1)+' active"><a class="page-link" href="javascript:;">'+(i+1)+'</a></li>';
        } else {
            str += '<li class="page-item page-item'+(i+1)+'"><a class="page-link" href="javascript:;">'+(i+1)+'</a></li>';   
        }
    }
    str += '<li class="page-item"><a class="page-link" href="javascript:;">'+this.lastPage+'</a></li>';  
    str += '<li class="page-item"><a class="page-link" href="javascript:;">'+this.nextPage+'</a></li>';
    str += '</ul>'
    str += '<input type="text" class="form-control jump-page-number" class="form-control" style="float: left;margin: 21px 10px;width: 50px;height: 32px;" />';
    str += '<a class="btn btn-primary page-link" href="javascript:;" role="button" style="margin: 21px 0;height: 32px;">'+this.jumpPage+'</a>';
    str +='</div>'
    this.targetDom.innerHTML = str;
    this.bindEvent();
}
/**
 * 初始化绑定事件
 */
Page.prototype.bindEvent = function () {
    var _this = this;
    var arr = this.targetDom.getElementsByClassName('page-link');
    for (var index in arr) {
        arr[index].onclick = function () {
            _this.selectPage(this.innerText);
        }
    }
}
/**
 * 选择页码
 */
Page.prototype.selectPage = function (page) {
    var _currentPage = this.currentPage;
    switch (page) {
        case this.firstPage:
            this.currentPage = 1;
            break;
        case this.lastPage:
            this.currentPage = this.totalPage;
            break;
        case this.prevPage:
            this.currentPage == 1 ? this.currentPage : this.currentPage--;
            break;
        case this.nextPage:
            this.currentPage == this.totalPage ? this.currentPage : this.currentPage++;
            break;
        case this.jumpPage:
            var number = parseInt(this.targetDom.getElementsByClassName('jump-page-number')[0].value);
            if (number >= 1 && number <= this.totalPage) {
                this.currentPage = number;
            } else {
                alert( number.toString() ==='NaN' ? '页码格式不对！' : '超出页码范围！');
                this.targetDom.getElementsByClassName('jump-page-number')[0].value = '';
                return;
            }
            break;
        default:
            this.currentPage =  parseInt(page);
            break;
    }
    // this.ajaxRequest(this.url);

    if (this.currentPage % 2 == 0) {
        this.ajaxRequest('../mock/demo1.json');
    } else {
        this.ajaxRequest('../mock/demo.json');
    }


    this.targetDom.getElementsByClassName('page-item' + _currentPage)[0].classList.remove('active');
    this.targetDom.getElementsByClassName('page-item' + this.currentPage)[0].classList.add('active')
}
