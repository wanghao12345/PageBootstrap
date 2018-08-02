/**
 * 分页插件
 */
var Page = function (obj) {
    //目标位置
    this.targetDom = obj.targetDom;
    //总条数
    this.totalSize = obj.totalSize;
    //每一页显示条数
    this.pageNumbers = obj.pageNumbers || 10;
    //当前页
    this.currentPage = obj.currentPage || 1;
    //总页数
    this.totalPage = Math.ceil(this.totalSize/this.pageNumbers);
    //初始化分页DOM结构
    this.init();

}
/**
 * 初始化分页，完成分页DOM结构显示
 */
Page.prototype.init = function () {
    var str = '<ul class="pagination">';
    str += '<li class="page-item"><a class="page-link" href="javascript:;">上一页</a></li>';
    str += '<li class="page-item"><a class="page-link" href="javascript:;">首页</a></li>';
    for (var i = 0; i < this.totalPage; i++) {
        if (i == 0) {
            str += '<li class="page-item page-item'+(i+1)+' active"><a class="page-link" href="javascript:;">'+(i+1)+'</a></li>';
        } else {
            str += '<li class="page-item page-item'+(i+1)+'"><a class="page-link" href="javascript:;">'+(i+1)+'</a></li>';   
        }
    }
    str += '<li class="page-item"><a class="page-link" href="javascript:;">尾页</a></li>';  
    str += '<li class="page-item"><a class="page-link" href="javascript:;">下一页</a></li>';
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
        case '首页':
            this.currentPage = 1;
            break;
        case '尾页':
            this.currentPage = this.totalPage;
            break;
        case '上一页':
            this.currentPage == 1 ? this.currentPage : this.currentPage--;
            break;
        case '下一页':
            this.currentPage == this.totalPage ? this.currentPage : this.currentPage++;
            break;
        default:
            this.currentPage =  parseInt(page);
            break;
    }
    this.targetDom.getElementsByClassName('page-item' + this.currentPage)[0].classList.add('active')
}



