var DATABASE_NAME = 'PUMASI';
var SYS_DB = 'CALENDAR';

exports.createDb = function() {
	Ti.Database.install('data.db', DATABASE_NAME);
	Ti.Database.install('cal.db', SYS_DB);
	
	//var userdb = Ti.Database.open(USER_DATABASE_NAME);
	//userdb.execute('DROP TABLE user_tb_gardens');
	//userdb.execute('CREATE TABLE IF NOT EXISTS user_tb_gardens ( gardenId INTEGER PRIMARY KEY AUTOINCREMENT, cropId INTEGER, name TEXT, ordering INTEGER DEFAULT 0, startDate TEXT, endDate TEXT)');
	//nuserdb.close();
};

/**
 * 품앗이 데이터 추가
 *  {
 alramStr = "\Uc54c\Ub9bc \Uc124\Uc815";
 dateStr = "\Ub0a0\Uc9dc \Ubbf8\Uc785\Ub825";
 isAlram = 0;
 memo = "";
 memoImage = "/images/camera.png";
 money = 50000;
 name = "\Ubd88\Uaf43 \Ub0a8\Uc790";
 pId = 1;
 type = "ADD_PUMASI";
 }
 */
exports.addPumasi = function(e) {
	var db = Ti.Database.open(DATABASE_NAME);
	db.execute('INSERT INTO tb_pumasi(personId, personName, eventName, eventTypeId, money, dateStr, dateValue, alramStr, alramValue, memo, memoImage) ' + 'VALUES (?,?,?,?,?,?,?,?,?,?,?)', e.personId, e.personName, e.eventName, e.eventTypeId, e.money, e.dateStr, e.dateValue, e.alramStr, e.alramValue, e.memo, e.memoImage);
	db.close();
};

exports.getPumasi = function() {
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('SELECT * FROM tb_pumasi');
	var data = [];
	while (rows.isValidRow()) {
		data.push({
			personId : rows.fieldByName('personId'),
			personName : rows.fieldByName('personName'),
			eventName : rows.fieldByName('eventName'),
			eventTypeId : rows.fieldByName('eventTypeId'),
			money : rows.fieldByName('money'),
			dateStr : rows.fieldByName('dateStr'),
			dateValue : rows.fieldByName('dateValue'),
			alramStr : rows.fieldByName('alramStr'),
			alramValue : rows.fieldByName('alramValue'),
			memo : rows.fieldByName('memo'),
			memoImage : rows.fieldByName('memoImage')
		});
		rows.next();
	}
	db.close();
	return data;
};

exports.getAllEventType = function() {
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('SELECT * FROM tb_event_type');
	var data = [];
	while (rows.isValidRow()) {
		data.push({
			typeId : rows.fieldByName('eventTypeId'),
			title : rows.fieldByName('eventName'),
		});
		rows.next();
	}
	db.close();
	return data;
}

exports.addEventType = function(_eventName) {
	var db = Ti.Database.open(DATABASE_NAME);
	db.execute('INSERT INTO tb_event_type(eventName) ' + 'VALUES (?)', _eventName);
	db.close();
};


exports.addEvent = function(e) {
	var db = Ti.Database.open(DATABASE_NAME);
	db.execute('INSERT INTO tb_event(eventTypeId, eventName, eventDateStr, eventDateValue, isLunar, isRepeat, memo, memoImage) ' 
	+ 'VALUES (?,?,?,?,?,?,?,?)', e.eventTypeId, e.eventName, e.eventDateStr, e.eventDateValue, e.isLunar, e.isRepeat, e.memo, e.memoImage);
	db.close();
};


exports.getAllEvent = function() {
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('SELECT * FROM tb_event');
	var data = [];
	while (rows.isValidRow()) {
		data.push({
			eventId : rows.fieldByName('eventId'),
			eventTypeId : rows.fieldByName('eventTypeId'),
			eventName : rows.fieldByName('eventName'),
			eventDateStr : rows.fieldByName('eventDateStr'),
			eventDateValue : rows.fieldByName('eventDateValue'),
			isLunar : rows.fieldByName('isLunar'),
			isRepeat : rows.fieldByName('isRepeat'),
			memo : rows.fieldByName('memo'),
			memoImage : rows.fieldByName('memoImage')
		});
		rows.next();
	}
	db.close();
	return data;
};

// 음력을 양력으로 변환한다. 
exports.getSolarDate = function(sDate){
	var db = Ti.Database.open(SYS_DB);
	var date = new Date(sDate - 0);
	var str = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
	var rows = db.execute("SELECT * FROM lunar2solar WHERE lunar_date='" + str +"'");
	
	console.log("변환 날짜: ", str);
	
	var data = [];
	while(rows.isValidRow()) {
		
		data.push({
			solar_date : rows.fieldByName('solar_date'),
			yun : rows.fieldByName('yun'),
			ganji : rows.fieldByName('ganji')
		});
		rows.next();
	}
	db.close();	
	return data[0];
	
}
