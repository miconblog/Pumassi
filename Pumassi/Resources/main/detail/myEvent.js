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
var now = new Date().getTime();
var tableView = Titanium.UI.createTableView({
	style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
	backgroundColor : "#CCC",
	maxRowHeight : 200
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
		selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
		header : "내가 품앗이한 사람들 (" + e.data.length + "명)",
		height : Ti.UI.SIZE
	});

	// 품앗이 목록
	var pView = Ti.UI.createTableView({
		borderRadius : 10,
		height : Ti.UI.SIZE,
		allowsSelection: false
	});

	var personRows = [];
	if( e.data.length == 0){
		personRows.push({title: "아무도 없어~ 내곁엔 너마저~"});
	}
	for (var i = 0; i < e.data.length; ++i) {
		var person = e.data[i];

		var row = Ti.UI.createTableViewRow({
			title : person.hostName + " (" + person.money / 10000 + "만원)"
		});
		
		console.log("사람 정보: ", person);

		if (now >= win.data.eventDate) {// 지난 일정이라면 정산이 필요하다.
			var button = Ti.UI.createButton({
				title : "방명록에 추가",
				top : 5,
				bottom : 5,
				right : 10,
				height : 30,
				personId : person.hostId,
				personName : person.hostName
			});

			button.addEventListener("click", function(e) {
				
				console.log("버튼 이벤트: ", e.source);
				
				Ti.App.fireEvent("ADD_PERSON_TO_MY_GUEST_BOOK", {
					eventId : win.data.eventId,
					guestId : e.source.personId,
					guestName : e.source.personName
				})
			});
			row.add(button);
		}
		personRows.push(row);
	}
	pView.setData(personRows);
	personRow.add(pView);
	rows.push(personRow);

	/**
	 * 방명록 정산
	 */
	if (now >= win.data.eventDate) {// 과거라면.. 정산이 필요하다.
		var guestRow = Ti.UI.createTableViewRow({
			header : "",
			title : "방명록",
			hasChild : true
		});
	
		guestRow.addEventListener("click", function(e){
			var geustbook = Ti.UI.createWindow({
				title : win.data.eventName + " 방명록",
				data : win.data,
				url : "/main/detail/myGuestBook.js"
			});
			Ti.UI.currentTab.open(geustbook);
		});
		rows.push(guestRow);
	}

	tableView.setData(rows);
});

win.addEventListener("open", function() {
	Ti.App.fireEvent("LOAD_MY_EVENT_INFO", {
		eventId : win.data.eventId,
		eventType : win.data.eventType,
		eventName : win.data.eventName
	});
});
