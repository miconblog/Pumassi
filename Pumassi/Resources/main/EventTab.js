var win = Ti.UI.currentWindow;
var add = Ti.UI.createButton({
	systemButton : Titanium.UI.iPhone.SystemButton.ADD
});
add.addEventListener('click', function(e) {

	var childWin = Ti.UI.createWindow({
		title : '이벤트 등록',
		modal : true,
		backgroundColor : '#ccc',
		url : '/windows/EventForm.js'
	});
	childWin.open();
});
win.rightNavButton = add;

Ti.App.addEventListener("UPDATE_EVENT_LIST", function(e) {
	console.log("테이블 데이터", e.data);

	var data = [{
		type : 1,
		name : '돌잔치',
		date : '오늘(2012-07-04) 오후 3시',
		memo : '둘째 녀석 첫돌',
		required : 30,
		onlyMoney : 10,
		header : '곧 다가올 이벤트'
	}, {
		type : 4,
		name : '기념일',
		required : 0,
		onlyMoney : 0,
		date : '오늘(2012-07-04)',
		memo : '할머니 생신'
	}, {
		type : 1,
		date : '날짜 정보 없음',
		name : '결혼식',
		header : '지난 이벤트',
		required : 30,
		onlyMoney : 10,
		required2 : 20,
		onlyMoney2 : 10,
		total : 120,
		memo : '예식장 어디서 하지?'
	}];

});

// Create a TableView.
var aTableView = Ti.UI.createTableView();
var rows = [];
var sections = [];
var data = [];
for (var i = 0; i < data.length; i++) {
	var row = Ti.UI.createTableViewRow({
		height : 60
	});

	// 이름
	var lbName = Ti.UI.createLabel({
		left : 10,
		height : 30,
		text : data[i].name,
		font : {
			fontFamily : 'NaumGothic',
			fontSize : 14,
			fontWeight : 'bold'
		},
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT
	});
	row.add(lbName);

	var lbMemo = Ti.UI.createLabel({
		left : 65,
		top : 25,
		height : 30,
		text : data[i].memo,
		font : {
			fontFamily : 'NaumGothic',
			fontSize : 12
			//fontWeight: 'bold'
		},
		color : '#345',
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT
	});
	row.add(lbMemo);

	var lbDate = Ti.UI.createLabel({
		left : 65,
		top : 5,
		height : 30,
		text : data[i].date,
		font : {
			fontFamily : 'NaumGothic',
			fontSize : 12
			//fontWeight: 'bold'
		},
		color : '#345',
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT
	});
	row.add(lbDate);

	row.hasChild = true;
	if (data[i].header) {
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
			text : data[i].header,
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

aTableView.setData(sections);
aTableView.addEventListener('click', function(e) {

});
win.add(aTableView);
win.addEventListener('open', function(e) {
	Ti.App.fireEvent("RELOAD_EVENT");
});

