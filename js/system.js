(function(){
    var fakeData = {
        head:sessionStorage.getItem('head'),
        topText:sessionStorage.getItem('topText'),
        body:[]
    };
    $(document).ready(function () {
        getData();
        create();
    });

    //初始化页面
    function create(){
        if (fakeData.topText=="修改密码") {
            $('.password').show();
            $('.content').hide();
        }else if (fakeData.topText=="角色权限"){
            $('.power').show();
            $('.content').hide();
        }else{

        }
    }
    
    //请求数据
    function getData() {
        $.ajax({
            url:apiUrl + 'login_info/queryLoginList',
            success:function(res){
                var body = [];
                var data = res.data;
                for (var i=0;i<data.length;i++){
                    body.push([
                        data[i].loginNo,
                        data[i].loginName,
                        data[i].statusName,
                        data[i].roleManageName,
                        data[i].cashierName
                    ])
                }
                fakeData.body = body;
                createTable()
            }
        })
    };
    //创建表格
    function createTable() {
        var html,html1;
        html = buildThead(fakeData.head,true);
        html1 = buildTbody(fakeData.body,true);
        $('#tables').html(html+html1);
        var option = options();
        var table = $('#tables').DataTable(option);
        leftButtonClick(table);//按钮点击事件
    }

    //新增-编辑-删除-复选框-搜索
    function leftButtonClick(table) {
        $('#tables').unbind('click').on('click','input:checkbox',function () {
            $(this).parent().parent().toggleClass('choose');
        });
        $('.button .add,.button .change,.button .del').unbind('click').click(function () {
            var es = $('body',parent.document).find('.pop iframe')[0].contentWindow;
            var text = $(this).find('span').text();
            sessionStorage.setItem('poptext',text);
            if (text == '新增'){
                $('body',parent.document).find('.pop').show();
                es.openuser();

            }else if(text == '编辑'){
                var length = $('#tables tbody tr.choose');
                if (length.length==0){
                    alert('请选择一行编辑');
                } else{
                    if (length.length>1){
                        alert('暂不支持多行编辑')
                    } else{
                        $('body',parent.document).find('.pop').show();
                        es.openuserbj($('#tables tbody'))
                    }
                }

            } else if(text == '删除'){
                //table.row('.choose').remove().draw( false );
                $('body',parent.document).find('.pop').show();
                es.opendel(table,$('#tables .choose'));

            }
        });
        $('.button .search input:button').unbind('click').click(function () {
            var value = $(this).siblings().val();
            table.search(value).draw(false);//搜索-单项

        });
        $('.id p').unbind('click').click(function () {//切换角色
            if (!$(this).hasClass('active')) {
                $(this).addClass('active');
                $(this).siblings().removeClass('active');
            }
        });

        $('.password div:last-child input').unbind('click').click(function () { //修改密码
            var oldWord = $(this).parent().siblings().find('input:text').val();
            var newword = $($(this).parent().parent().find('input:password')[0]).val();
            var confirmnewword = $($(this).parent().parent().find('input:password')[1]).val();
            var common = {
                "newPassword":newword,//新密码
                "confirmPassword":confirmnewword,//确认密码
                "oldPassword":oldWord//旧密码
            };
            if (newword === confirmnewword){
                $.post({
                    url:apiUrl + 'login_info/changePassword',
                    data:JSON.stringify(common),
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    success:function (res) {
                        console.log(res)
                    }
                })
            } else{
                alert('密码不一致')
            }

        });

    }
})();