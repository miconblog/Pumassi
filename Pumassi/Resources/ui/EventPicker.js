var EventTypePicker = function(lbType) {
	var self = this;

	var view = Ti.UI.createView({
		width : 320,
		height : 255,
		bottom : -255,
		backgroundColor : "transparent"
	});

	var picker = Ti.UI.createPicker({
		bottom : 0
	});

	// turn on the selection indicator (off by default)
	picker.selectionIndicator = true;
	picker.addEventListener("change", function(e) {
		console.log("change", e.row);
		lbType.text = e.selectedValue[0];
		lbType.typeId = e.row.typeId;
	});
	view.add(picker);

	var bar = Ti.UI.createView({
		width : 320,
		height : 40,
		top : 0,
		backgroundColor : "#000",
		opacity : 0.8,
		borderColor : "#000",
		borderWidth : 1
	});
	view.add(bar);

	var btnDirect = Ti.UI.createButton({
		title : "직접입력",
		left : 5,
		top : 5,
		height : 30,
		width : 50,
		font : {
			fontFamily : "NanumGothic",
			fontSize : 10,
			fontWeight : "bold"
		}
	});

	var bDirectType = false;
	btnDirect.addEventListener("click", function(e) {
		if (!bDirectType) {
			btnDirect.title = "취소";
			btnConfirm.title = "추가";
			bDirectType = true;
			tfName.blur();
			txt.hide();
			tfName.show();
			tfName.focus();
		} else {
			btnDirect.title = "직접입력";
			btnConfirm.title = "확인";
			bDirectType = false;
			tfName.blur();
			txt.show();
		}
	});
	view.add(btnDirect);

	var tfName = Ti.UI.createTextField({
		top : 10,
		left : 60,
		width : 200,
		color : "#FFF",
		visible : false
	});
	view.add(tfName);

	var btnConfirm = Ti.UI.createButton({
		title : "확인",
		right : 5,
		top : 5,
		height : 30,
		style : Ti.UI.iPhone.SystemButtonStyle.PLAIN
	});
	btnConfirm.addEventListener("click", function(e) {
		if (btnConfirm.title === "추가") {
			if( tfName.value == ""){return;}
			Ti.App.fireEvent("ADD_EVENT_TYPE", {
				eventName : tfName.value
			});
			tfName.value = "";
			btnDirect.fireEvent("click");
		}else{
			self.hide();	
		}
	});
	view.add(btnConfirm);

	var txt = Ti.UI.createLabel({
		text : "이벤트 종류를 선택하세요!",
		left : 60,
		top : 10,
		color : "#EEE",
		font : {
			fontFamily : "NanumGothic",
			fontSize : 12,
			fontWeight : "bold"
		}
	});
	view.add(txt);

	var visible = false;
	this.show = function() {
		if (visible) {
			return;
		}
		visible = true;
		Ti.UI.currentWindow.add(view);
		view.animate({
			bottom : 0,
			duration : 300
		});
	}

	this.hide = function() {
		if (!visible) {
			return;
		}
		visible = false;
		view.animate({
			bottom : -255,
			duration : 500
		}, function(e) {
			Ti.UI.currentWindow.remove(view);
		})
	}

	this.setData = function(data) {
		for (var i = 0, l = data.length; i < l; ++i) {
			data[i].fontSize = 24;
		}
		picker.add(data);
	}

	return self;
}

module.exports = EventTypePicker;
