(function(){
    var fakeData = {
        head:JSON.parse(sessionStorage.getItem('head'))[0],
        topText:sessionStorage.getItem('topText'),
        body:[]
    };
    $(document).ready(function(){
        init();
    });
    //加载
    function init() {
        createTable();//创建表格
        choose();//layui
        highCancle();
    }
    //创建表格
    function createTable() {
        var html,html1;
        html = buildThead(fakeData.head,false);
        html1 = buildTbody(fakeData.body,false);
        $('#tables').html(html+html1);
        var option = options();
        var table = $('#tables').DataTable(option);
        leftButtonClick(table);//按钮点击事件
        allCheck()//全选
    }

    //复合查询
    function leftButtonClick(table) {

        $('.button .search input:button').unbind('click').click(function () {
            var value = $(this).siblings().val();
            table.search(value).draw(false);//搜索-单项
        });
        $('.button .highsearch').unbind('click').click(function(){
            $('.cmsearch').toggle();//高级搜索选项
            $(this).toggleClass('show');
        });
        // $('.tab span').unbind('click').click(function () {//切换
        //     if (!$(this).hasClass('active')) {
        //         $(this).addClass('active');
        //         $(this).siblings().removeClass('active');
        //         if ($(this).text()=='交易流水'){
        //             fakeData.head = JSON.parse(sessionStorage.getItem('head'))[0];
        //         }else{
        //             fakeData.head = JSON.parse(sessionStorage.getItem('head'))[1];
        //         };
        //         table.destroy();
        //         init();
        //     }
        // });
        $('.cmsearch .confirm').unbind('click').click(function () {//高级搜索确定按钮
            var date = $('#date').val();//时间
            var date1 = $('#date1').val();
            var select = $('.cmsearch div:first-child ul:first-child input:checked').val();//时间
            var code = $('#code').val();//流水号
            var people = $('#people').val();//收银
            var status = $('.cmsearch div:first-child ul:last-child input:checked').val();//状态
            var barcode = $('#barcode').val();//订单号

            switch (select){
                case "1":select = '今天';break;
                case "2":select = '昨天';break;
                case "3":select = '本周';break;
                case "4":select = '上周';break;
                case "5":select = '本月';break;
            }

            switch (status){
                case "1":status = '全部';break;
                case "2":status = '成功';break;
                case "3":status = '失败';break;
                case "4":status = '处理中';break;
            }
        });
    };
})();