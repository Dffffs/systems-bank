(function(){
    var fakeData = {
        head:sessionStorage.getItem('head'),
        topText:sessionStorage.getItem('topText'),
        body:[]
    };
    $(document).ready(function(){
        getData()//获取数据
        changeButton();//按钮
        choose();//layui
        highCancle();
    });

    //获取数据
    function getData() {
        var url = apiUrl;
        if (fakeData.topText == '供货商'){
            url += 'supplier/query_supplier';
        } else{
            url += 'stockin/queryStockInList';
        }
        $.ajax({
            url:url,
            data:{
                page:0,
                pageNum:9999
            },
            success:function (res) {
                if (res.data){
                    if (fakeData.topText == '供货商'){
                        fakeData.body = delData(res.data)
                    }else{
                        fakeData.body = delData(res.data.data)
                    }

                    createTable();//创建表格
                }

            }
        })
    }

    //处理数据
    function delData(data) {
        var body = [];
        for (var i=0;i<data.length;i++){
            if (fakeData.topText == '供货商'){
                var status = data[i]['status'];
                if (status == '01'){
                    status = '启用';
                } else{
                    status = '停用';
                }
                body.push([
                    data[i]['supplierNo'],
                    data[i]['supplierName'],
                    data[i]['contactsName'],
                    data[i]['phone'],
                    data[i]['contactAddress'],
                    status,
                    data[i]['description']
                ])
            } else{
                body.push([
                    data[i]['stockinNo'],
                    data[i]['supplierName'],
                    data[i]['loginName'],
                    data[i]['createtime'],
                    data[i]['stockindate'],
                    data[i]['amount']
                ])
            }
        }
        return body;
    }
    //入库选项修改按钮
    function changeButton(){
        if (fakeData.topText=="入库"){
            $('.change,.del').hide();
            $('.highsearch').show();
        }else{
            $('.change,.del').show();
            $('.highsearch').hide();
        }
    }

    //创建表格
    function createTable() {
        var html,html1,want;
        if (fakeData.topText!="入库"){
            want = true;
        }
        html1 = buildTbody(fakeData.body,want);
        html = buildThead(fakeData.head,want);

        $('#tables').html(html+html1);
        var option = options();
        var table = $('#tables').DataTable(option);
        leftButtonClick(table);//按钮点击事件
        allCheck()//全选

    }

    //新增-编辑-删除-复选框-搜索
    function leftButtonClick(table) {
        $('#tables').on('click','input:checkbox',function () {
            $(this).parent().parent().toggleClass('choose');
        });
        $('.button .add,.button .del').click(function () {//新增-编辑-删除
            var text = $(this).find('span').text();
            var e = $('body',parent.document).find('.pop iframe')[0].contentWindow;
            $('body',parent.document).find('.pop').show();
            if (text == '新增'){
                if (fakeData.topText=="供货商"){
                    e.opengy(table);
                } else{
                    e.openrk(table);
                }

            } else if(text == '删除'){
                e.opendel(table,$('#tables .choose'));
            }else{

            }
        });
        $('.button .search input:button').click(function () {
            var value = $(this).siblings().val();
                table.search(value).draw(false);//搜索-单项

        });
        $('.button .highsearch').click(function(){//隐藏
            $('.cmsearch').toggle();
            $(this).toggleClass('show');
        });
        //高级搜索确定按钮
        $('.cmsearch .confirm').click(function () {
            var date = $('#date').val();
            var date1 = $('#date1').val();
            var code = $('#code').val();

            //用时间段或者code搜索

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
                    url: apiUrl + 'stockin/queryStockInList',
                    data:data,
                    success:function(res){
                        if (res.data){

                            if (fakeData.topText == '供货商'){
                                fakeData.body = delData(res.data)
                            }else{
                                fakeData.body = delData(res.data.data)
                            }
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