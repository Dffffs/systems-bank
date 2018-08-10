(function(){
    var fakeData = {
        head:sessionStorage.getItem('head'),
        topText:sessionStorage.getItem('topText'),
        body:[]
    };
    $(document).ready(function () {
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
        createTable()
    }
    
    //请求数据
    function getData() {
        var url = apiUrl;
        if (fakeData.topText == '商品类别'){
            url += 'article_type/query_article_type'
        } else if(fakeData.topText == '商品品牌'){
            url += 'article_brand/query_article_brand'
        }else if(fakeData.topText == '商品信息'){
            url += 'article/queryArticleList'
        }else{
            url += 'article_unit/query_article_unit'
        }
        $.ajax({
            type:'GET',
            url:url,
            success:function(res){
                fakeData.body = fixedData(res.data);
                console.log(res)
                createTable();
            }
        });
    };
    //处理返回数据
    function fixedData(data) {

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
    }

    //新增-编辑-删除-复选框-搜索
    function leftButtonClick(table) {
        $('#tables').on('click','input:checkbox',function () {
            $(this).parent().parent().toggleClass('choose');
        });
        $('.button .add,.button .change,.button .del').click(function () {
            var es = $('body',parent.document).find('.pop iframe')[0].contentWindow;
            var text = $(this).find('span').text();
            $('body',parent.document).find('.pop').show();
            if (text == '新增'){
                es.openuser();

            }else if(text == '编辑'){
                es.openuserbj();
            } else if(text == '删除'){
                //table.row('.choose').remove().draw( false );
                es.opendel(table);
            }
        });
        $('.button .search input:button').click(function () {
            var value = $(this).siblings().val();
            table.search(value).draw(false);//搜索-单项

        });
        $('.id p').click(function () {//切换角色
            if (!$(this).hasClass('active')) {
                $(this).addClass('active');
                $(this).siblings().removeClass('active');
            }
        });

        $('.password div:last-child input').click(function () { //修改密码
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