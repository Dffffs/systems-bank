'use strict';
(function(){
    var select = [
        {
            name:'首页',
            icon:'首页@2x.png',
            src:'./home.html'
        },{
            name:'基础数据',
            icon:'基础数据@2x.png',
            src:'./basicData.html'
        },{
            name:'采购管理',
            icon:'采购管理@2x.png',
            src:'./buy.html'
        },{
            name:'库存管理',
            icon:'库存管理@2x.png',
            src:'./stock.html'
        },{
            name:'商户管理',
            icon:'商户管理@2x.png',
            src:'./bussiness.html'
        },{
            name:'系统管理',
            icon:'系统管理@2x.png',
            src:'./system.html'
        },
    ];

    var topSelect = [
        {
            text:'基础数据',
            list:['商品类别','商品品牌','商品信息','商品单位'],
            head:[
                ['编码','名称'],
                ['编码','名称'],
                ['货号','品名','规格','单位','商品类别','商品品牌','进货价','零售价'],
                ['编码','单位']
            ],
            table:[ //可编辑的列
                [3],
                [3],
                [3,4,5,6,7,8,9],
                [3]
            ]
        },{
            text:'采购管理',
            list:['供货商','入库'],
            head:[
                ['编码','名称','联系人','联系电话','联系地址','状态','说明'],
                ['业务单号','供货商','入库人名称','创建时间','修改时间','入库总金额']
            ],
            table:[ //可编辑的列
                [1,2],
                [2,4],
                [1,3],
                [2,3]
            ]
        },{
            text:'库存管理',
            list:[],
            head:[
                ['业务单号','零售价盈亏金额','操作时间','盘点人名称']
            ],
            table:[ //可编辑的列
                [1,2],
                [2,4],
                [1,3],
                [2,3]
            ]
        },{
            text:'商户管理',
            list:[],
            head:[
                [['交易号','交易流水','交易时间','订单号','操作人','交易金额','交易状态'],['品名','规格','单位','销量']]
            ],
            table:[ //可编辑的列
                [1,2],
                [2,4],
                [1,3],
                [2,3]
            ]
        },{
            text:'系统管理',
            list:['用户管理','修改密码'],
            head:[
                ['用户名','姓名','状态','权限组','收银'],
                [],
                ['编码','名称','机构类型','角色类型','允许授权'],
                ['店长','操作员','收银员']
            ],
            table:[ //可编辑的列
                [1,2],
                [2,4],
                [1,3],
                [2,3]
            ]
        }
    ];
    $(document).ready(function () {
        selected(select);//生成左侧点击栏
        Allbind();
    });

    //生成左侧点击栏
    function selected(select) {
        var html = '';
        for (var i=0;i<select.length;i++){
            var active='';
            if (i==0){
                active = 'active';
            }

            html += '<div class="left-nav '+active+'">' +
                        '<img src="../img/index/' + select[i].icon + '" alt="">' +
                        '<span>' + select[i].name + '</span>' +
                    '</div>';
        };
        html = '<div class="title">' +
                '<img src="../img/index/中惠旅智慧收银@2x.png" alt="">' +
            '</div>' + html;
        $('#contain .left').html(html);
    };

    //全绑定事件函数
    function Allbind() {
        leftClick();
        topClick();
    }

    //左侧列表点击事件
    function leftClick() {
        $('.left-nav').click(function(){
            if (!$(this).hasClass('active')) {
                if (topSelect[$(this).index() - 2]) {
                    sessionStorage.setItem("head", JSON.stringify(topSelect[$(this).index() - 2]['head'][0]));
                    sessionStorage.setItem("table", JSON.stringify(topSelect[$(this).index() - 2]['table'][0]));
                }

                var others = $(this).siblings().not('.title');
                //匹配内容
                var indexReg = new RegExp('index');
                var statusReg = new RegExp('index-status');
                //根据按钮内容,生成上方点击栏
                var text = $(this).find('span').text();
                var html = '<ul>';
                //生成top点击栏
                for (var e=0;e<topSelect.length;e++){
                    if (topSelect[e].text == text){
                        for (var es=0;es<topSelect[e]['list'].length;es++){
                            let active = '';
                            if (es ==0){
                                active = "active";
                                sessionStorage.setItem("topText", topSelect[e]['list'][es]);
                            }
                            html += "<li class="+active+">"+topSelect[e]['list'][es]+"</li>"
                        }
                    }
                } ;

                for (var i=0;i<others.length;i++){
                    $(others[i]).find('img').attr('src').replace(statusReg,'index');//改变图片
                    $(others[i]).removeClass('active');
                };

                $(this).find('img').attr('src').replace(indexReg,'index-status');//改变图片
                $(this).addClass('active');
                $('.right .content iframe').attr('src',select[$(this).index() - 1]['src']);//更换iframe内容
                html += "</ul>"
                $('.right .top div:first-child').html(html);
            }
        });
    }
    //上方横排点击事件
    function topClick() {
        $('.right .top div').on('click','li',function () {
            var value = sessionStorage.getItem("topText");
            if (value != $(this).text()) {
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
                var index = $('.left-nav.active').index() - 2;
                var index1 = $(this).index();
                if (topSelect[index]){
                    sessionStorage.setItem("head", JSON.stringify(topSelect[index]['head'][index1]));
                    sessionStorage.setItem("table", JSON.stringify(topSelect[index]['table'][index1]));
                }
                //设置topText
                sessionStorage.setItem("topText", $(this).text());
                //刷新iframe
                $('.right .content iframe').attr('src',$('.right .content iframe').attr('src'));
            }
        });
        $('.right .top select').change(function () {
            if ($(this).val() == 'back') {
                $.post({
                    url:apiUrl + 'login_info/quitLogin',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    success:function(res){
                        alert(res.msg);
                        console.log(res)
                    }
                })
            }else{

            }
        })
    }
})();
