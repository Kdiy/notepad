!function($){
    /*
     * $(ele).notePad('2018','11',obj)
     * arr
     * arr->obj->type  yet /  full
     * [
     *    {date,type,msg},
     *    {date:'2018-11-13',type:'yet',msg:'车贷宝还未回款'},
     *    {'2018-11-13','full','小黑鱼已回款'}
     * ]
     */
    $.fn.notePad=function(year,month,obj) {
        var _html = this;

        var   nowYear = new Date().getFullYear()
            , nowMonth = new Date().getMonth() + 1
            , nowDay = new Date().getDate()
            , nowWeek = new Date().getDay();
        var _year = typeof year == 'undefined' || year=='' ? nowYear : year;
        var _month = typeof month == 'undefined' || month=='' ? nowMonth : month;
        var _obj=typeof  obj=='undefined' || obj=='' || typeof obj!=='object'?[]:obj;
        var monthCN=['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
        var weekCN=['周日','周一','周二','周三','周四','周五','周六'];
        var weeksCN=['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
        var eachCN=function(type){
            var html='';
            if(type=='month'){
                for(var i in monthCN){
                    html+='<li data-note="monthsli" onclick="getNoteMonth(this)">'+monthCN[i]+'</li>';
                }
            }else if(type='week'){
                for(var i in weekCN){
                    html+='<li data-note="weekDay"><p>'+weekCN[i]+'</p></li>';
                }
            }
            return html;
        }
        var _weekHTML='<div class="note-header">' +
            '            <ul class="note-week-list">' +eachCN('week')+'</ul>' +
            '        </div>';
        var _toolBarHTML='<div class="note-toolbar-radius">' +
            '                <div class="note-radius-group">' +
            '                    <div class="note-radius"><span>●</span><span>类型1</span></div>' +
            '                    <div class="note-radius"><span>●</span><span>类型2</span></div>' +
            '                    <div class="note-radius"><span>●</span><span>类型3</span></div>' +
            '                </div>' +
            '            </div>'

        var _headerHTML='<div class="note-toolbar">' +
            '            <div class="note-year-active">' +
            '                <span class="glyphicon glyphicon-menu-left" data-note="preYear" onclick="getNoteYear(this,-1)"></span>' +
            '                <span class="note-default-color" data-note="year">'+_year+'</span>' +
            '                <span class="glyphicon glyphicon-menu-right" data-note="nextYear" onclick="getNoteYear(this,1)"></span>' +
            '            </div>' +
            '            <div class="note-month-active">' +
            '                <span class="note-default-color" data-note="month">'+monthCN[_month-1]+'</span>' +
            '                <span class="note-dropdown glyphicon glyphicon-menu-down" data-note="monthCheck"></span>' +
            '                <div class="note-dropdown-content" data-note="monthContent">' +
            '                    <ul class="note-month-list" data-note="montList">' +eachCN('month')+'</ul>' +
            '                </div>' +
            '            </div>' +_toolBarHTML+
            '        </div>';





        //获取当前月份天数
        var getMonthDay = function () {
            var time = new Date(_year, _month, 0);
            return time.getDate();
        };
        //获取星期几
        var getWeekDay = function (date) {
            var time = typeof  date == 'undefined' ? new Date() : new Date(date)
                , week = time.getDay();
            return weeksCN[week];
        };
        //当月1号星期几
        var getMonthFirstDayWeek = function () {
            var str = _year + '-' + _month + '-01';
            var date = new Date(str);
            return date.getDay();
        };
        //上月最后一天+星期
        var getPreMonthLastDay = function () {
            var str = _year + '-' + _month + '-01';
            var date1 = new Date(str);
            var date = new Date(date1.getTime() - 24 * 60 * 60 * 1000);
            return [date.getDate(), date.getDay()];
        };
        //当月最后一天+星期一
        var getNowMonthLastDay = function () {
            var str = _year + '-' + _month + '-' + getMonthDay();
            var date = new Date(str);
            return date.getDay();
        }
        var getNextMonthAllDay = function () {
            var week = getNowMonthLastDay();
            var arr = [];
            if (week < 6) {
                var day = 6 - week;
                for (var i = 1; i <= day; i++) {
                    arr.push(i);
                }
            }
            return arr;
        }
		//var monthCN=['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
		function getNoteMonth(d){
			var year=$("[data-note='year']").text();
			var month=parseInt(monthCN.indexOf($(d).text()))+1;
			month=month.toString().length<2?'0'+month:month;
			payback(year,month,year+'-'+month+'-01')
		}
		function getNoteYear(d,n){
			var year=$("[data-note='year']").text();
			var month=parseInt(monthCN.indexOf($("[data-note='month']").text()))+1;
			month=month.toString().length<2?'0'+month:month;
			payback(parseInt(year)+n,month,parseInt(year)+n+'-'+month+'-01');
		}

        //获取上个月余下的所有天数
        var getPreMonthAllDay = function () {
            var arr = [];
            var preMonthWeek = getPreMonthLastDay()[1];
            var preMonthLastDay = getPreMonthLastDay()[0];
            if (preMonthWeek < 6) {
                var startday = parseInt(preMonthLastDay) - parseInt(preMonthWeek);
                for (var i = startday; i <= preMonthLastDay; i++) {
                    arr.push(i);
                }
            }
            return arr;
        }
        //获取当月所有天数
        var getMonthAllDay = function () {
            //上月余下天数+当月所有天数+下月天数
            var arr = getPreMonthAllDay();
            var days = getMonthDay();
            var next = getNextMonthAllDay();
            for (var i = 1; i <= days; i++) {
                arr.push(i);
            }
            if (next.length > 0) {
                for (var j in next) {
                    arr.push(next[j]);
                }
            }
            return arr;
        }
        //天数分组
        var groupAllDay = function () {
            var arr = getMonthAllDay();
            var counts = Math.ceil(arr.length / 7);
            var group = [];
            for (var j = 0; j < counts; j++) {
                group[j] = new Array();
            }
            var coutuine = 1;
            for (var i in arr) {
                var index = Math.floor(i / 7);
                group[index].push(arr[i]);
            }
            return group;
        }
        //
        var notice=function(date){

            var html=''
                ,done=1
                ,max=2;         //每列最大显示数量
            for(var i in _obj){
                if(_obj[i].date==date && done<=max){
                    var cssClass=_obj[i].type=='yet'?"note-tips-yet":"note-tips-full";
                    html+='<p class="'+cssClass+'" data-note="notice">'+_obj[i].msg+'</p>'
                    done++;
                }
            }
            return html;
        }
        //createElement
        var eachAllDays = function () {
            var group = groupAllDay();
            var html = '';
            for (var i in group) {

                var td = '';
                var td_arr = group[i];
                for (var j in td_arr) {
                    var date;
                    var day=td_arr[j].toString().length<2?'0'+td_arr[j]:td_arr[j];
                    if(i==0 && td_arr[j]>7){
                        date=_year+'-'+parseInt(_month-1)+'-'+day;
                    }else if(i==group.length-1 && td_arr[j]<7){
                        date=_year+'-'+parseInt(_month+1)+'-'+day;
                    }else{
                        date=_year+'-'+_month+'-'+day;
                    }
                    var cssClass=i==0 && td_arr[j]> 7 || i==group.length-1 && td_arr[j] < 7 ? "old":td_arr[j]==nowDay && _month==nowMonth && _year==nowYear?td_arr[j].toString().length==2?'note-nowday-doublechar':'note-nowday-char':'';
                    td +='<li><p><span class="'+cssClass+'">' + td_arr[j] + '</span></p>'+notice(date)+'</li>';
                }
                html += '<ul class="note-day-list">' + td + '</ul>';
            }
            return '<div class="note-content">'+html+'</div>';
        }
        //createElement
        var createEle=function(){
            var daysHTML=eachAllDays();
            var html=_headerHTML+_weekHTML+daysHTML;
            _html.html(html);
        }
        //event
        var noteEvent={
            init:function(){
                this.dropDown();
                this.noteClick();

            },
            dropDown:function(){
                var $ele=$('[data-note="monthContent"]');
                $('[data-note="monthCheck"]').click(function(){
                    var block=$ele.css("display")=='none'?"block":"none";
                    $ele.css("display",block)
                });



                // $(':not([data-note="monthContent"])').click(function () {
                //     var $ele=$('[data-note="monthContent"]');
                //     $ele.css("display")=='block'?$ele.css("display","none"):'';
                // })
            },
            noteClick:function(){
                var pop=this;
                $('[data-note="montList"]>li').click(function(){
                    $('[data-note="monthContent"]').hide();
                    $('[data-note="month"]').text($(this).text());
                    pop.active()
                });
                $('[data-note="nextYear"]').click(function(){
                    var $year=$('[data-note="year"]')
                    $year.text(parseInt($year.text())+1);
                    pop.active()
                });
                $('[data-note="preYear"]').click(function(){
                    var $year=$('[data-note="year"]')
                    $year.text(parseInt($year.text())-1);
                    pop.active()
                });

            },
            active:function(){
                 _year=$('[data-note="year"]').text();
                 _month=$('[data-note="month"]').text();
                _html.notePad(year,parseInt(monthCN.indexOf(month))+1,_obj)
            }
        };

        var init=function(){
            createEle();
            noteEvent.init();


        }
        init()
    }

}(jQuery)
