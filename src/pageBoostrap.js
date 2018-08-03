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
    var str = '<ul class="pagination">';
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
    this.targetDom.getElementsByClassName('page-item' + this.currentPage)[0].classList.remove('active')
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
        default:
            this.currentPage =  parseInt(page);
            break;
    }
    this.ajaxRequest(this.url);
    this.targetDom.getElementsByClassName('page-item' + this.currentPage)[0].classList.add('active')
}
