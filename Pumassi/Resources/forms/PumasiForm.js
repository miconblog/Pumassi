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
		personName 	: nameRow.title,
		personId 	: nameRow.recordId,
		eventName 	: eventTypeRow.title,
		eventType 	: eventTypeRow.eventType,
		money 		: parseInt(tfMoney.value, 10) * 10000,
		eventDate 	: dateRow.value,
		isLunar 	: lunnarRow.value,
		eventTime 	: lbTime.value,
		memo 		: taMemo.value,
		memoImgPath : memoRow.filePath
	};

	console.log("입력할 데이터 ", oData);

	Ti.App.fireEvent("ADD_PUMASI", oData);

	win.close();
});
win.rightNavButton = save;

var checkComplete = function() {
	if (nameRow.hasCheck) {
		save.enabled = true;
	}
};

// 입력폼
var tableView = Titanium.UI.createTableView({
	style : Titanium.UI.iPhone.TableViewStyle.GROUPED
});

var rows = [];

var nameRow = Ti.UI.createTableViewRow({
	header : "이름",
	title : "이름을 선택하세요",
	color : "#900",
	font : {
		fontFamily : 'NanumGothic',
		fontSize : 15
	}
});
nameRow.addEventListener("click", function(e) {
	Ti.Contacts.showContacts({
		selectedPerson : function(event) {
			nameRow.title = event.person.fullName;
			nameRow.recordId = event.person.recordId || event.person.Id;
			nameRow.hasCheck = true;
			checkComplete();
		}
	});
})
var eventTypeRow = Ti.UI.createTableViewRow({
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

var moneyRow = Ti.UI.createTableViewRow({
	header : "금액",
	selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
});
var tfMoneyGuide = Ti.UI.createTextField({
	width : 120,
	value : ""
});
var flexSpace = Titanium.UI.createButton({
	systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});
var confirm = Titanium.UI.createButton({
	title : '확인',
	backgroundImage : '../images/send.png',
	backgroundSelectedImage : '../images/send_selected.png',
	width : 67,
	height : 32
});
confirm.addEventListener('click', function(e) {
	var val = parseInt(tfMoney.value, 10);

	if (!val || val < 1) {
		alert("금액을 입력해주세요!");
		return;
	}

	tfMoney.value = parseInt(tfMoney.value, 10);
	tfMoney.value += " 만원";
	tfMoney.blur();
});

var tfMoney = Ti.UI.createTextField({
	color : '#336699',
	height : 40,
	top : 5,
	left : 10,
	width : 150,
	value : "5 만원",
	returnKeyType : Ti.UI.RETURNKEY_DONE,
	keyboardToolbar : [tfMoneyGuide, flexSpace, confirm],
	keyboardToolbarColor : '#999',
	keyboardToolbarHeight : 40,
	keyboardType : Ti.UI.KEYBOARD_DECIMAL_PAD
});
tfMoney.addEventListener("focus", function(e) {
	tfMoneyGuide.value = "5 만원";
	tfMoney.focus();
	tfMoney.value = 5;
	tableView.scrollToIndex(3);
});
tfMoney.addEventListener("change", function(e) {
	tfMoneyGuide.value = parseInt(e.value, 10) || 0;
	tfMoneyGuide.value += " 만원";
});
moneyRow.add(tfMoney);

/**
 * 날짜 설정, 양력/음력, 시간 설정
 */
var dateRow = Ti.UI.createTableViewRow({
	height : 40,
	header : "날짜",
	title : "날짜 설정",
	font : {
		fontFamily : 'NanumGothic',
		fontSize : 14
	}
});


timeSwitch.addEventListener('change', function(e) {
	
	if ( eventTypeRow.eventType == 3 ){
		
		if (timeSwitch.value) {
			lbTime.value = 1;
			lbTime.text = "매년반복";
		}else{
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
	lunnarRow.title = "양력";
	lunnarSwitch.value = false;
});

var lunnarRow = Ti.UI.createTableViewRow({
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
		lunnarRow.title = "음력";
		lunnarRow.value = 1;
	} else {
		lunnarRow.title = "양력";
		lunnarRow.value = 0;
	}
});
lunnarRow.add(lunnarSwitch);

var timeRow = Ti.UI.createTableViewRow({
	height : 40,
	selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
});

var timePicker = new (require('/ui/TimePicker'))(lbTime);
timeRow.add(timeSwitch);
timeRow.add(lbTime);

var memoRow = Ti.UI.createTableViewRow({
	header : "메모",
	height : 100,
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

rows.push(nameRow);
rows.push(eventTypeRow);
rows.push(moneyRow);
rows.push(dateRow);
rows.push(lunnarRow);
rows.push(timeRow);
rows.push(memoRow);
tableView.setData(rows);

var openCamera = function() {
	Titanium.Media.showCamera({
		success : function(event) {
			var image = event.media;
			imgView.image = image;
			memoRow.filePath = "/GardenDetail/Contents_" + new Date().getTime() + ".jpg";
			taMemo.focus();
		},
		cancel : function() {
			taMemo.focus();
		},
		error : function(error) {
			var a = Titanium.UI.createAlertDialog({
				title : 'Camera'
			});
			if (error.code == Titanium.Media.NO_CAMERA) {
				a.setMessage('Device does not have video recording capabilities');
			} else {
				a.setMessage('Unexpected error: ' + error.code);
			}
			a.show();
		},
		allowEditing : true
	});
}
var openPhotoAlbum = function() {
	Titanium.Media.openPhotoGallery({
		success : function(event) {
			var image = event.media;
			imgView.image = image;
			memoRow.filePath = "/GardenDetail/Contents_" + new Date().getTime() + ".jpg";
			taMemo.focus();
		},
		cancel : function() {
			taMemo.focus();
		},
		allowEditing : true
	});
};

win.add(tableView);
win.addEventListener("open", function(e) {
	Ti.App.fireEvent("GET_EVENT_TYPE");
});
Ti.App.addEventListener("UPDATE_EVENT_TYPE", function(e) {
	console.log('UPDATE_EVENT_TYPE', e.data);
	eventPicker.setData(e.data);
}); 