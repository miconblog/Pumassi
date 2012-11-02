var win = Ti.UI.currentWindow;

var back = Ti.UI.createButton({
	backgroundImage : "/images/home-icon.png",
	width: 32,
	height: 32
});
back.addEventListener("click", function(e) {
	win.close({
		transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
	});
});
var flexSpace = Ti.UI.createButton({
	systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});
var title = Ti.UI.createLabel({
	text : "품앗이 통계",
	shadowColor : '#333',
	shadowOffset : {
		x : 0,
		y : -1
	},
	color : '#fff',
	font : {
		fontSize : 19,
		fontWeight : 'bold'
	}
});

var titleBar = Ti.UI.iOS.createToolbar({
	items : [back, flexSpace, title, flexSpace,flexSpace],
	top : 0,
	height : 42,
	borderTop : false,
	borderBottom : true
});
win.add(titleBar);

var webView = Ti.UI.createWebView({
	top : 2,
	url : "/html/index.html"
});
win.add(webView);

win.addEventListener("open", function() {
	Ti.App.fireEvent("LOAD_STATICS");
});

Ti.App.addEventListener("LOADED_STATICS", function(e) {

	var data = e.data;
	for(var i=0; i<data.length; ++i){
		var item = data[i];
		webView.evalJS(item[0]+"("+ JSON.stringify(item[1]) +")");
	}
	
	webView.evalJS("allSpent("+ e.total +")");

	// console.log("**** 이벤트별 사용금액: ****", JSON.stringify(e.data));
	// //webView.evalJS("drawMoneyByEvent([['1', 150000], ['2', 250000], ['3', 142000], ['4', 162000], ['5', 361000]])")
	// webView.evalJS("drawMoneyByEvent("+ JSON.stringify(e.data) +")");
});

