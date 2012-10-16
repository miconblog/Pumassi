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
		personName : lbName.text,
		personId : lbName.recordId,
		eventName : lbType.text,
		eventTypeId : lbType.typeId,
		money : tfMoney.value,
		dateStr : lbDate.text,
		dateValue : lbDate.value,
		isAlram : alramSwitch.value,
		alramStr : lbAlram.text,
		alramValue : lbAlram.value,
		memo : taMemo.value,
		memoImage : image.image
	};

	Ti.App.fireEvent("ADD_PUMASI", oData);

	win.close();
});
win.rightNavButton = save;

var checkComplete = function() {
	if (row1.hasCheck && row3.hasCheck) {
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
	header : "이름",
	height : 40
});

var lbName = Ti.UI.createLabel({
	color : '#900',
	width : 280,
	height : 30,
	left : 10,
	top : 5,
	text : "이름을 선택하세요",
	textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
	font : {
		fontFamily : 'NanumGothic',
		fontSize : 15
	}
});
row1.add(lbName);
row1.addEventListener("click", function(e) {
	Ti.Contacts.showContacts({
		selectedPerson : function(event) {
			lbName.text = event.person.fullName;
			lbName.recordId = event.person.recordId || event.person.Id;
 			row1.hasCheck = true;
			checkComplete();
		}
	});
})
rows.push(row1);

var row2 = Ti.UI.createTableViewRow({
	height : 40,
	hasChild : true,
});
var lbType = Ti.UI.createLabel({
	color : '#900',
	width : 280,
	height : 30,
	left : 10,
	top : 5,
	value : 0,
	typeId : 1,
	text : "결혼식",
	textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
	font : {
		fontFamily : 'NanumGothic',
		fontSize : 15
	}
});
var eventPicker = new (require('/ui/EventPicker'))(lbType);
row2.addEventListener("click", function(e) {
	eventPicker.show();
});
row2.add(lbType);
rows.push(row2)

var row3 = Ti.UI.createTableViewRow({
	header : "금액",
	height : 40
});

var flexSpace = Titanium.UI.createButton({
	systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});

var tfMoneyGuide = Ti.UI.createTextField({
	width : 120,
	value : ""
});

var send = Titanium.UI.createButton({
	title : '확인',
	backgroundImage : '../images/send.png',
	backgroundSelectedImage : '../images/send_selected.png',
	width : 67,
	height : 32
});
send.addEventListener('click', function(e) {
	if (tfMoney.value !== "") {
		tfMoney.blur();
		row3.hasCheck = true;
		checkComplete();
	}

});

var tfMoney = Ti.UI.createTextField({
	color : '#336699',
	height : 30,
	top : 5,
	left : 10,
	width : 150,
	value : 0,
	keyboardToolbar : [tfMoneyGuide, flexSpace, send],
	keyboardToolbarColor : '#999',
	keyboardToolbarHeight : 40,
	keyboardType : Titanium.UI.KEYBOARD_NUMBER_PAD
});
tfMoney.addEventListener("change", function(e) {
	tfMoneyGuide.value = e.value + " 원";
});
row3.add(tfMoney);
row3.addEventListener("click", function(e) {
	tfMoneyGuide.value = "0 원";
	tfMoney.focus();
	tfMoney.value = "";
});

rows.push(row3);

var row4 = Ti.UI.createTableViewRow({
	header : "날짜",
	height : 40
});
var lbDate = Ti.UI.createLabel({
	text : '날짜 미입력',
	height : 30,
	top : 5,
	left : 10,
	width : 120,
	font : {
		fontFamily : 'NanumGothic',
		fontSize : 14,
		fontWeight : 'bold'
	}
});
var alramSwitch = Ti.UI.createSwitch({
	value : false, // mandatory property for iOS
	enabled : false,
	right : 10
});
alramSwitch.addEventListener('change', function(e) {
	if (alramSwitch.value) {
		timePicker.show();
	} else {
		lbAlram.text = "알림 설정"
	}
});
var datePicker = new (require('/ui/DatePicker'))(lbDate, alramSwitch);
row4.addEventListener("click", function(e) {
	datePicker.show();
});
row4.add(lbDate)
rows.push(row4);

var row5 = Ti.UI.createTableViewRow({
	height : 40,
	visible : false
});
var lbAlram = Ti.UI.createLabel({
	text : '알림 설정',
	height : 30,
	top : 5,
	left : 10,
	width : 120,
	font : {
		fontFamily : 'NanumGothic',
		fontSize : 14,
		fontWeight : 'bold'
	}
});
var timePicker = new (require('/ui/TimePicker'))(lbAlram);
row5.add(alramSwitch);
row5.add(lbAlram);
rows.push(row5);

var row6 = Ti.UI.createTableViewRow({
	header : "메모",
	height : 100,
	visible : false
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
//
// // Listen for click events.
// tableView.addEventListener('click', function(e) {
// alert('title: \'' + e.row.title + '\', section: \'' + e.section.headerTitle + '\', index: ' + e.index);
// });

// Add to the parent view.
win.add(tableView);
win.addEventListener("open", function(e){
	Ti.App.fireEvent("GET_EVENT_TYPE");
});
Ti.App.addEventListener("UPDATE_EVENT_TYPE", function(e){
	console.log('UPDATE_EVENT_TYPE', e.data);
	eventPicker.setData(e.data);
});




// var tfType = Ti.UI.createTextField({
// color : '#336699',
// backgroundColor : "#FFF",
// height : 29, // 볼더 2px 뺀 값
// top : 5,
// left : 60,
// width : 188, // 볼더 2px 뺀 값
// zIndex : 10,
// visible : false,
// borderStyle : Ti.UI.INPUT_BORDERSTYLE_LINE
// });
// typeView.add(tfType);
//
// var btnType = Ti.UI.createButtonBar({
// labels : ["확인"],
// backgroundColor : '#336699',
// borderRadius : 0,
// style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
// height : 30,
// width : 63,
// left : 247,
// top : 5,
// visible : false,
// zIndex : 10
// });
//
// typeView.add(btnType);
//
// var bb1 = Titanium.UI.iOS.createTabbedBar({
// labels : ['결혼식', '돌잔치', '장례식', '직접입력'],
// backgroundColor : '#336699',
// left : 60,
// style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
// height : 30,
// width : 250
// });
// bb1.addEventListener("click", function(e) {
// Ti.API.info(e.index);
// tfMoney.blur();
// tfName.blur();
//
// if (e.index === 3) {// 직접입력
// tfType.show();
// btnType.show();
// } else {
//
// }
// });
// typeView.add(bb1);
//
