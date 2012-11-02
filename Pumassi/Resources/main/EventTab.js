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
var add = Ti.UI.createButton({
	backgroundImage : "/images/red-cross-icon.png",
	width : 32,
	height : 32
});
add.addEventListener('click', function(e) {

	var childWin = Ti.UI.createWindow({
		title : '이벤트 등록',
		modal : true,
		backgroundColor : '#ccc',
		url : '/forms/EventForm.js'
	});
	childWin.open();
});
win.rightNavButton = add;

var tableView = Ti.UI.createTableView({
	editable : true
});
tableView.addEventListener('click', function(e) {
	// 상세정보 열기
	var detailWin = Ti.UI.createWindow({
		title : e.row.data.eventName,
		data : e.row.data,
		url : "detail/myEvent.js"
	});

	Ti.UI.currentTab.open(detailWin);
});
tableView.addEventListener('delete', function(e) {
	Ti.App.fireEvent("DELETE_EVENT", {
		eventId : e.row.data.eventId
	})
});
win.add(tableView);

Ti.App.addEventListener("UPDATE_EVENT_LIST", function(e) {
	console.log("********** 나의 이벤트 데이터 ************", e.data);
	var rows = [];
	var sections = [];
	var data = e.data;
	for (var i = 0; i < data.length; i++) {
		var item = data[i];
		var row = Ti.UI.createTableViewRow({
			height : 60,
			data : item,
		});

		// 행사 이름
		var lbName = Ti.UI.createLabel({
			left : 10,
			height : 30,
			text : item.eventName,
			font : {
				fontFamily : 'NaumGothic',
				fontSize : 14,
				fontWeight : 'bold'
			},
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT
		});
		row.add(lbName);

		// 행사 메모
		var lbMemo = Ti.UI.createLabel({
			left : 65,
			top : 25,
			height : 30,
			text : item.memo.length < 1 ? "메모 없음" : item.memo,
			font : {
				fontFamily : 'NaumGothic',
				fontSize : 12
			},
			color : '#345',
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT
		});
		row.add(lbMemo);

		// 행사 날짜
		var lbDate = Ti.UI.createLabel({
			left : 65,
			top : 5,
			height : 30,
			text : getDateString(item.eventDate, item.eventTime),
			font : {
				fontFamily : 'NaumGothic',
				fontSize : 12
			},
			color : '#345',
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT
		});
		row.add(lbDate);

		row.hasChild = true;
		if (item.header) {
			var header = Ti.UI.createView({
				backgroundColor : '#789',
				height : 'auto'
			});

			var headerLabel = Ti.UI.createLabel({
				font : {
					fontFamily : 'NanumGothic',
					fontSize : 12,
					fontWeight : 'bold'
				},
				text : item.header,
				color : '#222',
				textAlign : 'left',
				top : 0,
				left : 10,
				width : 300,
				height : 20
			});
			header.add(headerLabel);

			var section = Ti.UI.createTableViewSection();
			section.headerView = header;

			section.add(row);
			sections.push(section);
		} else {
			sections[sections.length - 1].add(row);
		}
	}

	tableView.setData(sections);
});

win.addEventListener('focus', function(e) {
	Ti.App.fireEvent("LOAD_MY_EVENT");
});

