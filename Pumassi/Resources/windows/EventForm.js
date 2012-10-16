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

	// DB에 입력 한다.
	var oData = {
		eventName : lbType.text,
		eventTypeId : lbType.typeId,
		eventDateStr : lbDate.text,
		eventDateValue : lbDate.value,
		isLunar : lbLunar.value,
		isRepeat : lbRepeat.value,
		memo : taMemo.value,
		memoImage : image.image
	};

	Ti.App.fireEvent("ADD_EVENT", oData);

	win.close();
});
win.rightNavButton = save;

var checkComplete = function() {
	if (row2.hasCheck) {
		save.enabled = true;
	}
};

// 입력폼
var tableView = Titanium.UI.createTableView({
	width : 320,
	//	separatorStyle:Ti.UI.iPhone.TableViewSeparatorStyle.NONE,
	top : 0,
	style : Titanium.UI.iPhone.TableViewStyle.GROUPED
});

var rows = [];
var row1 = Ti.UI.createTableViewRow({
	header : "타입",
	height : 40,
	hasChild : true
});

var lbType = Ti.UI.createLabel({
	color : '#900',
	width : 280,
	height : 30,
	left : 10,
	top : 5,
	typeId : 0,
	text : "결혼식",
	textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
	font : {
		fontFamily : 'NanumGothic',
		fontSize : 15
	}
});
row1.add(lbType);
var eventPicker = new (require('/ui/EventPicker'))(lbType);
row1.addEventListener("click", function(e) {
	eventPicker.show();
});
rows.push(row1)


// 날짜
var row2 = Ti.UI.createTableViewRow({
	header : "날짜",
	height : 40,
	hasChild : true
});
var lbDate = Ti.UI.createLabel({
	text : '날짜를 선택하세요.',
	height : 30,
	top : 5,
	left : 10,
	width : 280,
	font : {
		fontFamily : 'NanumGothic',
		fontSize : 14
	}
});
var datePicker = new (require('/ui/DatePicker'))(lbDate);
row2.addEventListener("click", function(e) {
	datePicker.show();
	row2.hasCheck = true;
	checkComplete();
});
row2.add(lbDate)
rows.push(row2);


// 양력 / 음력
var row3 = Ti.UI.createTableViewRow({
	height : 40,
});

var lbLunar = Ti.UI.createLabel({
	text : '양력',
	height : 30,
	top : 5,
	left : 10,
	width : 280,
	font : {
		fontFamily : 'NanumGothic',
		fontSize : 14
	}
});
row3.add(lbLunar);

var calSwitch = Ti.UI.createSwitch({
	value : false, // mandatory property for iOS
	right : 10
});
calSwitch.addEventListener('change', function(e) {
	if (calSwitch.value) {
		lbLunar.text = '음력';
		lbLunar.value = 1;
	} else {
		lbLunar.text = "양력";
		lbLunar.value = 0;
	}
});
row3.add(calSwitch);
rows.push(row3);


// 반복 주기
var row4 = Ti.UI.createTableViewRow({
	height : 40,
});
var lbRepeat = Ti.UI.createLabel({
	text : '매년 반복 안함',
	height : 30,
	top : 5,
	left : 10,
	width : 280,
	font : {
		fontFamily : 'NanumGothic',
		fontSize : 14
	},
	value : 0
});
var cycleSwitch = Ti.UI.createSwitch({
	value : false, // mandatory property for iOS
	right : 10
});
cycleSwitch.addEventListener('change', function(e) {
	if (cycleSwitch.value) {
		lbRepeat.text = '매년 반복';
		lbRepeat.value = 1;
	} else {
		lbRepeat.text = '매년 반복 안함';
		lbRepeat.value = 0;
	}
});
row4.add(lbRepeat);
row4.add(cycleSwitch);
rows.push(row4);


// 메모 
var row6 = Ti.UI.createTableViewRow({
	header : "메모",
	height : 100
});

var image = Ti.UI.createImageView({
	image : '/images/camera.png',
	widht : 80,
	height : 80,
	left : 10,
	top : 10
});
row6.add(image);

var taMemo = Ti.UI.createTextArea({
	color : '#888',
	font : {
		fontFamily : "NanumGothic",
		fontSize : 14
	},
	keyboardType : Ti.UI.KEYBOARD_DEFAULT,
	returnKeyType : Ti.UI.RETURNKEY_DONE,
	textAlign : 'left',
	top : 10,
	left : 90,
	width : 200,
	height : 80
});
row6.add(taMemo);
rows.push(row6);

tableView.setData(rows);
win.add(tableView);



win.addEventListener("open", function(e){
	Ti.App.fireEvent("GET_EVENT_TYPE");
});
Ti.App.addEventListener("UPDATE_EVENT_TYPE", function(e){
	console.log('UPDATE_EVENT_TYPE', e.data);
	eventPicker.setData(e.data);
});
