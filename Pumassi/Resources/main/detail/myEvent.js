var getDateString = function(dt) {
	if (dt < 1) {
		return "날짜 미지정";
	} else {
		dt = new Date(dt);

		var Y = dt.getFullYear();
		var M = dt.getMonth() + 1;
		var D = dt.getDate();

		var h = dt.getHours();
		var m = dt.getMinutes();
		var s = (h > 12) ? " (오후 " : " 오전 ";

		if (h > 12) {
			h -= 12;
		}

		var str = Y + "년 " + M + "월 " + D + "일" + s + h + "시";

		if (m == 0) {
			str += ")"
		} else {
			str += " " + m + "분)";
		}

		return str;
	}
};

var win = Ti.UI.currentWindow;
var tableView = Titanium.UI.createTableView({
	style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
	backgroundColor : "#CCC"
});
win.add(tableView);

Ti.App.addEventListener("LOADED_MY_EVENT_INFO", function(e) {
	console.log("********** 상세 정보 *********", win.data);
	var rows = [];
	/**
	 * 날짜 정보
	 */
	var dateRow = Ti.UI.createTableViewRow({
		selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
		backgroundColor : "#FFF",
		header : "날짜",
		title : getDateString(win.data.eventDate),
	});
	rows.push(dateRow);

	/**
	 * 메모 수정 가능
	 */
	var memoRow = Ti.UI.createTableViewRow({
		header : "메모",
		selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
	});
	var taMemo = Ti.UI.createTextArea({
		font : {
			fontFamily : "NanumGothic",
			fontSize : 14
		},
		value : win.data.memo,
		keyboardType : Ti.UI.KEYBOARD_DEFAULT,
		returnKeyType : Ti.UI.RETURNKEY_DONE,
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
		Ti.App.fireEvent("UPDATE_EVENT_MEMO", {
			eventId : win.data.eventId,
			value : taMemo.value
		});
	});
	memoRow.add(taMemo);
	rows.push(memoRow);

	/**
	 * 품앗이한 사람들
	 */
	console.log("***** 초대해야할 사람들 *****", e);
	var personRow = Ti.UI.createTableViewRow({
		header : "초대할 사람들"
	});
	rows.push(personRow);

	tableView.setData(rows);
});

win.addEventListener("open", function() {
	Ti.App.fireEvent("LOAD_MY_EVENT_INFO", {
		eventId : win.data.eventId,
		eventType: win.data.eventType,
		eventName: win.data.eventName
	});
});
