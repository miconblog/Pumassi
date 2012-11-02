var win = Ti.UI.currentWindow;

var backup = Ti.UI.createButton({
	title : "DB 백업하기"
});
backup.addEventListener("click", function(){
	
	console.log("데이터베이스 백업");
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory);
	var privateDir = file.nativePath.replace("Documents/", "Library/Private%20Documents/");
	var dbfile = Ti.Filesystem.getFile(privateDir, "PUMASI.sql");

	var backupFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "pumassi.sqlite");
	if( backupFile.exists()){
		backupFile.deleteFile();
	}
	backupFile.write(dbfile);
});
win.add(backup);
