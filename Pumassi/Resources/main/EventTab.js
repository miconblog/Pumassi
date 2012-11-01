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

var win = Ti.UI.currentWindow;
var add = Ti.UI.createButton({
	systemButton : Titanium.UI.iPhone.SystemButton.ADD
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


var tableView = Ti.UI.createTableView();
tableView.addEventListener('click', function(e) {

});
win.add(tableView);


Ti.App.addEventListener("UPDATE_EVENT_LIST", function(e) {
	console.log("********** 나의 이벤트 데이터 ************", e.data);
	var rows = [];
	var sections = [];
	var data = e.data;
	for (var i = 0; i < data.length; i++) {
		var row = Ti.UI.createTableViewRow({
			height : 60
		});

		// 이름
		var lbName = Ti.UI.createLabel({
			left : 10,
			height : 30,
			text : data[i].eventName,
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
			text : getDateString(data[i].eventDate),
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

	tableView.setData(sections);
});


win.addEventListener('open', function(e) {
	Ti.App.fireEvent("LOAD_MY_EVENT");
});

