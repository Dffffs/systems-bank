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
        $('.dataTables_empty').text('请搜索');
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
        $('.cmsearch div:first-child ul:first-child input[type="radio"]').change(function () {
            if (!$('#date').val('').attr('disabled')){
                if (this.checked){
                    $('#date').val('').attr('disabled','true');
                    $('#date1').val('').attr('disabled','true');
                }
            }
        });
        $('.cmsearch .confirm').unbind('click').click(function () {//高级搜索确定按钮
            var date = $('#date').val();//时间
            var date1 = $('#date1').val();
            var checked = $('.cmsearch div:first-child ul:first-child input[type="radio"]:checked');

            var select = $('.cmsearch div:first-child ul:first-child input:checked').val();//时间
            var code = $('#code').val();//流水号
            var status = $('.cmsearch div:first-child ul:last-child input:checked').val();//状态
            var barcode = $('#barcode').val();//订单号
            switch (status){
                case "1":status = '00,03,06,09';break;
                case "2":status = '00';break;
                case "3":status = '03';break;
                case "4":status = '06';break;
            }
            //用时间段或者code搜索

            if ((checked.length>0)||(date!=""&&date1!="")) {
                var data = {
                    serialNo:code,
                    transStatus:status,
                    orderNo:barcode,
                    page:0,
                    pageNum:99999
                };
                if (date!=""){
                    data.startDate = date
                    data.endDate = date1
                } else{
                    data.dateType = select
                }

                $.ajax({
                    url:apiUrl + 'order_transaction/query_order_trans_info',
                    data:data,
                    success:function(res){
                        console.log(res)

                    }
                });

            }else{
                return alert('请选择时间')
            }


        });
    };
})();