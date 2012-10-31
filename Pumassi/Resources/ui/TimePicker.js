var getValue = function(oDate) {
	var nHour = oDate.getHours();
	var nMins = oDate.getMinutes();
	var sText = "오전";

	if (nHour > 11) {
		sText = "오후"
	}

	return { 
		str  : sText + " " + nHour + "시 " + nMins + "분",
		value: nHour*60*60*1000 + nMins * 60*1000 
	}
};

var TimePicker = function(lbDate) {
	var self = this;

	var value = new Date();
	var picker = Ti.UI.createPicker({
		type : Ti.UI.PICKER_TYPE_TIME,
		value : value,
		bottom : 0,
	});

	picker.selectionIndicator = true;
	picker.addEventListener('change', function(e) {
		var time = getValue(e.value);
		console.log("시간 설정: ", time);
		lbDate.text = time.str;
		lbDate.value= time.value;
	});

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
		var time = getValue(picker.getValue());
		
		lbDate.text  = time.str;
		lbDate.value = time.value;
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
		text : "시간을 선택하세요!",
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

module.exports = TimePicker;
