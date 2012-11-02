/*
 * DONUT 브러시맵 코드           
 */

var oBrushMapPie = nchart.createBrushMap({
	type: 'DONUT'
});

oBrushMapPie.setInitHandler(function (data) {
    var canvas = document.createElement("canvas"),
        context = canvas.getContext('2d');  
  
    canvas.width = data.w;
    canvas.height = data.h;
    document.getElementById('container').appendChild(canvas);
  
    this.setBrushMapData('ctx', context);  
});

oBrushMapPie.setDefaultMethodOfBrush({
	init: function (data, info) {
		this.ctx = this.getBrushMapData('ctx');
	}
});

oBrushMapPie.addBrush('backgroundCircle', {
	init: function () {
		this.ctx = this.getBrushMapData('ctx');
	},
	getMargin: function () {
		return {
			top: 30,
			bottom: 30,
			left: 30,
			right: 30
		};
	},
	drawBackgroundCircle: function (data, info) {
        this.ctx.moveTo(data.xc, data.yc);
        this.ctx.arc(data.xc, data.yc, data.r + 3, 0, 360 * Math.PI/180, false);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();
	}

});

oBrushMapPie.addBrush('donut', {
	init: function () {
		this.ctx = this.getBrushMapData('ctx');
        this.colors = ['#E2DF9A', '#EBE54D', '#757449', '#4B490B', '#FF0051'];
	},
    getInnerRadius: function (data, info) {
		return data.r - 70;
	},
	drawEachDonutPiece: function (data, info) {
      
        var startRad = data.startRad,
            endRad = data.endRad,
            rInner = data.rInner;

         this.ctx.beginPath();
         this.ctx.moveTo(data.xc, data.yc);
         this.ctx.arc(data.xc, data.yc, data.r, startRad, endRad, false);
         this.ctx.fillStyle = this.colors[data.rIdx];
         this.ctx.fill();
         this.ctx.closePath();
      
         this.ctx.beginPath();
         this.ctx.moveTo(data.xc, data.yc);
         this.ctx.arc(data.xc, data.yc, data.rInner, 0, 360 * Math.PI/180, false);
         this.ctx.fillStyle = '#fff';
         this.ctx.fill();
         this.ctx.closePath();
      },
      drawEachLabel: function (data, info) {
        
        this.ctx.beginPath();
        this.ctx.textAlign = "center";
        this.ctx.font= "Bold 13px Dotum";
        this.ctx.fillStyle ="#222";

        this.ctx.fillText(data.rHeader, data.xm, data.ym);
        this.ctx.closePath();
	}
});




/*
 *   차트 객체 생성 및 실행 코드
 */
function  drawEventCountDonut(aDataTable){

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
	oDataTable.setColumnHeader(['유입량']);
	oDataTable.setRowDataTable(aArray);

	var oChart = nchart.createChart({
		type: 'DONUT',
		width: 320,
		height: 320,
		pie: {
			isClockwise: true,
			coordinateType: 'canvas',
			startDirection: 'N'
		}
	});

	oChart.setBrushMap(oBrushMapPie).setDataTable(oDataTable).init().draw();
}