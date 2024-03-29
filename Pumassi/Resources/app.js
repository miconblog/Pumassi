Titanium.UI.setBackgroundColor('#000');
var db = require("db");
db.createDb();

var tabGroup = Titanium.UI.createTabGroup();
var win1 = Titanium.UI.createWindow({
	title : '품앗이',
	backgroundColor : '#fff',
	font : {
		fontSize : 20,
		fontFamily : 'NanumGothic',
		fontWeight : 'bold'
	},
	url : '/main/PumassiTab.js'
});
var tab1 = Titanium.UI.createTab({
	icon : '/images/group-icon.png',
	title : '품앗이',
	window : win1
});

var win2 = Titanium.UI.createWindow({
	title : '나의 이벤트',
	backgroundColor : '#fff',
	url : '/main/EventTab.js'
});
var tab2 = Titanium.UI.createTab({
	icon : '/images/flag-green-icon.png',
	title : '나의 이벤트',
	window : win2
});

var win3 = Titanium.UI.createWindow({
	title : '도움말',
	backgroundColor : '#fff',
	url : '/main/SettingTab.js'
});
var tab3 = Titanium.UI.createTab({
	icon : '/images/preferences-icon.png',
	title : '도움말',
	window : win3
});

tabGroup.addTab(tab1);
tabGroup.addTab(tab2);
tabGroup.addTab(tab3);
tabGroup.open();

/// ########### 이벤트

Ti.App.addEventListener("GET_EVENT_TYPE", function(e) {
	var _data = db.getAllEventType();
	_data[0].selected = true;
	Ti.App.fireEvent("UPDATE_EVENT_TYPE", {
		data : _data
	});
});

Ti.App.addEventListener("ADD_EVENT_TYPE", function(e) {
	db.addEventType(e.eventName);
	var _data = db.getAllEventType();
	_data[_data.length - 1].selected = true;
	Ti.App.fireEvent("UPDATE_EVENT_TYPE", {
		data : _data
	});
});


Ti.App.addEventListener("LOAD_MY_EVENT", function(e) {

	var data = db.getMyEvent();
	var now = new Date().getTime();
	var hasComingEvent = false;
	var hasPastEvent = false;

	for (var i = 0; i < data.length; ++i) {
		var item = data[i];

		console.log(i, "이벤트 정보: ", item.eventDate, now);

		if (item.eventDate - 0 >= now) {
			item.isPast = false;
			if (!hasComingEvent) {
				item.header = "곧 다가올 행사";
				hasComingEvent = true;
			}
		} else {
			item.isPast = true;
			if (!hasPastEvent) {
				item.header = "지난 이벤트";
				hasPastEvent = true;
			}
		}
	}


	Ti.App.fireEvent("UPDATE_EVENT_LIST", {
		data : data
	});
});

Ti.App.addEventListener("LOAD_MY_EVENT_INFO", function(e){
	var data = db.getMyEventById(e.eventId, e.eventType, e.eventName);
	Ti.App.fireEvent("LOADED_MY_EVENT_INFO", {data:data})
});



Ti.App.addEventListener("ADD_PUMASI", function(e) {
	db.addPumasi(e);
	Ti.App.fireEvent("LOAD_PUMASI");
});

Ti.App.addEventListener("ADD_MY_EVENT", function(e){
	db.addMyEvent(e);
	Ti.App.fireEvent("LOAD_MY_EVENT");	
});

/**
 * 품앗이 정보를 로드한다.
 */
Ti.App.addEventListener("LOAD_PUMASI", function(e) {

	var data = db.getPumasi();
	var now = new Date().getTime();
	var hasComingEvent = false;
	var hasPastEvent = false;

	for (var i = 0; i < data.length; ++i) {
		var item = data[i];

		console.log(i, "품앗이 정보: ", item.eventDate, now);

		if (item.eventDate - 0 >= now) {
			item.isPast = false;
			if (!hasComingEvent) {
				item.header = "곧 다가올 이벤트";
				hasComingEvent = true;
			}
		} else {
			item.isPast = true;
			if (!hasPastEvent) {
				item.header = "지난 이벤트";
				hasPastEvent = true;
			}
		}
	}

	console.log("***** 품앗이 정보를 로드한다. ********", data);

	Ti.App.fireEvent("UPDATE_PUMASI_LIST", {
		data : data
	});
});

/**
 * 방명록 정보를 가져온다.
 */
Ti.App.addEventListener("LOAD_GUEST_BOOK", function(e) {
	var data = db.getGuestBookInfoById(e.eventId, e.guestId);
	Ti.App.fireEvent("LOADED_GUEST_BOOK", {
		data : data
	});
});
Ti.App.addEventListener("LOAD_MY_EVENT_GUEST_BOOK", function(e) {
	var data = db.getGuestBookInfoById(e.eventId, 100);
	Ti.App.fireEvent("LOADED_MY_EVENT_GUEST_BOOK", {
		data : data
	});
});



/**
 * 정산확인 완료
 */
Ti.App.addEventListener("CHECK_EVENT_COMFIRM", function(e) {
	db.updateEvent(e.eventId, "isCompleted", 1);
});
Ti.App.addEventListener("UPDATE_EVENT_DATE", function(e){
	db.updateEvent(e.eventId, "eventDate", e.value);
});
Ti.App.addEventListener("UPDATE_EVENT_MEMO", function(e){
	console.log("메모 저장", e);
	db.updateEvent(e.eventId, "memo", e.value);
});
Ti.App.addEventListener("UPDATE_EVENT_TIME", function(e){
	db.updateEvent(e.eventId, "eventDate", e.value);
	db.updateEvent(e.eventId, "eventTime", e.eventTime);
});


/**
 * 이벤트 삭제
 */
Ti.App.addEventListener("DELETE_EVENT", function(e){
	db.deleteEvent(e.eventId);
});

/**
 * 이벤트 참석 유무 결정
 */
Ti.App.addEventListener("UPDATE_GUESTBOOK_ATTEND", function(e){
	db.updateMyGuestbook(e.eventId, "isAttend", e.value);
});

Ti.App.addEventListener("UPDATE_GUESTBOOK_MEMO", function(e){
	db.updateMyGuestbook(e.eventId, "memo", e.value);
});

Ti.App.addEventListener("UPDATE_GUESTBOOK_MONEY", function(e){
	db.updateMyGuestbook(e.eventId, "money", e.value);
});
Ti.App.addEventListener("ADD_PERSON_TO_MY_GUEST_BOOK", function(e){
	db.addGuestBook(e.eventId, e.guestId, e.guestName)
});

Ti.App.addEventListener("UPDATE_MY_EVENT_GUESTBOOK", function(e){
	db.updateGuestbook(e.guestbookId, e.field, e.value);
});

/**
 * 통계정보를 불러온다.
 */
Ti.App.addEventListener("LOAD_STATICS", function(e){
	var info = db.getStatics();
	Ti.App.fireEvent("LOADED_STATICS", info);
});