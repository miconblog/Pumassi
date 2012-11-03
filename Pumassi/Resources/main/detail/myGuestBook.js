var win = Ti.UI.currentWindow;
var now = new Date().getTime();
var tableView = Titanium.UI.createTableView({
	backgroundColor : "#FFF",
	minRowHeight : 40,
	editable : true
});
win.add(tableView);

win.addEventListener("open", function() {
	Ti.App.fireEvent("LOAD_MY_EVENT_GUEST_BOOK", {
		eventId : win.data.eventId
	});
});

Ti.App.addEventListener("LOADED_MY_EVENT_GUEST_BOOK", function(e) {
	console.log("*********** 이벤트 방명록 정보 ************", e);

	var rows = [];
	var data = e.data;

	for (var i = 0; i < data.length; ++i) {

		var item = data[i];
		var row = Ti.UI.createTableViewRow();
		
		if( i==0 ){
			row.header = "이름                    금액             참석유무";
		}

		// 이름
		var lbName = Ti.UI.createLabel({
			text : item.guestName,
			left : 10,
			width : 80
		});
		row.add(lbName)

		// 금액
		var money = item.money ?  item.money / 10000 : 0;
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
			height : 32,
			guestbookId : item.guestbookId
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

			Ti.App.fireEvent("UPDATE_MY_EVENT_GUESTBOOK", {
				guestbookId : e.source.guestbookId,
				field : "money",
				value : val * 10000
			})
		});

		var tfMoney = Ti.UI.createTextField({
			color : '#336699',
			value : money + "만원",
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_LINE,
			textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
			returnKeyType : Ti.UI.RETURNKEY_DONE,
			keyboardToolbar : [tfMoneyGuide, flexSpace, confirm],
			keyboardToolbarColor : '#999',
			keyboardToolbarHeight : 40,
			keyboardType : Ti.UI.KEYBOARD_DECIMAL_PAD,
			borderColor : "#CCC",
			width : 80
		});
		tfMoney.addEventListener("focus", function(e) {
			tfMoneyGuide.value = money + "만원";
			tfMoney.focus();
			tfMoney.value = money;
			tableView.scrollToIndex(3);
		});
		tfMoney.addEventListener("change", function(e) {
			tfMoneyGuide.value = parseInt(e.value, 10) || 0;
			tfMoneyGuide.value += " 만원";
		});
		row.add(tfMoney);

		// 참석유무
		var attend = Ti.UI.createSwitch({
			right : 10,
			value : item.isAttend,
			guestbookId : item.guestbookId
		});
		attend.addEventListener("change", function(e) {
			Ti.App.fireEvent("UPDATE_MY_EVENT_GUESTBOOK", {
				guestbookId : e.source.guestbookId,
				field : "isAttend",
				value : e.value
			})
		});
		row.add(attend);

		rows.push(row);
	}
	tableView.setData(rows);
});
