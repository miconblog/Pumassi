/*
 * BAR 브러시맵 코드            
 */

var oBrushMap = nchart.createBrushMap({
	type: 'BAR'
});

oBrushMap.setInitHandler(function (data) {
    var canvas = document.createElement("canvas"),
       context = canvas.getContext('2d');  
  
    canvas.width = data.w;
    canvas.height = data.h;
    document.getElementById('drawMoneyByEvent').appendChild(canvas);
  
    this.setBrushMapData('ctx', context);
});

oBrushMap.setDefaultMethodOfBrush({
	init: function (data, info) {
		this.ctx = this.getBrushMapData('ctx');
	}
});

oBrushMap.addBrush('baseline', {
    getMargin: function (data, info) {
		return {
			top: 30,
			right: 30,
			bottom: 30,
			left: 55
		};
	},
	drawHorizontalBaseline: function (data, info) {
      
        this.ctx.fillStyle = '#ccc';
        this.ctx.fillRect(data.x, data.yEnd, data.w, 1); 
	},
	drawVerticalBaseline: function (data, info) {
      
        this.ctx.fillRect(data.x, data.yEnd, 1, -data.h);
    }
});

oBrushMap.addBrush('verticalGridline', {
	getMarginFromBaseline: function (data, info) {
		return {
			left : 20,
			right : 20
		};
	},
	drawEachVerticalGridline: function (data, info) {

        this.ctx.fillStyle = '#ccc';
        this.ctx.fillRect(data.x, data.y, 1, data.h);
	},
	drawEachVerticalLabel: function (data, info) {
       
        this.ctx.textAlign = "center";
        this.ctx.fillStyle ="#000";
		
        this.ctx.fillText( data.value, data.x, data.yEnd + 15);     
	}
});

oBrushMap.addBrush('horizontalGridline', {
	getMarginFromBaseline: function (data, info) {
		return {
			top : 20
		};
	},
	drawEachHorizontalGridline: function (data, info) {
      
        this.ctx.fillStyle ="#ccc";
        this.ctx.fillRect(data.x, data.y, data.w, 1);
	},
	drawEachHorizontalLabel: function (data, info) {
      
        this.ctx.textAlign = "right";
        this.ctx.font = "13px Arial";
        this.ctx.fillStyle ="#000";

		var nMoney = util.getNumberFormat( Math.round(data.value / 10000 )) + "만";

        this.ctx.fillText( nMoney, data.x - 10, data.y + 5);
	}
});

oBrushMap.addBrush('bar', {
	getBarWidth: function () {
		return 20;
	},
	drawEachBar: function (data, info) {
     
      this.ctx.fillStyle = "#08F";
      this.ctx.fillRect(data.xLeftTop, data.yLeftTop, data.w, data.h);
    }
});



/*
 * 차트 객체 생성 및 실행 코드 
 */
function drawMoneyByEvent(aDataTable){

	var aArray = []
    var aEtcArray = ["기타", 0];
	for(var i = 0 ; i < aDataTable.length ; ++i){
		var eventType = aDataTable[i][0];
		switch( parseInt(eventType,10)){
			case 1 :
				aArray.push(["결혼식", aDataTable[i][1]]);
				break;
			case 2 :
				aArray.push(["돌잔치", aDataTable[i][1]]);
				break;
			case 3 :
				aArray.push(["기념일", aDataTable[i][1]]);
				break;
			case 4 :
				aArray.push(["장례식", aDataTable[i][1]]);
				break;
			default : 
				aEtcArray[1] += aDataTable[i][1];
				break;

		}
	}
	if(aEtcArray[1] > 0 ){
		aArray.push(aEtcArray);	
	}


	var oDataTable = nchart.createDataTable();
	oDataTable.setColumnHeader(['이벤트별 금액']);
	oDataTable.setRowDataTable(aArray);

	var oChart = nchart.createChart({
		type: 'BAR',
		width: 320,
		height: 240
	});

	oChart.setBrushMap(oBrushMap).setDataTable(oDataTable).init().draw();
}
