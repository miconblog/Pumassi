/*
 *   LINE 브러시맵 코드      
 */

var oBrushMapBarYear = nchart.createBrushMap({
	type: 'LINE'
});

oBrushMapBarYear.setInitHandler(function (data) {
    var canvas = document.createElement("canvas"),
        context = canvas.getContext('2d');  
  
    canvas.width = data.w;
    canvas.height = data.h;
    document.getElementById('drawMoneyByYear').appendChild(canvas);
  
    this.setBrushMapData('ctx', context);  

});

oBrushMapBarYear.setDefaultMethodOfBrush({
	init: function (data, info) {
		this.ctx = this.getBrushMapData('ctx');
	}
});

oBrushMapBarYear.addBrush('baseline', {
    init: function (data, info) {    
		this.ctx = this.getBrushMapData('ctx');
    },
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
      
      this.ctx.fillRect(data.x, data.y, 1, data.h);
    }
});

oBrushMapBarYear.addBrush('verticalGridline', {
    getMarginFromBaseline: function (data, info) {
		return {
			left : 30,
			right : 30
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
        this.ctx.fill();           
	}
});

oBrushMapBarYear.addBrush('horizontalGridline', {

	drawEachHorizontalGridline: function (data, info) {
      
      this.ctx.fillStyle ="#ccc";
      this.ctx.fillRect(data.x, data.y, data.w, 1);

	},
	drawEachHorizontalLabel: function (data, info) {
      
      this.ctx.textAlign = "right";
      this.ctx.font = "13px Arial";
      this.ctx.fillStyle ="#000";

	  var nMoney = util.getNumberFormat( Math.round(data.value / 10000 )) + "만";
      this.ctx.fillText(nMoney, data.x - 10, data.y + 5);
      this.ctx.fill();
	}
});

oBrushMapBarYear.addBrush('line', {
	drawEachPoint: function (data, info) {
      
      this.ctx.moveTo(data.x, data.y);
      this.ctx.arc(data.x, data.y, 3, 0, 360, false);
      this.ctx.fillStyle = "#08f";
      this.ctx.fill();   
    }
});

oBrushMapBarYear.addBrush('line', {
	drawEachPoint: function (data, info) {
      
      this.ctx.moveTo(data.x, data.y);
      this.ctx.lineTo(data.xNext, data.yNext);
      this.ctx.strokeStyle = "#3dA";
      this.ctx.lineWidth = 2;
      this.ctx.stroke();		
	}
});



/*
 * 차트 객체 생성 및 실행 코드   
 */



/*
 * 차트 객체 생성 및 실행 코드   
 */


function drawMoneyByYear(aData){
	
	for(var i = 0 ; i < aData.length ;++i){
	
		aData[i][0] += "년";
	}

	var oDataTable = nchart.createDataTable();
	oDataTable.setColumnHeader(['방문자수']);
	oDataTable.setRowDataTable(aData);
	var oChart = nchart.createChart({
		type: 'LINE',
		width: 320,
		height: 240
	});

	oChart.setBrushMap(oBrushMapBarYear).setDataTable(oDataTable).init().draw();

}