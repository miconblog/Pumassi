// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');
var db = require("db");
db.createDb();


var tabGroup = Titanium.UI.createTabGroup();
var win1 = Titanium.UI.createWindow({  
    title:'품앗이',
    backgroundColor:'#fff',
    font:{fontSize:20,fontFamily:'NanumGothic', fontWeight:'bold'},
    url : '/main/tab1.js'
});
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'품앗이',
    window:win1
});

var win2 = Titanium.UI.createWindow({  
    title:'나의 이벤트',
    backgroundColor:'#fff',
    url : '/main/tab2.js'
});
var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'나의 이벤트',
    window:win2
});

var win3 = Titanium.UI.createWindow({  
    title:'도움말',
    backgroundColor:'#fff',
    url : '/main/tab3.js'
});
var tab3 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'도움말',
    window:win3
});

tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);
tabGroup.addTab(tab3);
tabGroup.open();


Ti.App.addEventListener("GET_EVENT_TYPE", function(e){
	var _data = db.getAllEventType();
	_data[0].selected = true;
	Ti.App.fireEvent("UPDATE_EVENT_TYPE", {data: _data});
});

Ti.App.addEventListener("ADD_EVENT_TYPE", function(e){
	db.addEventType(e.eventName);	
	var _data = db.getAllEventType();
	_data[_data.length-1].selected = true;
	Ti.App.fireEvent("UPDATE_EVENT_TYPE", {data: _data});
});

Ti.App.addEventListener("ADD_EVENT", function(e){
	db.addEvent(e);	
	Ti.App.fireEvent("RELOAD_EVENT");
});

Ti.App.addEventListener("RELOAD_EVENT", function(e){
	
	var data = db.getAllEvent();
	var now = new Date().getTime();
	
	var comingData = []
	for(var i=data.length-1; i>-1; --i){
		
		if( data[i].isLunar ) {
			
			
			// 등록한 날짜를 변환해서 사용
			var oDate = db.getSolarDate(data[i].eventDateValue);
			data[i].dateValue = (new Date(oDate.solar_date)).getTime();
			
		}else{
			
			// 등록한 날짜를 그대로 기준 날짜로 사용
			data[i].dateValue = data[i].eventDateValue;
		}
		
		if ( data[i].dateValue &&  data[i].dateValue > now ){
			comingData.push(data.splice(i,1)[0])	
		}
	}
	
	if(comingData.length > 0){
		comingData[0].header = '곧 다가올 이벤트';
	}
	
	
	if (data.length > 0) {
		data[0].header = '지난 이벤트';
	}
	
	Ti.App.fireEvent("UPDATE_EVENT_LIST", {data:comingData.concat(data)});
});


Ti.App.addEventListener("ADD_PUMASI", function(e){
	Ti.API.info(["ADD_PUMASI", e]);
	
	db.addPumasi(e);
	
	Ti.App.fireEvent("RELOAD_PUMASI");
});


Ti.App.addEventListener("RELOAD_PUMASI", function(e){
	
	var data = db.getPumasi();
	var now = new Date().getTime();
	console.log(data);
	
	var comingData = []
	for(var i=data.length-1; i>-1; --i){
		if ( data[i].dateValue &&  data[i].dateValue > now ){
			comingData.push(data.splice(i,1)[0])	
		}
	}
	
	if(comingData.length > 0){
		comingData[0].header = '곧 다가올 이벤트';
	}
	
	
	if (data.length > 0) {
		data[0].header = '내가 품앗이한 사람';
	}
	
	
	//console.log(data);
	Ti.App.fireEvent("UPDATE_PUMASI_LIST", {data:comingData.concat(data)});
});