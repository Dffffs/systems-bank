(function(){
    var fakeData = {
        head:sessionStorage.getItem('head'),
        topText:sessionStorage.getItem('topText'),
        body:[]
    };
    $(document).ready(function(){
        getData();

    });


    //创建表格
    function createTable() {
        var html,html1;
        html = buildThead(fakeData.head,false);
        html1 = buildTbody(fakeData.body,false);
        $('#tables').html(html+html1);
        var option = options();
        var table = $('#tables').DataTable(option);
        leftButtonClick(table);//按钮点击事件

    }

    //
    function deldata(res) {
        var data = res.data.data;
        var body = [];
        for (var i=0 ;i<data.length;i++){
            body.push([
                data[i]['stockCheckNo'],
                data[i]['profitAndLossTotalAmount'],
                data[i]['createtime'],
                data[i]['loginName']
            ])
        }
        return body;
    }
    //
    function getData() {
        $.get({
            url:apiUrl + 'stock_check/queryStockCheckOpList',
            data:{
                page:0,
                pageNum:9999
            },
            success:function (res) {
                if (res.data){
                    fakeData.body = deldata(res);
                    createTable();//创建表格
                    choose();//layui
                    highCancle();
                }
            }
        })
    }
    //新增-编辑-删除-复选框-搜索
    function leftButtonClick(table) {
        $('#tables').on('click','input:checkbox',function () {
            $(this).parent().parent().toggleClass('choose');
        });
        $('.button .add').click(function () {//新增
            var text = $(this).find('span').text();
            var es = $('body',parent.document).find('.pop iframe')[0].contentWindow;
            $('body',parent.document).find('.pop').show();
            es.openkc(table);

        });
        $('.button .search input:button').click(function () {
            var value = $(this).siblings().val();
            table.search(value).draw(false);//搜索-单项
        });
        $('.button .highsearch').click(function(){//切换高级搜索
            $('.cmsearch').toggle();
            $(this).toggleClass('show');
        });
        //高级搜索
        $('.cmsearch .confirm').click(function () {
            var date = $('#date').val();
            var date1 = $('#date1').val();
            var code = $('#code').val();

            if (code!=""||(date!=""&&date1!="")) {
                var data = {
                    stockinNo:code,
                    startDate:date + ' 00:00:00',
                    endDate:date1 + ' 00:00:00',
                    page:0,
                    pageNum:9999
                };
                if (code == ""){
                    data = {
                        stockinNo:code,
                        startDate:date + ' 00:00:00',
                        endDate:date1 + ' 00:00:00',
                        page:0,
                        pageNum:9999
                    }
                } else if(date==""||date1==""){
                    data = {
                        stockinNo:code,
                        page:0,
                        pageNum:9999
                    }
                }
                $.get({
                    url: apiUrl + 'stock_check/queryStockCheckOpList',
                    data:data,
                    success:function(res){
                        if (res.data){
                            fakeData.body = deldata(res);
                            table.destroy();
                            createTable();
                        }else{
                            fakeData.body = [];
                            table.destroy();
                            createTable();
                        }
                    }
                });
            }else{
                return alert('请输入单号或者起止时间查询')
            }
        })
    };
})();