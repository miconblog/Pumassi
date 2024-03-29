var getDateString = function(dt) {
	if (dt < 1) {
		return "날짜 미지정";
	} else {
		dt = new Date(dt);

		var Y = dt.getFullYear();
		var M = dt.getMonth() + 1;
		var D = dt.getDate();
		return Y + "년 " + M + "월 " + D + "일";
	}
};

var getTimeString = function(dt, time) {
	if (time < 1) {
		return "시간 미지정";
	} else {
		dt = new Date(dt);
		var h = dt.getHours();
		var m = dt.getMinutes();
		var s = (h > 12) ? " 오후 " : " 오전 ";

		if (h > 12) {
			h -= 12;
		}

		return s + h + "시 " + m + "분";
	}
};

var win = Ti.UI.currentWindow;
console.log("********** 상세 정보 *********", win.data);

var tableView = Titanium.UI.createTableView({
	style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
	backgroundColor : "#CCC"
});
win.add(tableView);

Ti.App.addEventListener("LOADED_GUEST_BOOK", function(e) {
	var rows = [];

	/**
	 * 참석 여부 설정
	 */
	if (win.data.isPast) {
		var attendRow = Ti.UI.createTableViewRow({
			backgroundColor : "#FFF",
			height : 40,
			header : "참석 했습니까?",
			title : e.data.isAttend ? "참석" : "불참",
			value : 0,
			font : {
				fontFamily : 'NanumGothic',
				fontSize : 14
			}
		});

		var attendSwitch = Ti.UI.createSwitch({
			right : 10,
			value : e.data.isAttend ? true : false
		});
		attendSwitch.addEventListener("change", function(e) {
			Ti.App.fireEvent("UPDATE_GUESTBOOK_ATTEND", {
				eventId : win.data.eventId,
				value : e.value
			});

			if (e.value) {
				attendRow.title = "참석";
			} else {
				attendRow.title = "불참";
			}
		});
		attendRow.add(attendSwitch);
		rows.push(attendRow);
	}

	/**
	 * 금액
	 */
	var moneyRow = Ti.UI.createTableViewRow({
		header : "금액",
		backgroundColor : "#FFF",
		layout : "horizontal"
	});

	var money = e.data.money / 10000;

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

		var money = parseInt(tfMoney.value, 10);
		tfMoney.value = money;
		tfMoney.value += " 만원";
		tfMoney.blur();

		Ti.App.fireEvent("UPDATE_GUESTBOOK_MONEY", {
			eventId : win.data.eventId,
			value : money * 10000
		});
	});

	var tfMoney = Ti.UI.createTextField({
		color : '#336699',
		height : 40,
		left : 10,
		width : Ti.UI.FILL,
		value : money + " 만원",
		returnKeyType : Ti.UI.RETURNKEY_DONE,
		keyboardToolbar : [tfMoneyGuide, flexSpace, confirm],
		keyboardToolbarColor : '#999',
		keyboardToolbarHeight : 40,
		keyboardType : Ti.UI.KEYBOARD_DECIMAL_PAD
	});
	tfMoney.addEventListener("focus", function(e) {
		tfMoneyGuide.value = money + " 만원";
		tfMoney.focus();
		tfMoney.value = money;
	});
	tfMoney.addEventListener("change", function(e) {
		tfMoneyGuide.value = parseInt(e.value, 10) || 0;
		tfMoneyGuide.value += " 만원";
	});
	moneyRow.add(tfMoney);
	rows.push(moneyRow);

	/**
	 * 날짜 설정
	 */
	var dateRow = Ti.UI.createTableViewRow({
		backgroundColor : "#FFF",
		height : 40,
		header : "날짜",
		title : getDateString(win.data.eventDate),
		value : win.data.eventDate,
		font : {
			fontFamily : 'NanumGothic',
			fontSize : 14
		}
	});

	var datePicker = new (require('/ui/DatePicker'))(dateRow);
	datePicker.on("complete", function(e){
		Ti.App.fireEvent("UPDATE_EVENT_DATE", {eventId: win.data.eventId, value: dateRow.value})
	});
	dateRow.addEventListener("click", function(e) {
		tableView.scrollToIndex(6);
		datePicker.show();
	});
	rows.push(dateRow);

	/**
	 * 시간 설정
	 */
	var timeRow = Ti.UI.createTableViewRow({
		backgroundColor : "#FFF",
		height : 40,
		value : win.data.eventTime,
		title : getTimeString(win.data.eventDate, win.data.eventTime),
		font : {
			fontFamily : 'NanumGothic',
			fontSize : 14
		}
	});
	
	var timePicker = new (require('/ui/TimePicker'))(timeRow);
	timePicker.on("complete", function(e){
		var dt = new Date(dateRow.value);
		dt.setHours(0);
		dt.setMinutes(0);
		
		Ti.App.fireEvent("UPDATE_EVENT_TIME", {eventId: win.data.eventId, value: dt.getTime() + timeRow.value, eventTime:timeRow.value})
	});
	timeRow.addEventListener("click", function(e) {
		tableView.scrollToIndex(6);
		timePicker.show();
	});
	rows.push(timeRow);

	/**
	 * 메모
	 */
	var memoRow = Ti.UI.createTableViewRow({
		backgroundColor : "#FFF",
		header : "메모"
	});
	var taMemo = Ti.UI.createTextArea({
		font : {
			fontFamily : "NanumGothic",
			fontSize : 14
		},
		value : e.data.memo,
		keyboardType : Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType: Ti.UI.RETURNKEY_DONE,
		textAlign : 'left',
		width : Ti.UI.FILL,
		borderRadius : 10,
		height : 80
	});
	taMemo.addEventListener("click", function(e) {
		tableView.scrollToIndex(4);
	});
	taMemo.addEventListener("return", function(e) {
		console.log("******* 메모 저장 *******", taMemo.value);
		Ti.App.fireEvent("UPDATE_GUESTBOOK_MEMO", {eventId: win.data.eventId, value: taMemo.value});
	});
	memoRow.add(taMemo);
	rows.push(memoRow);

	/**
	 * 참고 정보
	 */

	/**
	 * 정산 완료!
	 */
	if (!win.data.isCompleted && win.data.isPast) {
		var completeRow = Ti.UI.createTableViewRow({
			header : "",
			title : ""
		});
		var button = Ti.UI.createButton({
			title : "확인 완료",
			width : Ti.UI.FILL
		});
		button.addEventListener("click", function() {
			Ti.App.fireEvent("CHECK_EVENT_COMFIRM", {
				eventId : win.data.eventId
			});
			win.close();
		});
		completeRow.add(button);
		rows.push(completeRow);
	}

	tableView.setData(rows);
});

win.addEventListener("open", function() {
	// 내가 품앗이한 방명록 정보
	Ti.App.fireEvent("LOAD_GUEST_BOOK", {
		eventId : win.data.eventId,
		guestId : 0
	});
});
