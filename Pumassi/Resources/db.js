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

	var lastModified = (new Date()).getTime();
	var guestbookId = "g" + lastModified;
	var eventId = "e" + lastModified;

	// 중복된 이벤트가 있는지 확인
	var row = db.execute('SELECT eventId FROM tb_pumassi_events WHERE eventType=? AND hostId=?', e.eventType, e.personId);
	if (row.getRowCount() > 0) {
		return alert("중복된 이벤트가 있습니다.");
	}
	
	// 음력이면 양력으로 변환해서 넣는다.
	// if (data[i].isLunar) {
// 
			// // 등록한 날짜를 변환해서 사용
			// var oDate = db.getSolarDate(data[i].eventDate);
			// data[i].dateValue = (new Date(oDate.solar_date)).getTime();
		// } 
		
	

	// 이벤트를 등록한다.
	db.execute('INSERT INTO tb_pumassi_events(eventId, hostId, hostName, eventType, eventDate, eventTime,' + 'isLunar, isRepeat, lastModified, isCompleted, memo) ' + 'VALUES (?,?,?,?,?,?,?,?,?,?,?)', eventId, e.personId, e.personName, e.eventType, e.eventDate + e.eventTime, e.eventTime, e.isLunar, e.isRepeat, lastModified, 0, e.memo);

	// 방명록을 생성한다.
	db.execute('INSERT INTO tb_guest_books(guestbookId, eventId, guestId, guestName, money, isAttend, memo) ' + 'VALUES (?,?,?,?,?,?,?)', guestbookId, eventId, 0, "나", e.money, 1, "");
	db.close();
};

/**
 * 나의 이벤트 등록
 */
exports.addMyEvent = function(e) {
	console.log("************ 나의 이벤트 데이터를 DB에 입력한다. ************", e);
	var db = Ti.Database.open(DATABASE_NAME);

	var lastModified = (new Date()).getTime();
	var guestbookId = "g" + lastModified;
	var eventId = "e" + lastModified;

	// 중복된 이벤트가 있는지 확인
	var row = db.execute('SELECT eventId FROM tb_pumassi_events WHERE eventType=? AND hostId=?', e.eventType, 0);
	if (row.getRowCount() > 0) {
		return alert("중복된 이벤트가 있습니다.");
	}

	// 이벤트를 등록한다.
	db.execute('INSERT INTO tb_pumassi_events(eventId, hostId, hostName, eventType, eventDate, eventTime,' + 'isLunar, isRepeat, lastModified, isCompleted, memo) ' + 'VALUES (?,?,?,?,?,?,?,?,?,?,?)', eventId, 0, '나', e.eventType, e.eventDate + e.eventTime, e.eventTime, e.isLunar, e.isRepeat, lastModified, 0, e.memo);
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
	var rows = db.execute('SELECT eventId FROM tb_guest_books WHERE guestId=0');
	var data = [];
	while (rows.isValidRow()) {
		data.push(rows.fieldByName('eventId'));
		rows.next();
	}

	// 이벤트 타입
	var eventType = [];
	rows = db.execute('SELECT * FROM tb_event_type');
	while (rows.isValidRow()) {
		eventType.push(rows.fieldByName('eventName'));
		rows.next();
	}

	// 이벤트 정보를 가져온다.
	var ret = [];
	for (var i = 0; i < data.length; ++i) {
		var eventId = data[i];

		rows = db.execute('SELECT * FROM tb_pumassi_events WHERE eventId=?', eventId);

		while (rows.isValidRow()) {
			ret.push({
				eventId : rows.fieldByName('eventId'),
				personId : rows.fieldByName('hostId'),
				personName : rows.fieldByName('hostName'),
				eventType : rows.fieldByName('eventType'),
				eventName : eventType[rows.fieldByName('eventType') - 1],
				eventDate : rows.fieldByName('eventDate') - 0,
				eventTime : rows.fieldByName('eventTime'),
				isLunar : rows.fieldByName('isLunar'),
				isRepeat : rows.fieldByName('isRepeat'),
				lastModified : rows.fieldByName('lastModified') - 0,
				isCompleted : rows.fieldByName('isCompleted'),
				memo : rows.fieldByName('memo')
			});
			rows.next();
		}
	}
	db.close();

	ret.sort(function(a, b) {
		return b.eventDate - a.eventDate;
		//console.log("정렬: ", a.eventDate, b.eventDate);
	});

	return ret;
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
};

/**
 * 이벤트 타입을 추가 한다.
 */
exports.addEventType = function(_eventName) {
	var db = Ti.Database.open(DATABASE_NAME);
	db.execute('INSERT INTO tb_event_type(eventName) ' + 'VALUES (?)', _eventName);
	db.close();
};

/**
 * 나와 관련된 이벤트를 모두 가져온다.
 * 1. 푸마시 이벤트에서 호스트 아이디가 0인 녀석들을 모두 가져온다.
 * 2. 반환할 모델은 고민좀 해보자.
 * 3. 반환 데이터는 무조건 배열, 없으면 빈배열
 */
exports.getMyEvent = function() {
	console.log("************ 나와 관련된 이벤트를 모두 가져온다. *************")
	var db = Ti.Database.open(DATABASE_NAME);

	// 이벤트 타입
	var eventType = [];
	var rows = db.execute('SELECT * FROM tb_event_type');
	while (rows.isValidRow()) {
		eventType.push(rows.fieldByName('eventName'));
		rows.next();
	}

	rows = db.execute('SELECT * FROM tb_pumassi_events WHERE hostId=0');
	var ret = [];
	while (rows.isValidRow()) {
		ret.push({
			eventId : rows.fieldByName('eventId'),
			personId : rows.fieldByName('hostId'),
			personName : rows.fieldByName('hostName'),
			eventType : rows.fieldByName('eventType'),
			eventName : eventType[rows.fieldByName('eventType') - 1],
			eventDate : rows.fieldByName('eventDate') - 0,
			eventTime : rows.fieldByName('eventTime'),
			isLunar : rows.fieldByName('isLunar'),
			isRepeat : rows.fieldByName('isRepeat'),
			lastModified : rows.fieldByName('lastModified') - 0,
			isCompleted : rows.fieldByName('isCompleted'),
			memo : rows.fieldByName('memo')
		});
		rows.next();
	}
	db.close();
	return ret;
};

// 음력을 양력으로 변환한다.
exports.getSolarDate = function(sDate) {
	var db = Ti.Database.open(SYS_DB);
	var date = new Date(sDate - 0);
	var str = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
	var rows = db.execute("SELECT * FROM lunar2solar WHERE lunar_date='" + str + "'");

	console.log("변환 날짜: ", str);

	var data = [];
	while (rows.isValidRow()) {

		data.push({
			solar_date : rows.fieldByName('solar_date'),
			yun : rows.fieldByName('yun'),
			ganji : rows.fieldByName('ganji')
		});
		rows.next();
	}
	db.close();
	return data[0];

};

exports.getGuestBookInfoById = function(eventId) {
	console.log("************ 방명록 정보를 가져온다. *************")
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('SELECT * FROM tb_guest_books WHERE eventId=? AND guestId=0', eventId);
	var data = [];
	while (rows.isValidRow()) {
		data.push({
			guestbookId : rows.fieldByName('guestbookId'),
			eventId : rows.fieldByName('eventId'),
			guestId : rows.fieldByName('guestId'),
			guestName : rows.fieldByName('guestName'),
			money : rows.fieldByName('money'),
			isAttend : rows.fieldByName('isAttend'),
			memo : rows.fieldByName('memo')
		});
		rows.next();
	}
	db.close();
	return data[0];
};

/**
 * 이벤트 수정
 */
exports.updateEvent = function(eventId, field, value) {
	var db = Ti.Database.open(DATABASE_NAME);
	db.execute('UPDATE tb_pumassi_events SET ' + field + '=? WHERE eventId=?', value, eventId);
	db.close();
};

/**
 * 방명록 수정
 */
exports.updateGuestbook = function(eventId, field, value) {
	var db = Ti.Database.open(DATABASE_NAME);
	db.execute('UPDATE tb_guest_books SET ' + field + '=? WHERE eventId=?', value, eventId);
	db.close();
};

/**
 * 품앗이 이벤트를 삭제한다.
 * @param {Object} eventId
 */
exports.deleteEvent = function(eventId) {
	var db = Ti.Database.open(DATABASE_NAME);
	db.execute('DELETE FROM tb_pumassi_events WHERE eventId=?', eventId);
	db.execute('DELETE FROM tb_guest_books WHERE eventId=?', eventId);
	db.close();
};
