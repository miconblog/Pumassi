var DATABASE_NAME = 'PUMASI';
var SYS_DB = 'CALENDAR';

exports.createDb = function() {
	Ti.Database.install('pumassi.db', DATABASE_NAME);
	Ti.Database.install('cal.db', SYS_DB);
};

/**
 * 품앗이 등록
 * @param {Object} e
 */
exports.addPumasi = function(e) {
	console.log("************ 품앗이 데이터를 DB에 입력한다. ************", e);
	var db = Ti.Database.open(DATABASE_NAME);
	
	var gBookId = (new Date()).getTime();
	var eventDate = null, isLunar=0, isRepeat=0, lastModified = gBookId;
	if(!!e.eventDate){
		eventDate = e.eventDate;
		isLunarDate = e.isLunarDate;
	}
		
	db.execute('INSERT INTO tb_pumassi_events(hostId, guestbookId, eventType, eventDate,'
		+ 'isLunarDate, isRepeat, lastModified, isCompleted, memo, hostName) ' 
		+ 'VALUES (?,?,?,?,?,?,?,?,?,?)', e.personId, gBookId, e.eventTypeId, e.eventDate||null,
		 e.money, e.dateStr, e.dateValue, e.alramStr, e.alramValue, e.memo, e.memoImage);

	

	// 방명록을 먼저 생성한다.
	db.execute('INSERT INTO tb_guest_books(gbookId, eventId, guestName, money, isAttend, memo) ' 
		+ 'VALUES (?,?,?,?,?,?)',  gBookId);
	
	
	
	
		db.close();
};

/**
 * 내가 품앗이한 데이터를 가져온다.
 * 1. 모든 방명록을 뒤져서 내 이름이 있는 방명록을 확인하고,
 * 2. 해당 방명록의 이벤트를 가져온다.
 * 3. 그리고 반환하는 데이터 모델을 반들어 반환한다.
 * 4. 데이터 모델은 무조건 배열, 없으면 빈배열  
 */
exports.getPumasi = function() {
	console.log("************ 내가 품앗이한 데이터를 가져온다. **************");
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('SELECT * FROM tb_guest_books WHERE guestId=0');
	var data = [];
	while (rows.isValidRow()) {
		data.push({
			personId : rows.fieldByName('personId'),
			personName : rows.fieldByName('personName'),
			eventName : rows.fieldByName('eventName'),
			eventType : rows.fieldByName('eventType'),
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


/**
 * 모든 이벤트 타입을 반환한다.
 */
exports.getAllEventType = function() {
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('SELECT * FROM tb_event_type');
	var data = [];
	while (rows.isValidRow()) {
		data.push({
			eventType : rows.fieldByName('eventType'),
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
	db.execute('INSERT INTO tb_event(eventType, eventName, eventDateStr, eventDateValue, isLunar, isRepeat, memo, memoImage) ' 
	+ 'VALUES (?,?,?,?,?,?,?,?)', e.eventType, e.eventName, e.eventDateStr, e.eventDateValue, e.isLunar, e.isRepeat, e.memo, e.memoImage);
	db.close();
};


/**
 * 나와 관련된 이벤트를 모두 가져온다.
 * 1. 푸마시 이벤트에서 호스트 아이디가 0인 녀석들을 모두 가져온다.
 * 2. 반환할 모델은 고민좀 해보자. 
 * 3. 반환 데이터는 무조건 배열, 없으면 빈배열
 */
exports.getAllEvent = function() {
	console.log("************ 나와 관련된 이벤트를 모두 가져온다. *************")
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('SELECT * FROM tb_pumassi_events WHERE hostId=0');
	var data = [];
	while (rows.isValidRow()) {
		data.push({
			eventId : rows.fieldByName('eventId'),
			eventType : rows.fieldByName('eventType'),
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
