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

// Create a TableView.
var tableView = Ti.UI.createTableView();

// 내가 품앗이 한사람

// var data = [];
// var data3 = win.data.concat();
//
// // for(var i=0; i<data3.length; ++i){
// // data3[i].
// // }
//
// if (data3.length > 0) {
// data3[0].header = '내가 품앗이한 사람';
// data = data.concat(data3);
// }
// Populate the TableView data.
// var data = [{
// fullName : '홍길동',
// events : [{
// type : 1,
// name : '결혼식',
// date : '오늘(2012-07-04)'
// }],
// hasChild : true,
// header : '곧 다가올 이벤트'
// }, {
// fullName : '이순신',
// events : [{
// type : 2,
// name : '돌잔치',
// date : '내일모레(2012-07-14)'
// }],
// hasChild : true
// }, {
// fullName : '이만기',
// hasChild : true,
// header : '언젠가는 갚아야하는 사람'
// }, {
// fullName : '김상기',
// hasChild : true,
// }, {
// fullName : '장만욱',
// hasChild : true,
// value : 50000,
// header : '내가 품앗이한 사람'
// }];

tableView.addEventListener('click', function(e) {
	if (e.source.clickName === 'photo') {
		alert(e.source.clickName);
	}

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
		var row = Ti.UI.createTableViewRow({
			height : 60
		});

		var p = Ti.Contacts.getPersonByID(data[i].personId);

		// 대표 사진
		var img = Ti.UI.createImageView({
			top : 5,
			left : 5,
			width : 50,
			height : 50,
			image : p.image || '/images/user_default_pic.png',
			clickName : 'photo'
		});
		row.add(img);

		// 이름
		var lbName = Ti.UI.createLabel({
			left : 70,
			height : 30,
			width : 'auto',
			text : data[i].personName,
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
			text : data[i].eventName,
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
			text : data[i].dateStr,
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


/**
 * 품앗이 탭이 열리면 호출된다. (실질적인 시작점)
 */
win.addEventListener('open', function(e) {
	Ti.App.fireEvent("LOAD_PUMASI");
});
