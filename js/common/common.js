
//api地址
var apiUrl = 'http://192.168.16.162:8090/';
/*生成表头公共函数*/
function buildThead(arr,want) {
    var some = '';
    if (want){
        some = '<td><input type="checkbox"></td>'
    }
    var html = '<thead><tr>' + some;
    if (typeof arr==='string'){
        arr = JSON.parse(arr);
    }
    arr.forEach(function(value,index){
        html += '<td>'+value+'</td>'
    });
    html += '</tr></thead>';
    return html;
};

/*生成表格内容公共函数 - 传入二维数组*/
function buildTbody(arr,want) {
    var html = '<tbody>';
    arr.forEach(function(value,index){
        if (want){
            var vs = "'"+JSON.stringify(value)+"'";
            html += "<tr value="+(vs)+"><td><input type=\"checkbox\"></td>";
            //html += '<tr value="'+(JSON.stringify(value))+'"><td><input type="checkbox"></td>';
        }
        value.forEach(function (values,indexs) {
            html += '<td>'+values+'</td>';
        });
        html += '</tr>';
    });
    html += '</tbody>';
    return html;
}

//表格配置
function options(){
    return {
        "ordering":false,
        language:{
            paginate:{
                previous:'上一页',
                next:'下一页',
                last:'最后一页',
                first:'第一页'
            }
        },
        "dom":'lBrtip',
        "info":false,
        "lengthChange":false,
        "pageLength":7
        // fnDrawCallback: function(table) {
        //     $("#move").append("  到第 <input style='height:28px;line-height:28px;width:40px;' class='margin text-center' id='changePage' type='text'> 页  <a class='btn btn-default shiny' style='margin-bottom:5px' href='javascript:void(0);' id='dataTable-btn'>确认</a>");
        //     var oTable = $("#tableId").dataTable();
        //     $('#dataTable-btn').click(function(e) {
        //         if($("#changePage").val() && $("#changePage").val() > 0) {
        //             var redirectpage = $("#changePage").val() - 1;
        //         } else {
        //             var redirectpage = 0;
        //         }
        //         oTable.fnPageChange(redirectpage);
        //     });
        // }
    }
}

//全选-取消全选
function allCheck(){
    $('#tables thead').on('click','input:checkbox',function () {
        var others = $(this).parent().parent().parent().siblings().find('tr td input');
        for (var i=0;i<others.length;i++){
            others[i].checked = !others[i].checked;
            $(others[i]).parent().parent().toggleClass('choose');
        }
    });
}

//时间选择-经手人选择
function choose() {
    layui.use('laydate', function(){
        var laydate = layui.laydate;
        //执行一个laydate实例
        laydate.render({
            elem: '#date',
            min:-90,
            max:0,
            done:function (value,date,enddate) {
                console.log(value,date,enddate)
                var min = date.year + '-' + date.month + '-' +date.date
                laydate.render({
                    elem: '#date1',
                    min:min,
                    max:0
                });
            }
        });
    });
}

//高级搜索框取消按钮
function highCancle(){
    $('.cmsearch .cancle').click(function(){
        $('.highsearch').trigger('click');
    });
}

