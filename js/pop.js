layui.use(['layer', 'form'], function(){
	var layer = layui.layer;
	var form = layui.form;
	var table = layui.table;
	
});


function closeThisPop(index){
    layer.close(index);
    $('body',parent.document).find('.pop').hide();
}

// function changeCol(col,data){
//     var canCol = JSON.parse(sessionStorage.getItem('table'));
//     for (var i=0;i<canCol.length;i++){
//         $(col).find('td:nth-child('+canCol[i]+')').text(data[i])
//     }
// }
//选择框内容函数
function selectContent(result) {
    $.ajax({//商品类别
        url:apiUrl + 'article_type/query_article_type',
        type:'GET',
        success:function(res){
            $.ajax({//商品单位
                url:apiUrl + 'article_unit/query_article_unit',
                type:'GET',
                success:function(res){
                    $.ajax({//供应商
                        url:apiUrl + 'supplier/query_supplier',
                        type:'GET',
                        success:function (res) {
                            $.ajax({
                                url:apiUrl + 'article_brand/query_article_brand',
                                type:'GET',
                                success:function (res) {

                                    var html = '<option value=""></option>';
                                    for (var i=0;i<res.data.length;i++){
                                        html += '<option value="'+res.data[i].brandNo+'">'+res.data[i].brandName+'</option>'
                                    }
                                    $('#more8 select').html(html);
                                    fixed(result);
                                }
                            });
                            var html = '<option value=""></option>';
                            for (var i=0;i<res.data.length;i++){
                                html += '<option value="'+res.data[i].supplierNo+'">'+res.data[i].supplierName+'</option>'
                            }
                            $('#more4 select').html(html);
                        }
                    });
                    var html = '<option value=""></option>';
                    for (var i=0;i<res.data.length;i++){
                        html += '<option value="'+res.data[i].unitNo+'">'+res.data[i].unitName+'</option>'
                    }
                    $('#basic5 select').html(html);
                }
            });
            var html = '<option value=""></option>';
            for (var i=0;i<res.data.length;i++){
                html += '<option value="'+res.data[i].typeNo+'">'+res.data[i].typeName+'</option>'
            }
            $('#basic4 select').html(html);
        }
    });

    function fixed(result){
        if (result){
            var datas = result.data;
            $('#basic1').val(datas.articleName);
            $('#more4 select').val(datas.specification);
            $('#more1').val(datas.shortenedForm);
            $('#basic3').val(datas.purchasingPrice);
            $('#basic4 select').val(datas.articleTypeNo);
            $('#more8 select').val(datas.articleBrandNo);
            $('#basic5 select').val(datas.articleUnitNo);
            $('#more6 select').val(datas.status);
            $('#more5').val(datas.shelfLifeDays);
            $('#fileImage').val(datas.imagesLink);
            $('#more7').val(datas.description);
            $('#more3').val(datas.dateInProduced);
        }

    }

}
//基础数据新增弹窗 -
function openit(table){
    var juge = sessionStorage.getItem('topText');
    var text = sessionStorage.getItem('poptext');
    var content;
    var area = ['60rem', '25rem'];
    if (juge == '商品类别'){
        content = '<div class="new-box mt2">编码: <input class="new-code"/></div> <br /><div class="new-box"> 名称:<input class="unit"></div>'
    }else if(juge == '商品品牌'){
        content = '<div class="new-box mt2">编码: <input class="new-code"/></div> <br /><div class="new-box"> 名称:<input class="unit"></div>'
    }else if(juge == '商品信息'){
        content = $('#xz-box');
        area = ['89rem', '47rem'];
        selectContent();
    }else{
        content = '<div class="new-box mt2">编码: <input class="new-code"/></div> <br /><div class="new-box"> 名称:<input class="unit"></div>'
    };
	layer.open({
        type: 1,
        closeBtn: 1,
        btn:['保存并新增'],
        title: [juge +'-'+ text, 'font-size:1rem;color:#a6b5da;background-color: #3e4052;height: 3rem;line-height: 3rem;'],
        area: area,
        content: content,
        yes:function(index){
            var url = apiUrl;
            var data = {};
            // var row;
            // if (juge !='商品信息'){
            //     row = ['<input type="checkbox">',$('.new-code').val(),$('.unit').val()];
            // }else{
            //     row = '';
            // } //row为当前行数据 顺序为表头顺序
            if (juge == '商品类别'){
                url += 'article_type/save_article_type';
                data = {
                    typeName:$('.new-code').val(),
                    typeNo:$('.unit').val()
                };
            }else if(juge == '商品品牌'){
                url += 'article_brand/save_article_brand';
                data = {
                    brandNo:$('.new-code').val(),
                    brandName:$('.unit').val()
                };
            }else if(juge == '商品信息'){
                url += 'article/save_article';
                data = {
                    articleName:$('#basic1').val(),
                    specification:$('#more4 select').val(),
                    shortenedForm:$('#more1').val(),
                    purchasingPrice:$('#basic3').val()*100,//进价
                    articleTypeNo:$('#basic4 select').val(),
                    articleBrandNo:$('#more8 select').val(),
                    articleUnitNo:$('#basic5 select').val(),
                    status:'01',//$('#more4 input').val(),
                    shelfLifeDays:$('#more5').val(),
                    imagesLink:$('#fileImage').val(),
                    description:$('#more7').val(),
                    dateInProduced:$('#more3').val()
                };
            }else{
                url += 'article_unit/save_article_unit';
                data = {
                    unitName:$('.unit').val(),
                    unitNo:$('.new-code').val()
                };
            };
            $.post({
                url:url,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                data:JSON.stringify(data),
                success:function(res){
                    closeThisPop(index);
                    $('body',parent.document).find('.content iframe')[0].contentWindow.location.reload();
                }
            });
        },
        cancel: function(index, layero){
            closeThisPop(index);
		}    
    });
}
function openxg(){

    layer.open({
        type: 1,
        closeBtn: 1,
        title: ['商品信息-修改', 'font-size:1rem;color:#a6b5da;background-color: #3e4052;height: 3rem;line-height: 3rem;'],
        area: ['89rem', '47rem'],
        content: $('#xg-box'),
        cancel: function(index, layero){
            closeThisPop(index);
		}
    });
   
}
function getSome(code,content,area,choose){
    var text = sessionStorage.getItem('poptext');
    var juge = sessionStorage.getItem('topText');
    $.ajax({
        type:'GET',
        url:apiUrl + 'article/query_Article',
        data:{
            articleBarcode:code
        },
        success:function (res) {
            selectContent(res);
            layui.use('laydate', function(){
                var laydate = layui.laydate;
                //执行一个laydate实例
                laydate.render({
                    elem: '#more3',
                });
            });
            layer.open({
                type: 1,
                closeBtn: 1,
                btn:['确定','取消'],
                title: [juge +'-' + text, 'font-size:1rem;color:#a6b5da;background-color: #3e4052;height: 3rem;line-height: 3rem;'],
                area: area,
                content: content,
                yes:function(index){
                    var url = apiUrl + 'article/modification_article';
                    /**/
                    var data = {
                        articleBarcode:res.data.articleBarcode,
                        articleName:$('#basic1').val(),//
                        specification:$('#more4 select').val(),
                        shortenedForm:$('#more1').val(),//别称
                        purchasingPrice:$('#basic3').val()*100,//进价
                        articleTypeNo:$('#basic4 select').val(),//类别
                        articleBrandNo:$('#more8 select').val(),//品名
                        articleUnitNo:$('#basic5 select').val(),//单位
                        status:$('#more6 select').val(),//商品状态
                        shelfLifeDays:$('#more5').val(),
                        imagesLink:$('#fileImage').val(),
                        description:$('#more7').val(),
                        dateInProduced:$('#more3').val()
                    };
                    $.post({
                        url:url,
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        data:JSON.stringify(data),
                        success:function(res){
                            $('body',parent.document).find('.content iframe')[0].contentWindow.location.reload();
                            closeThisPop(index);
                        }
                    });

                },
                btn2:function(index){
                    closeThisPop(index);
                },
                cancel: function(index, layero){
                    closeThisPop(index);
                }
            });
        }
    })
}
function notInfo(juge,content,area,choose){
    var text = sessionStorage.getItem('poptext');
    var juge = sessionStorage.getItem('topText');
    layer.open({
        type: 1,
        closeBtn: 1,
        btn:['确定','取消'],
        title: [juge+'-'+text, 'font-size:1rem;color:#a6b5da;background-color: #3e4052;height: 3rem;line-height: 3rem;'],
        area: area,
        content: content,
        yes:function(index){
            var url = apiUrl;
            var data = {};
            var arr = [];

            if (juge == '商品信息'){
                arr = [0,0,0,0,0,0,0]
            } else{
                arr = [$('.unit').val()];
            }
            if (juge == '商品类别'){
                url += 'article_type/modification_article_type';
                data = {
                    typeName:$('.new-code').val(),
                    typeNo:$('.unit').val()
                };
            }else if(juge == '商品品牌'){
                url += 'article_brand/ modification_article_brand';
                data = {
                    brandNo:$('.new-code').val(),
                    brandName:$('.unit').val()
                };
            }else{
                url += 'article_unit/modification_article_unit';
                data = {
                    unitName:$('.new-code').val(),
                    unitNo:$('.unit').val()
                };
            };
            $.post({
                url:url,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                data:JSON.stringify(data),
                success:function(res){
                    $('body',parent.document).find('.content iframe')[0].contentWindow.location.reload();
                    closeThisPop(index);
                }
            });

        },
        btn2:function(index){
            closeThisPop(index);
        },
        cancel: function(index, layero){
            closeThisPop(index);
        }
    });
}
//基础数据编辑
function openbj(choose){
    var juge = sessionStorage.getItem('topText');
    var content;
    var area;
    if(juge == '商品信息'){
        //需要修改到编辑弹窗的内容 -
        area = ['89rem', '47rem'];
    }else{
        var value = choose.find('td:nth-child(2)').text();
        var value1 = choose.find('td:nth-child(3)').text();
        area = ['62rem', '25rem'];
    }
    if (juge == '商品类别'){
        content = '<div class="new-box mt2">编码: <input class="new-code" disabled="disabled" value='+value+'> </div><br /> <div class="new-box">名称:<input class="unit" value='+value1+'></div>'
        notInfo(juge,content,area,choose);
    }else if(juge == '商品品牌'){
        content = '<div class="new-box mt2">编码: <input class="new-code" disabled="disabled" value='+value+'></div><br /> <div class="new-box">名称:<input class="unit" value='+value1+'></div>'
        notInfo(juge,content,area,choose);
    }else if(juge == '商品信息'){
        content = $('#xz-box');
        var code = JSON.parse(choose.attr('value'));
        getSome(code[0],content,area,choose);

    }else{
        content = '<div class="new-box mt2">编码: <input class="new-code" disabled="disabled" value='+value+'/> </div><br /> <div class="new-box"> 单位:<input class="unit" value='+value1+'></div>'
        notInfo(juge,content,area,choose);
    };

}
function opengy(){
    var text = sessionStorage.getItem('poptext');
	layer.open({
        type: 1,
        closeBtn: 1,
        btn:['确定','取消'],
        title: ['供货商-'+text, 'font-size:1rem;color:#a6b5da;background-color: #3e4052;height: 3rem;line-height: 3rem;'],
        area: ['42.4rem', '43.1rem'],
        content: $('#gy-pop'),
        btn1:function(index){
            var status;
            if ($('#buySelect').siblings().find('input').val()=="启用"){
                status = '01';
            }else{
                status = '02';
            }
            var data = {
                supplierName:$('#buyName').val(),
                contactAddress:$('#buyAddress').val(),
                contactsName:$('#buyPeople').val(),
                phone:$('#buyPhone').val(),
                status:status,
                description:$('#buy').val(),
                supplierNo:$('#buyName').val()
            };
            $.post({
                url:apiUrl + 'supplier/save_supplier',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                data:JSON.stringify(data),
                success:function(res){
                    closeThisPop(index);
                    $('body',parent.document).find('.content iframe')[0].contentWindow.location.reload();
                }
            });

        },
        btn2:function(index){
            closeThisPop(index);
        },
        cancel: function(index, layero){
            closeThisPop(index);
		}
    });
}
//删除条目弹窗
function opendel(table,row){
    var text = sessionStorage.getItem('poptext');
    var juge = sessionStorage.getItem('topText');
	layer.open({
        type: 1,
        closeBtn: 1,
        btn:['确定','取消'],
        title: [juge+ '-' + text, 'font-size:1rem;color:#a6b5da;background-color: #3e4052;height: 3rem;line-height: 3rem;'],
        area: ['62.3rem', '20rem'],
        content: $('#del-pop'),
        yes:function(index){
            var topText = sessionStorage.getItem('topText');
            var url = apiUrl;
            var arr = [];
            for (var i=0;i<row.length;i++){
                arr.push(JSON.parse($(row[i]).attr('value'))[0]);
            };
            if (topText=="商品类别"){
               url += 'article_type/remove_article_type';//post data = 编号
            } else if (topText=="商品品牌"){
                url += 'article_brand/remove_article_brand';//POST data = 编号
            }else if (topText=="商品信息"){
                url += 'article/remove_article';
            }else if (topText=="商品单位") {
                url += 'article_unit/remove_article_unit';//post data = 编号
            }else if (topText=="供货商") {
                url += 'supplier/remove_supplier';//post 供应商编号
            }else if (topText=="用户管理"||topText=="角色管理") {
                url += 'login_info/removeLogin'
            }

            $.post({
                url:url,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                data:JSON.stringify(arr),
                success:function(res){
                    for (var i=0;i<row.length;i++){
                        table.row('.choose').remove()
                    }
                    table.draw( false );
                    closeThisPop(index);
                }
            });


        },
        btn2:function(index){
            closeThisPop(index);
        },
        cancel: function(index, layero){
            closeThisPop(index);

		}
    });
}
function addcontent(select,data) {
    select.unbind('change').on('change','.sele',function(){
        var value = $(this).val();
        var tr = $(this).parent().parent();
        var head = JSON.parse(sessionStorage.getItem('head'));
        for (var i=0 ;i<data.length;i++){
            if(data[i]['articleBarcode'] == value){
                tr.attr('value',JSON.stringify(data[i]));
                if (head[1] != '零售价盈亏金额'){
                    tr.find('td:nth-child(4)').html('<span>'+data[i]['articleBrandName']+'</span>');
                    tr.find('td:nth-child(5)').html('<span>'+data[i]['specification']+'</span>');
                    tr.find('td:nth-child(6)').html('<span>'+data[i]['articleUnitName']+'</span>');
                    tr.find('td:nth-child(7)').html('<input class="num" type="number" value="0" min="0">');
                    tr.find('td:nth-child(8)').html('<input class="num" type="number" value="0" min="0">');
                    tr.find('td:nth-child(9)').html('<input type="number" value="0" min="0">');
                    tr.find('td:nth-child(10)').html('<span>0</span>');
                }else{
                    var num = (data[i]['stockNum']==null?0:Number(data[i]['stockNum']));
                    tr.find('td:nth-child(4)').html('<span>'+data[i]['articleBrandName']+'</span>');
                    tr.find('td:nth-child(5)').html('<span>'+data[i]['specification']+'</span>');
                    tr.find('td:nth-child(6)').html('<span>'+data[i]['articleUnitName']+'</span>');
                    tr.find('td:nth-child(7)').html('<input class="stocknum" type="number" value="0" min="0">');
                    tr.find('td:nth-child(8)').html('<span>'+num+'</span>');
                    tr.find('td:nth-child(9)').html('<span>'+num+'</span>');
                    tr.find('td:nth-child(10)').html('<span>'+data[i]['purchasingPrice']+'</span>');
                    tr.find('td:nth-child(11)').html('<span>'+num * data[i]['purchasingPrice']+'</span>');
                    tr.find('td:nth-child(12)').html('<textarea class="stockarea"></textarea>');
                }


            }
        }
    });
    select.unbind('keyup').on('keyup','.num',function(){
       var num = Number($(this).val()) * Number($(this).parent().parent().find('.num').not(this).val());
       $(this).parent().parent().find('td:last-child').text(num);
    });

    /**/
    select.unbind('keyup').on('keyup','.stocknum',function () {

        var num = Number($(this).val()) - Number($(this).parent().parent().find('td:nth-child(8)').text());//盈亏数量
        var value = num * Number($(this).parent().parent().find('td:nth-child(10)').text());//盈亏进价
        $(this).parent().parent().find('td:nth-child(11)').text(value);
        $(this).parent().parent().find('td:nth-child(9)').text(num);
    })
}
/*入库新增*/
function openrk(){
    var text = sessionStorage.getItem('poptext');
    var juge = sessionStorage.getItem('topText');
	$.get({
        url:apiUrl + 'supplier/query_supplier',
        success:function(res){
            var html= '';
            for (var i=0;i<res.data.length;i++){
                html += '<option value="'+res.data[i]['supplierNo']+'">'+res.data[i]['supplierName']+'</option> '
            }
            $('#storagePeople').html(html);
            layer.open({
                type: 1,
                closeBtn: 1,
                btn:['确定','取消'],
                title: [juge+'-' + text, 'font-size:1rem;color:#a6b5da;background-color: #3e4052;height: 3rem;line-height: 3rem;'],
                area: '89.4rem',
                content: $('#storage-pop'),
                /*入库新增增加删除*/
                success: function(layero, index){
                    //查询所有货号
                    $.ajax({
                        url:apiUrl + 'article/queryArticleListPage',
                        data:{
                            page:0,
                            pageNum:9999
                        },
                        success:function(res){
                            var html = '<option value="">请选择</option>';
                            for (var i=0;i<res.data.data.length;i++){
                                html += '<option value="'+res.data.data[i].articleBarcode+'">'+res.data.data[i].articleBarcode+'</option>'
                            }
                            var tbody = $('#tab-box').find('.tab-body');
                            tbody.find('tr:first-child select').html(html);
                            addcontent($('#tab-box .tab-body'),res.data.data);
                            $('#tab-box').on('click','button.jia',function () {
                                var indexs = $('#tab-box tbody tr').length + 1;
                                var s = tbody.append(
                                    '<tr>'+
                                    '<td>'+(indexs)+'</td>'+
                                    '<td class="bnt-box"><button type="button" class="jia"></button><button type="button" class="jian"></button></td>'+
                                    '<td>'+
                                    '<select class="sele" name="">'+ html+
                                    '</select>'+
                                    '</td>'+
                                    '<td></td>'+
                                    '<td></td>'+
                                    '<td></td>'+
                                    '<td><input type="number" min="0" name="" id="" value=""/></td>'+
                                    '<td><input type="number" min="0" name="" id="" value=""/></td>'+
                                    '<td><input type="number" min="0" name="" id="" value=""/></td>'+
                                    '<td></td>'+
                                    '</tr>');
                            });
                        }
                    });
                    $('#tab-box').on('click','button.jian',function () {
                        var o=$(this).parent().parent();
                        if(o.parent().find('tr').length === 1){
                            alert('不能删除最后一条信息')
                        }else{
                            var tdlength = $(o).nextAll().find('td:first-child');
                            for (var i=0;i<tdlength.length;i++){
                                $(tdlength[i]).text($(tdlength[i]).text()-1)
                            }
                            o.remove();
                        }


                    });

                },
                btn1:function(index){
                    var amount = $('#tab-box tbody tr td:last-child');
                    var totalNum = $('#tab-box tbody tr td:nth-child(7)');
                    var trAll = $('#tab-box tbody tr');
                    var all = 0;
                    var allNumber = 0;
                    var arr = [];
                    for (var i=0;i<amount.length;i++){
                        all += Number($(amount[i]).text())
                    }
                    for (var s=0;s<totalNum.length;s++){
                        allNumber += Number($(totalNum[s]).text())
                    }
                    for (var e=0;e<trAll.length;e++){
                        if ($(trAll[e]).attr('value').length>1){
                            var value = JSON.parse($(trAll[e]).attr('value'));
                            var num = $(trAll[e]).find('td:nth-child(7) input').val();
                            var sellingPrice = $(trAll[e]).find('td:nth-child(9) input').val();
                            var purchasingPrice = $(trAll[e]).find('td:nth-child(8) input').val();
                            var amount = $(trAll[e]).find('td:nth-child(10) input').val();
                            arr.push({
                                "articleId":value.articleId,// 商品id
                                "num":num, //入库数量,
                                "sellingPrice":sellingPrice * 100,//售价 (单位是“分”)
                                "purchasingPrice":purchasingPrice * 100,//进价(单位是“分”)
                                "amount":amount * 100//进价总金额(单位是“分”)
                            });
                        }

                    }
                    var data = {
                        stockindate:new Date().pattern('yyyy-MM-dd hh:mm:ss'),
                        supplierNo:$('#storagePeople').val(),
                        amount:all * 100,
                        totalNum:allNumber,
                        stockInDetailsFromList:arr,
                    };
                    $.post({
                        url:apiUrl + 'stockin/inventory_storage',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        data:JSON.stringify(data),
                        success:function(res){
                            console.log(res)
                            closeThisPop(index);
                        }
                    });

                },
                btn2:function(index){
                    closeThisPop(index);
                },
                cancel: function(index, layero){
                    closeThisPop(index);
                }
            });
        }
    })
	
}
//库存管理新增
function openkc(){
    var text = sessionStorage.getItem('poptext');
    var juge = sessionStorage.getItem('topText');
	layer.open({
        type: 1,
        closeBtn: 1,
        btn:['确认','取消'],
        title: [juge+ '-' + text, 'font-size:1rem;color:#a6b5da;background-color: #3e4052;height: 3rem;line-height: 3rem;'],
        area: '89.4rem', 
        content: $('#stock-pop'),
        success:function(index){
            $.ajax({
                url:apiUrl + 'article/queryArticleListPage',
                data:{
                    page:0,
                    pageNum:9999
                },
                success:function(res){
                    if (res.data){
                        var html = '<option value="">请选择</option>';
                        for (var i=0;i<res.data.data.length;i++){
                            if (res.data.data[i]['stockNum'] != null){
                                html += '<option value="'+res.data.data[i].articleBarcode+'">'+res.data.data[i].articleBarcode+'</option>'
                            }
                        }
                        var tbody = $('#stock-pop tbody');
                        tbody.find('tr:first-child select').html(html);
                        addcontent(tbody,res.data.data);
                        $('#stock-pop').on('click','button.jia',function () {
                            var indexs = $('#stock-pop tbody tr').length + 1;
                            var s = tbody.append(
                                '<tr>'+
                                '<td>'+(indexs)+'</td>'+
                                '<td class="bnt-box"><button type="button" class="jia"></button><button type="button" class="jian"></button></td>'+
                                '<td>'+
                                '<select class="sele" name="">'+ html+
                                '</select>'+
                                '</td>'+
                                '<td></td>'+
                                '<td></td>'+
                                '<td></td>'+
                                '<td><input type="number" min="0" name="" class="stocknum"  value=""/></td>'+
                                '<td></td>'+
                                '<td></td>'+
                                '<td></td>'+
                                '<td></td>'+
                                '<td><textarea class="stockarea"></textarea></td>'+
                                '</tr>');
                        });
                        $('#stock-pop').on('click','button.jian',function () {
                            var o=$(this).parent().parent();
                            if(o.parent().find('tr').length === 1){
                                alert('不能删除最后一条信息')
                            }else{
                                var tdlength = $(o).nextAll().find('td:first-child');
                                for (var i=0;i<tdlength.length;i++){
                                    $(tdlength[i]).text($(tdlength[i]).text()-1)
                                }
                                o.remove();
                            }
                        });
                    }////////////////
                }
            });

        },
        btn1:function(index){
            var tr = $('#stock-pop tbody tr');
            var TotalAmount = 0;
            var totalProfitAndLossNum = 0;
            var totalStockCheckNum = 0;
            var totalNum = 0;
            var stockcheckDetailsFromList = [];
            var description = $('#stocktext').val();
            for (var i=0;i<tr.length;i++){
                var value = JSON.parse($(tr[i]).attr('value'))
                TotalAmount += Number($(tr[i]).find('td:nth-child(11)').text());
                totalProfitAndLossNum += Number($(tr[i]).find('td:nth-child(9)').text());
                totalStockCheckNum += Number($(tr[i]).find('td:nth-child(7) input').val());
                totalNum += Number($(tr[i]).find('td:nth-child(8)').text());
                stockcheckDetailsFromList.push({
                    articleId:value.articleId,
                    profitAndLossNum:$(tr[i]).find('td:nth-child(9)').text(),
                    stockCheckNum:$(tr[i]).find('td:nth-child(7) input').val(),
                    num:$(tr[i]).find('td:nth-child(8)').text(),
                    purchasingPrice:value.purchasingPrice * 100,
                    profitAndLossAmount:$(tr[i]).find('td:nth-child(11)').text() * 100,
                    description:$(tr[i]).find('td textarea').val()
                })
            }
            var data = {
                "profitAndLossTotalAmount":TotalAmount * 100,//盈亏总金额
                "description":description,//描述
                "totalProfitAndLossNum":totalProfitAndLossNum,//盈亏总数量
                "totalStockCheckNum":totalStockCheckNum,//盘点总数量
                "totalNum":totalNum,//盘点商品库存总数量
                "stockcheckDetailsFromList":stockcheckDetailsFromList
            };
            $.post({
                url:apiUrl + 'stock_check/stockCheckOp',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                data:JSON.stringify(data),
                success:function(res){
                    closeThisPop(index);
                    $('body',parent.document).find('.content iframe')[0].contentWindow.location.reload();
                }
            })
        },
        btn2:function(index){
            closeThisPop(index);
        },
        cancel: function(index, layero){
            closeThisPop(index);
		}
    });
}   
/*不可编辑*/
function openTips(){
	layer.open({
        type: 1,
        closeBtn: 1,
        title: ['提示', 'font-size:1rem;color:#a6b5da;background-color: #3e4052;height: 3rem;line-height: 3rem;'],
        area: '45rem',
        content: $('#Non-editable'),
        cancel: function(index, layero){
            closeThisPop(index);
		}
    });
}
function allset(fn) {
    $.ajax({
        url:apiUrl + 'role_manage_info/queryRoleManageInfo',
        success:function(res){
            var data = res.data;
            var html = '<option></option>';
            for (var i=0;i<data.length;i++){
                html += '<option value="'+data[i]['roleManageNo']+'">'+data[i]['roleManageName']+'</option>'
            }
            $('.usertype').html(html);
            fn&&(fn())
        }
    });
}
/*用户管理-新增*/
function openuser(){
    var text = sessionStorage.getItem('poptext');
    var juge = sessionStorage.getItem('topText');
	layer.open({
        type: 1,
        closeBtn: 1,
        btn:['确定','取消'],
        title: [juge +'-' + text, 'font-size:1rem;color:#a6b5da;background-color: #3e4052;height: 3rem;line-height: 3rem;'],
        area: '58.4rem', 
        content: $('#user-xz'),
        success:function(){
            allset();

            $('.username').removeAttr('disabled').val('');
            $('.userinfo').val('');
            $('.password').val('');
            $('.userstatus').val('');
            $('#usermoney').val('');
        },
        btn1:function(index){
            var data = {
                "loginNo":$('.username').val(),//账号
                "loginName":$('.userinfo').val(),//名称
                "password":$('.password').val(),//密码
                "status":$('.userstatus').val(),//状态：01正常 02停用
                "roleManageNo":$('.usertype').val(),//角色权限
                "cashier":$('#usermoney').val()//是否收银：1收银，2非收银
            };
            $.post({
                url:apiUrl + 'login_info/registerLogin',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                data:JSON.stringify(data),
                success:function(res){
                    if (res.code != 0 ){
                        alert(res.msg)
                    } else{
                        closeThisPop(index);
                        $('body',parent.document).find('.content iframe')[0].contentWindow.location.reload();
                    }
                }
            })
        },
        btn2:function(index){
            closeThisPop(index);
        },
        cancel: function(index, layero){
            closeThisPop(index);
		}
    });
}

/*用户管理 - 编辑*/
function openuserbj(tbody){
    var text = sessionStorage.getItem('poptext');
    var juge = sessionStorage.getItem('topText');
    layer.open({
        type: 1,
        closeBtn: 1,
        btn:['确定','取消'],
        title: [juge+'-' + text, 'font-size:1rem;color:#a6b5da;background-color: #3e4052;height: 3rem;line-height: 3rem;'],
        area: '58.4rem',
        content: $('#user-xz'),
        success:function(){
            allset(function () {
                $.ajax({
                    url:apiUrl + 'login_info/queryLoginList',
                    success:function(res){
                        var index = tbody.find('tr.choose').index();
                        var data = res.data[index];
                        $('.username').attr('disabled','disabled');
                        $('.username').val(data['loginNo']);
                        $('.userinfo').val(data['loginName'])
                        $('#usermoney').val(data['cashier'])
                        $('.password').val(data['password'])
                        $('.usertype').val(data['roleManageNo'])
                        $('.userstatus').val(data['status'])
                    }
                })
            });
            //打开弹窗 --

        },
        btn1:function(index){
            var data = {
                "loginNo":$('.username').val(),//账号
                "loginName":$('.userinfo').val(),//名称
                "password":$('.password').val(),//密码
                "status":$('.userstatus').val(),//状态：01正常 02停用
                "roleManageNo":$('.usertype').val(),//角色权限
                "cashier":$('#usermoney').val()//是否收银：1收银，2非收银
            };
            $.post({
                url:apiUrl + 'login_info/modificationLogin',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                data:JSON.stringify(data),
                success:function (res) {
                    closeThisPop(index);
                    $('body',parent.document).find('.content iframe')[0].contentWindow.location.reload();
                }
            })
        },
        btn2:function(index){
            closeThisPop(index);
        },
        cancel: function(index, layero){
            closeThisPop(index);
        }
    });
}

/*商品信息详情*/
function opendetails(){
    var juge = sessionStorage.getItem('topText');
    layer.open({
        type: 1,
        closeBtn: 1,
        title: ['商品信息详情', 'font-size:1rem;color:#a6b5da;background-color: #3e4052;height: 3rem;line-height: 3rem;'],
        area: '80rem',
        content: $('details'),
        cancel: function(index, layero){
            closeThisPop(index);
        }
    });
}