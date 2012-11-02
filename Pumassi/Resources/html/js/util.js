
var util = {

		getNumberFormat : function(sNum){
				
				var bReplaced;		 
				sNum = Number(sNum).toString();
				do{
					bReplaced = false;
					sNum = sNum.replace(/([0-9]+)([0-9]{3})/, function(_, sF, sR) {
						bReplaced = true;
						return sF + ',' + sR;
					});		  
				}while(bReplaced);		 
				return sNum;    			
		
		}

}