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
		title : '품앗이 등록',
		modal : true,
		backgroundColor : '#ccc',
		url : '/forms/PumasiForm.js'
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
		title : e.rowData.data.personName + " " + e.rowData.data.eventName,
		data : e.rowData.data,
		url : "detail/myPumassi.js"
	});

	Ti.UI.currentTab.open(detailWin);
});
tableView.addEventListener("delete", function(e){
	Ti.App.fireEvent("DELETE_EVENT", { eventId: e.rowData.data.eventId })
});

win.add(tableView);

///// ###### 이벤트
/**
 *
 */
Ti.App.addEventListener("UPDATE_PUMASI_LIST", function(e) {
	var rows = [];
	var sections = [];
	var data = e.data;
	for (var i = 0; i < data.length; i++) {
		var item = data[i];
		var row = Ti.UI.createTableViewRow({
			height : 60,
			data : item
		});

		var person = Ti.Contacts.getPersonByID(item.personId);

		// 대표 사진
		var img = Ti.UI.createImageView({
			top : 5,
			left : 5,
			width : 50,
			height : 50,
			image : person.image || '/images/user_default_pic.png',
			clickName : 'photo'
		});
		row.add(img);

		// 블릿
		if (item.isPast && item.isCompleted == 0) {
			var bullet = Ti.UI.createImageView({
				image : "/images/bullet.png",
				left : 0,
				top : 0,
				width : 20,
				height : 20
			})
			row.add(bullet);
		}
		// 이름
		var lbName = Ti.UI.createLabel({
			left : 70,
			height : 30,
			width : 'auto',
			text : item.personName,
			font : {
				fontFamily : 'NanumGothic',
				fontSize : 14,
				fontWeight : 'bold'
			},
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT
		});
		row.add(lbName);

		// 이벤트 종류
		var lbType = Ti.UI.createLabel({
			left : 175,
			top : 10,
			height : 20,
			text : item.eventName,
			font : {
				fontFamily : 'NanumGothic',
				fontSize : 13
				//fontWeight: 'bold'
			},
			color : '#345',
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT
		});
		row.add(lbType);

		var lbDate = Ti.UI.createLabel({
			left : 175,
			top : 25,
			height : 30,
			text : getDateString(item.eventDate),
			font : {
				fontFamily : 'NanumGothic',
				fontSize : 12
				//fontWeight: 'bold'
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

/**
 * 품앗이 탭이 열리면 호출된다. (실질적인 시작점)
 */
win.addEventListener('focus', function(e) {
	Ti.App.fireEvent("LOAD_PUMASI");
});
