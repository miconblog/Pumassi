var contacts = Ti.Contacts.getAllPeople();

var findPerson = function(sName) {
	if (sName.length < 1) {
		return [];
	}
	var persons = [];
	for (var i = 0; i < contacts.length; ++i) {
		var fullName = contacts[i].fullName;
		if (fullName.indexOf(sName) > -1) {
			persons.push(contacts[i]);
		}
	}
	return persons;
};

var convertPerson2Rows = function(persons) {
	var rows = [];
	for (var i = 0; i < persons.length; ++i) {
		var row = Ti.UI.createTableViewRow({
			height : 30,
			recordId : persons[i].recordId
		});
		var lb = Ti.UI.createLabel({
			left : 10,
			height : 30,
			text : persons[i].fullName,
			font : {
				fontFamily : 'NaumGothic',
				fontSize : 12
			},
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT
		});
		row.add(lb);
		rows.push(row);
	}
	return rows;
}

/**
 * 입력한 값으로 연락처를 검색하는 컴포넌트
 * @param {Ti.UI.TextField} tfName
 */
var SearchContact = function(tfName) {

	tfName.addEventListener('change', function(e) {
		var persons = findPerson(e.value);
		var rows = convertPerson2Rows(persons);
		aTableView.setData(rows);

		if (rows.length > 0) {
			aTableView.show();
		} else {
			aTableView.hide();
		}
	});

}

module.exports = SearchContact;
