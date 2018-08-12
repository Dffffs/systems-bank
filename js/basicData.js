(function(){
    var fakeData = {
        head:sessionStorage.getItem('head'),
        topText:sessionStorage.getItem('topText'),
        body:[]
    };
    $(document).ready(function () {
        getData();
    });

    //请求数据
    function getData() {
        var url = apiUrl;
        if (fakeData.topText == '商品类别'){
            url += 'article_type/query_article_type';
        } else if(fakeData.topText == '商品品牌'){
            url += 'article_brand/query_article_brand';
        }else if(fakeData.topText == '商品信息'){
            url += 'article/queryArticleList';
            getType();
        }else{
            url += 'article_unit/query_article_unit';
        }
        $.ajax({
            type:'GET',
            url:url,
            data:{
                page:0,
                pageNum:9999
            },
            success:function(res){
                if (res.data.data){
                    fakeData.body = fixedData(res.data.data);
                }else{
                    fakeData.body = fixedData(res.data)
                }

                console.log(res)
                createTable();
            }
        });
    };
    //请求查询商品类别
    function getType(){
        $.ajax({
            url:apiUrl + 'article_type/query_article_type',
            success:function(res){
                $('.search select').show();
                var html = '';
                for (var i=0;i<res.data.length;i++){
                    html += '<option value="'+res.data[i]['typeName']+'">'+res.data[i]['typeName']+'</option>'
                }
                $('.search select').append(html);
            }
        })
    }
    //处理返回数据
    function fixedData(data) {
        var body = [];
        for (var i=0;i<data.length;i++){
            if (fakeData.topText == '商品类别'){
                body.push([
                    data[i]['typeNo'],
                    data[i]['typeName']
                ])
            } else if(fakeData.topText == '商品品牌'){
                body.push([
                    data[i]['brandNo'],
                    data[i]['brandName']
                ])
            }else if(fakeData.topText == '商品信息'){
                body.push([
                    data[i]['articleBarcode'],
                    data[i]['articleName'],
                    data[i]['specification'],
                    data[i]['articleUnitName'],
                    data[i]['articleTypeName'],
                    data[i]['articleBrandName'],
                    data[i]['purchasingPrice'],
                    data[i]['sellingPrice']
                ])
            }else{
                body.push([
                    data[i]['unitNo'],
                    data[i]['unitName']
                ])
            }
        }
        return body;
    }
    //创建表格
    function createTable() {
        var html,html1;
        html = buildThead(fakeData.head,true);
        html1 = buildTbody(fakeData.body,true);
        $('#tables').html(html+html1);
        var option = options();
        var table = $('#tables').DataTable(option);
        leftButtonClick(table);//按钮点击事件
        allCheck()//全选
    }

    //新增-编辑-删除-复选框-搜索
    function leftButtonClick(table) {
        $('#tables').unbind('click').on('click','input:checkbox',function () {
            $(this).parent().parent().toggleClass('choose');
        });
        $('.button .add,.button .change,.button .del').unbind('click').click(function () {
            var text = $(this).find('span').text();
            var es = $('body',parent.document).find('.pop iframe')[0].contentWindow;
            sessionStorage.setItem('poptext',text);
            if (text == '新增'){
                $('body',parent.document).find('.pop').show();
                es.openit(table);
            }else if(text == '编辑'){
                if ($('#tables .choose').length>1){
                    alert('暂时不支持多行编辑')
                }else if ($('#tables .choose').length == 0){
                    alert('请选择一行编辑')
                }  else{
                    $('body',parent.document).find('.pop').show();
                    es.openbj($('#tables .choose'));

                }
            } else if(text == '删除'){
                $('body',parent.document).find('.pop').show();
                es.opendel(table,$('#tables .choose'));

            }else{

            }
        });
        $('.button .search input:button').unbind('click').click(function () {

            var value = $(this).siblings().val();
            var select = $('.search select').val();
            if (fakeData.topText=='商品信息'){
                //复合查询,第几列查询内容为value
                if (select !==""){
                    if (!isNaN(Number(value))){
                        table
                            .column(5)
                            .search(select)
                            .column(1)
                            .search(value)
                            .draw(false);
                    } else{
                        table
                            .column(5)
                            .search(select)
                            .column(2)
                            .search(value)
                            .draw(false);
                    }
                }else{
                    if (value==""){
                        location.reload()
                    } else{
                        table.search(value).draw();//搜索-单项
                    }
                }
            } else{
                if (value==""){
                    location.reload()
                } else{
                    table.search(value).draw();//搜索-单项
                }
            }
        })
    }
})();