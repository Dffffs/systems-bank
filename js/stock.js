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
    function getData() {
        $.get({
            url:apiUrl + 'stock_check/queryStockCheckOpList',
            data:{
                page:0,
                pageNum:9999
            },
            success:function (res) {
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
                fakeData.body = body;
                createTable();//创建表格
                choose();//layui
                highCancle();
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
        $('.button .highsearch').click(function(){
            $('.cmsearch').toggle();
            $(this).toggleClass('show');
        });
        //高级搜索
        $('.cmsearch .confirm').click(function () {
            var date = $('#date').val();
            var date1 = $('#date1').val();
            var code = $('#code').val();

            if (date==""&&code==""){
                alert('请选择起止日期或输入单号查询');
            }else{ //查询

            }
        })
    };
})();