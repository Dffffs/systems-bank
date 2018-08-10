layui.use(['layer', 'form'], function(){
	var layer = layui.layer;
	var form = layui.form;
	var table = layui.table;
	form.render('select');
});

function closeThisPop(index){
    layer.close(index);
    $('body',parent.document).find('.pop').hide();
}

function changeCol(col,data){
    var canCol = JSON.parse(sessionStorage.getItem('table'));
    for (var i=0;i<canCol.length;i++){
        $(col).find('td:nth-child('+canCol[i]+')').text(data[i])
    }
}
//基础数据新增弹窗 -
function openit(table){
    var juge = sessionStorage.getItem('topText');
    var content;
    var area = ['60rem', '25rem'];
    if (juge == '商品类别'){
        content = '编码: <input class="new-code"/> <br /> 名称:<input class="unit">'
    }else if(juge == '商品品牌'){
        content = '编码: <input class="new-code"/> <br /> 名称:<input class="unit">'
    }else if(juge == '商品信息'){
        content = $('#xz-box');
        area = ['89rem', '47rem'];
    }else{
        content = '编码: <input class="new-code"/> <br /> 单位:<input class="unit">'
    };
	layer.open({
        type: 1,
        closeBtn: 1,
        btn:['保存并新增'],
        title: ['商品信息-新增', 'font-size:1rem;color:#a6b5da;background-color: #3e4052;height: 3rem;line-height: 3rem;'],
        area: area,
        content: content,
        yes:function(index){
            var url = apiUrl;
            var data = {};
            var row;
            if (juge !='商品信息'){
                row = ['<input type="checkbox">',$('.new-code').val(),$('.unit').val()];
            }else{
                row = '';
            } //row为当前行数据 顺序为表头顺序
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
                content = $('#xz-box');

            }else{
                url += 'article_unit/save_article_unit';
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
                    closeThisPop(index);
                    table.row.add( row ).draw(); // 增加一行数据
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
    $.ajax({
        type:'GET',
        url:apiUrl + 'article/query_Article',
        data:{
            articleBarcode:code
        },
        success:function (res) {
            console.log(res)
            layer.open({
                type: 1,
                closeBtn: 1,
                btn:['确定','取消'],
                title: ['商品信息-编辑', 'font-size:1rem;color:#a6b5da;background-color: #3e4052;height: 3rem;line-height: 3rem;'],
                area: area,
                content: content,
                yes:function(index){
                    var url = apiUrl + 'article/save_article';
                    var data = {

                    };
                    var arr = [];

                    $.post({
                        url:url,
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        data:JSON.stringify(data),
                        success:function(res){
                            changeCol(choose,arr);//传入行,arr
                            closeThisPop(index);
                        }
                    });

                },
                no:function(index){
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
    layer.open({
        type: 1,
        closeBtn: 1,
        btn:['确定','取消'],
        title: ['商品信息-编辑', 'font-size:1rem;color:#a6b5da;background-color: #3e4052;height: 3rem;line-height: 3rem;'],
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
                    changeCol(choose,arr);//传入行,arr
                    closeThisPop(index);
                }
            });

        },
        no:function(index){
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
        area = ['62rem', '20rem'];
    }
    if (juge == '商品类别'){
        content = '编码: <input class="new-code" disabled="disabled" value='+value+'/> <br /> 名称:<input class="unit" value='+value1+'>'
        notInfo(juge,content,area,choose);
    }else if(juge == '商品品牌'){
        content = '编码: <input class="new-code" disabled="disabled" value='+value+'/> <br /> 名称:<input class="unit" value='+value1+'>'
        notInfo(juge,content,area,choose);
    }else if(juge == '商品信息'){
        content = $('#xz-box');
        var code = JSON.parse(choose.attr('value'))[0];
        getSome(code,content,area,choose);

    }else{
        content = '编码: <input class="new-code" disabled="disabled" value='+value+'/> <br /> 单位:<input class="unit" value='+value1+'>'
        notInfo(juge,content,area,choose);
    };

}
function opengy(){
	layer.open({
        type: 1,
        closeBtn: 1,
        title: ['供货商-新增', 'font-size:1rem;color:#a6b5da;background-color: #3e4052;height: 3rem;line-height: 3rem;'],
        area: ['42.4rem', '43.1rem'],
        content: $('#gy-pop'),
        cancel: function(index, layero){
            closeThisPop(index);
		}
    });
}
//删除条目弹窗
function opendel(table,row){
	layer.open({
        type: 1,
        closeBtn: 1,
        btn:['确定','取消'],
        title: ['商品类别-删除', 'font-size:1rem;color:#a6b5da;background-color: #3e4052;height: 3rem;line-height: 3rem;'],
        area: ['62.3rem', '20rem'],
        content: $('#del-pop'),
        yes:function(index){
            var topText = sessionStorage.getItem('topText');
            var value = row.attr('value');
            if (topText=="商品类别"){

            } else if (topText=="商品品牌"){

            }else if (topText=="商品信息"){

            }else{

            }
            closeThisPop(index);
            table.row('.choose').remove().draw( false );
        },
        no:function(index){
            closeThisPop(index);
        },
        cancel: function(index, layero){
            closeThisPop(index);

		}
    });
}
/*入库新增*/
function openrk(){
	layer.open({
        type: 1,
        closeBtn: 1,
        title: ['入库-新增', 'font-size:1rem;color:#a6b5da;background-color: #3e4052;height: 3rem;line-height: 3rem;'],
        area: '89.4rem', 
        content: $('#storage-pop'),
        /*入库新增增加删除*/
       	success: function(layero, index){
       		var tbody = $('#tab-box').find('.tab-body')
		    $('#tab-box').on('click','button.jia',function () {
		        tbody.append(
		        	'<tr>'+
				        '<td>1</td>'+
				        '<td class="bnt-box"><button type="button" class="jia"></button><button type="button" class="jian"></button></td>'+
				        '<td>'+
				        	'<select class="sele" name="">'+
				        		'<option value="">请选择</option>'+
				        		'<option value="">001</option>'+
				        		'<option value="">002</option>'+
				        		'<option value="">003</option>'+
				        		'<option value="">004</option>'+
				        		'<option value="">005</option>'+
				        	'</select>'+
				        '</td>'+
				        '<td></td>'+
				        '<td></td>'+
				        '<td></td>'+
				        '<td><input type="number" min="0" name="" id="" value=""/></td>'+
				        '<td><input type="number" min="0" name="" id="" value=""/></td>'+
				        '<td><input type="number" min="0" name="" id="" value=""/></td>'+
				        '<td></td>'+
			        '</tr>'
		        )
		      /*  layui.use(['layer', 'form'], function(){
					var layer = layui.layer;
					var form = layui.form;
					var table = layui.table;
					form.render('select');
				});*/
		    });
		    $('#tab-box').on('click','button.jian',function () {

		    	 var o=$(this).parent().parent()
		    	 o.empty()
		    });
		},
		/*function rkadd(){
			$('#tab-box').on('click','button.jia',function () {
		        console.log(111)
		    });
		}rkadd()*/
        cancel: function(index, layero){
		  $('body',parent.document).find('.pop').hide();
		}
    });
	
}

function openkc(){
	layer.open({
        type: 1,
        closeBtn: 1,
        title: ['库存管理-新增', 'font-size:1rem;color:#a6b5da;background-color: #3e4052;height: 3rem;line-height: 3rem;'],
        area: '89.4rem', 
        content: $('#stock-pop'),
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
/*用户管理-新增*/
function openuser(){
    var juge = sessionStorage.getItem('topText');
	layer.open({
        type: 1,
        closeBtn: 1,
        title: ['用户管理-新增', 'font-size:1rem;color:#a6b5da;background-color: #3e4052;height: 3rem;line-height: 3rem;'],
        area: '58.4rem', 
        content: $('#user-xz'),
        cancel: function(index, layero){
            closeThisPop(index);
		}
    });
}

/*用户管理 - 编辑*/
function openuserbj(){
    var juge = sessionStorage.getItem('topText');
    layer.open({
        type: 1,
        closeBtn: 1,
        title: ['用户管理-新增', 'font-size:1rem;color:#a6b5da;background-color: #3e4052;height: 3rem;line-height: 3rem;'],
        area: '58.4rem',
        content: $('#user-bj'),
        cancel: function(index, layero){
            closeThisPop(index);
        }
    });
}