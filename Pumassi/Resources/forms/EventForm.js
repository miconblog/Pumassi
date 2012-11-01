var win = Ti.UI.currentWindow;
var close = Ti.UI.createButton({
	title : '취소'
});
close.addEventListener('click', function(e) {
	win.close();
});
win.leftNavButton = close;

var save = Ti.UI.createButton({
	title : '완료',
	enabled : false
});
save.addEventListener('click', function(e) {

	var isRepeat = 0, eventTime = 0;

	// 기념일
	if (eventTypeRow.eventType == 3) {
		isRepeat = lbTime.value;
		eventTime = 0;

	} else {
		isRepeat = 0;
		eventTime = lbTime.value;
	}

	// DB에 입력 한다.
	var oData = {
		eventName : eventTypeRow.title,
		eventType : eventTypeRow.eventType,
		eventDate : dateRow.value,
		isLunar : lunarRow.value,
		isRepeat : isRepeat,
		eventTime : eventTime,
		memo : taMemo.value,
		memoImgPath : memoRow.filePath
	};

	console.log("입력할 데이터 ", oData);

	Ti.App.fireEvent("ADD_MY_EVENT", oData);

	win.close();
});
win.rightNavButton = save;

var checkComplete = function() {
	if (dateRow.hasCheck) {
		save.enabled = true;
	}
};

// 입력폼
var rows = [];
var tableView = Titanium.UI.createTableView({
	//	separatorStyle:Ti.UI.iPhone.TableViewSeparatorStyle.NONE,
	style : Titanium.UI.iPhone.TableViewStyle.GROUPED
});

/**
 * 이벤트 등록
 */
var eventTypeRow = Ti.UI.createTableViewRow({
	header : "추가할 이벤트를 고르세요.",
	hasChild : true,
	color : '#900',
	title : "결혼식",
	value : 0,
	eventType : 1,
	font : {
		fontFamily : 'NanumGothic',
		fontSize : 15
	}
});
var lbTime = Ti.UI.createLabel({
	text : '시간 설정',
	selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
	value : 0,
	height : 30,
	top : 5,
	left : 10,
	width : 120,
	font : {
		fontFamily : 'NanumGothic',
		fontSize : 14
	}
});
var timeSwitch = Ti.UI.createSwitch({
	value : false, // mandatory property for iOS
	enabled : false,
	right : 10
});
var eventPicker = new (require('/ui/EventPicker'))(eventTypeRow, lbTime, timeSwitch);
eventTypeRow.addEventListener("click", function(e) {
	eventPicker.show();
});
rows.push(eventTypeRow);

/**
 * 날짜 설정
 */
var dateRow = Ti.UI.createTableViewRow({
	height : 40,
	header : "날짜",
	title : "날짜 설정",
	value : 0,
	font : {
		fontFamily : 'NanumGothic',
		fontSize : 14
	}
});
timeSwitch.addEventListener('change', function(e) {
	if (eventTypeRow.eventType == 3) {

		if (timeSwitch.value) {
			lbTime.value = 1;
			lbTime.text = "매년반복";
		} else {
			lbTime.value = 0;
			lbTime.text = "반복없음";
		}
		return;
	}

	if (timeSwitch.value) {
		timePicker.show();
	} else {
		lbTime.text = "시간 설정"
	}
});
var lunnarSwitch = Ti.UI.createSwitch({
	value : false, // mandatory property for iOS
	enabled : false,
	right : 10
});
var datePicker = new (require('/ui/DatePicker'))(dateRow, timeSwitch, lunnarSwitch);
dateRow.addEventListener("click", function(e) {
	datePicker.show();
	lunarRow.title = "양력";
	lunnarSwitch.value = false;
	save.enabled = true;
});
rows.push(dateRow);

/**
 * 양력/음력 설정
 */
var lunarRow = Ti.UI.createTableViewRow({
	height : 40,
	title : "양력/음력 설정",
	value : 0,
	selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
	font : {
		fontFamily : 'NanumGothic',
		fontSize : 14
	}
});
lunnarSwitch.addEventListener("change", function(e) {
	if (e.value) {
		lunarRow.title = "음력";
		lunarRow.value = 1;
	} else {
		lunarRow.title = "양력";
		lunarRow.value = 0;
	}
});
lunarRow.add(lunnarSwitch);
rows.push(lunarRow);

/**
 * 시간 설정
 */
var timeRow = Ti.UI.createTableViewRow({
	height : 40,
	selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
});

var timePicker = new (require('/ui/TimePicker'))(lbTime);
timeRow.add(timeSwitch);
timeRow.add(lbTime);
rows.push(timeRow);

/**
 * 메모 설정
 */
var memoRow = Ti.UI.createTableViewRow({
	header : "메모",
	height : 100,
	filePath : "",
	selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
	visible : false
});
var imgView = Ti.UI.createImageView({
	image : '/images/camera.png',
	width : 80,
	height : 80,
	left : 10,
	top : 10
});
imgView.addEventListener('click', function() {
	var dialog = Titanium.UI.createOptionDialog({
		options : ['사진 찍기', '사진 선택', '취소'],
		cancel : 2,
		title : '사진을 추가할까요?!'
	});
	dialog.addEventListener("click", function(e) {
		switch(e.index) {
			case 0:
				// 카메라
				openCamera();
				break;

			case 1:
				// 앨범
				openPhotoAlbum();
				break;
		}

	});
	dialog.show();

});

var taMemo = Ti.UI.createTextArea({
	color : '#888',
	font : {
		fontFamily : "NanumGothic",
		fontSize : 14
	},
	keyboardType : Ti.UI.KEYBOARD_DEFAULT,
	textAlign : 'left',
	top : 10,
	left : 90,
	width : 200,
	height : 80
});
taMemo.addEventListener("click", function(e) {
	tableView.scrollToIndex(6);
});
memoRow.add(imgView);
memoRow.add(taMemo);
rows.push(memoRow);

tableView.setData(rows);
win.add(tableView);

win.addEventListener("open", function(e) {
	Ti.App.fireEvent("GET_EVENT_TYPE");
});
Ti.App.addEventListener("UPDATE_EVENT_TYPE", function(e) {
	console.log('UPDATE_EVENT_TYPE', e.data);
	eventPicker.setData(e.data);
});
