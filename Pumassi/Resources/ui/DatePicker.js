var DatePicker = function(rowDate, alramSwitch, lunnarSwitch) {
	var self = this;

	// 날짜 선택
	var minDate = new Date();
	minDate.setFullYear(2000);
	minDate.setMonth(0);
	minDate.setDate(1);

	var maxDate = new Date();
	maxDate.setFullYear(2100);
	maxDate.setMonth(11);
	maxDate.setDate(31);

	var value = new Date();
	var picker = Ti.UI.createPicker({
		type : Ti.UI.PICKER_TYPE_DATE,
		minDate : minDate,
		maxDate : maxDate,
		value : value,
		bottom : 0,
		keyboardToolbarColor : '#999',
		keyboardToolbarHeight : 40,
	});
	picker.addEventListener("change", function(e){
		var dt = picker.getValue();
		var Y  = dt.getFullYear();
		var M  = dt.getMonth() + 1;
		var D  = dt.getDate();
		
		rowDate.title = Y +"년 " + M + "월 " + D + "일";
		rowDate.dtStr = Y +"년 " + M + "월 " + D + "일";
		rowDate.value = (new Date(Y+"/"+M+"/"+D)).getTime();
	});
	picker.selectionIndicator = true;

	var view = Ti.UI.createView({
		width : 320,
		height : 255,
		bottom : -255,
		backgroundColor : "transparent"
	});

	var btn = Ti.UI.createButton({
		title : "확인",
		right : 5,
		top : 5,
		height : 30,
		style : Ti.UI.iPhone.SystemButtonStyle.PLAIN
	});
	btn.addEventListener("click", function(e) {
		var dt = picker.getValue();
		var Y  = dt.getFullYear();
		var M  = dt.getMonth() + 1;
		var D  = dt.getDate();
		
		rowDate.title = Y +"년 " + M + "월 " + D + "일";
		rowDate.dtStr = Y +"년 " + M + "월 " + D + "일";
		rowDate.value = (new Date(Y+"/"+M+"/"+D)).getTime();
		if (!!alramSwitch) {
			alramSwitch.enabled = true;
		}
		if (!!lunnarSwitch) {
			lunnarSwitch.enabled = true;
		}
		self.hide();
	});

	var bar = Ti.UI.createView({
		width : 320,
		height : 40,
		top : 0,
		backgroundColor : "#000",
		opacity : 0.8,
		borderColor : "#000",
		borderWidth : 1
	});

	var txt = Ti.UI.createLabel({
		text : "날짜를 선택하세요!",
		left : 10,
		top : 10,
		color : "#EEE",
		font : {
			fontFamily : "NanumGothic",
			fontSize : 12,
			fontWeight : "bold"
		}
	});

	view.add(picker);
	view.add(bar);
	view.add(btn);
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
			duration : 500
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

	return self;
}

module.exports = DatePicker;
