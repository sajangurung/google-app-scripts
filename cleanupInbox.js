var LABEL = "Unroll.me";
var PURGE_AFTER = 2;

function getDaysOffset(numberOfDays) {
    var today = new Date();
    var todayTime = today.getTime();
    var daysOffset = todayTime - numberOfDays * 24 * 60 * 60 * 1000;
    return daysOffset;
}

function processInbox() {
    var age = new Date();
    age.setDate(age.getDate() - PURGE_AFTER);

    var purge = Utilities.formatDate(age, Session.getTimeZone(), "yyyy-MM-dd");
    var search = "label:" + LABEL + " before:" + purge;

    // get all threads with old label
    var threads = GmailApp.search(search, 0, 100);
    if (threads.length == 100) {
        ScriptApp.newTrigger("cleanupUnroll")
            .timeBased()
            .at(new Date(new Date().getTime() + 1000 * 60 * 10))
            .create();
    }

    var toDelete = [];
    var daysOffset = getDaysOffset(PURGE_AFTER);
    for (var i = 0; i < threads.length; i++) {
        //get message details
        var msg = threads[i].getMessages(),
            date = msg[0].getDate();
        if (date.getTime() < daysOffset) {
            toDelete.push(threads[i]);
        }
    }

    console.log("Deleting total records", toDelete.length);
    GmailApp.moveThreadsToTrash(toDelete);
}
