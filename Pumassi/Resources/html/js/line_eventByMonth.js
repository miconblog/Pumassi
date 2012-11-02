/*
 *   LINE 브러시맵 코드      
 */

var oBrushMapBarEvent = nchart.createBrushMap({
	type: 'LINE'
});

oBrushMapBarEvent.setInitHandler(function (data) {
    var canvas = document.createElement("canvas"),
        context = canvas.getContext('2d');  
  
    canvas.width = data.w;
    canvas.height = data.h;
    document.getElementById('drawEventByMonth').appendChild(canvas);
  
    this.setBrushMapData('ctx', context);  

});

oBrushMapBarEvent.setDefaultMethodOfBrush({
	init: function (data, info) {
		this.ctx = this.getBrushMapData('ctx');
	}
});

oBrushMapBarEvent.addBrush('baseline', {
    init: function (data, info) {    
		this.ctx = this.getBrushMapData('ctx');
    },
    getMargin: function (data, info) {
		return {
			top: 30,
			right: 30,
			bottom: 30,
			left: 30
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

oBrushMapBarEvent.addBrush('verticalGridline', {
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

oBrushMapBarEvent.addBrush('horizontalGridline', {

	drawEachHorizontalGridline: function (data, info) {
      
      this.ctx.fillStyle ="#ccc";
      this.ctx.fillRect(data.x, data.y, data.w, 1);

	},
	drawEachHorizontalLabel: function (data, info) {
      
      this.ctx.textAlign = "right";
      this.ctx.font = "13px Arial";
      this.ctx.fillStyle ="#000";


      this.ctx.fillText( data.value , data.x - 10, data.y + 5);
      this.ctx.fill();
	}
});

oBrushMapBarEvent.addBrush('line', {
	drawEachPoint: function (data, info) {
      
      this.ctx.moveTo(data.x, data.y);
      this.ctx.arc(data.x, data.y, 3, 0, 360, false);
      this.ctx.fillStyle = "#F08";
      this.ctx.fill();   
    }
});

oBrushMapBarEvent.addBrush('line', {
	drawEachPoint: function (data, info) {
      
      this.ctx.moveTo(data.x, data.y);
      this.ctx.lineTo(data.xNext, data.yNext);
      this.ctx.strokeStyle = "#F08";
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


function drawEventByMonth(aData){
	
	for(var i = 0 ; i < aData.length ;++i){
	
		aData[i][0] = aData[i][0] + "월";
	}

	var oDataTable = nchart.createDataTable();
	oDataTable.setColumnHeader(['월별 이벤트']);
	oDataTable.setRowDataTable(aData);
	var oChart = nchart.createChart({
		type: 'LINE',
		width: 320,
		height: 240
	});

	oChart.setBrushMap(oBrushMapBarEvent).setDataTable(oDataTable).init().draw();

}