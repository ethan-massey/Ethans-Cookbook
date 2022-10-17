const cron = require('node-cron');
const dbo = require("./db/conn");
const ObjectId = require("mongodb").ObjectId;

const initCleanSessions = () => {
    // clean sessions once a day, every day
    const deleteOldSessions = cron.schedule("0 0 * * *", () => {
        // get all sessions
        let db_connect = dbo.getDb();
        db_connect
        .collection("sessions")
        .find({})
        .toArray(function (err, result) {
            if (err) throw err;
            // go through each session doc and delete expired ones
            result.forEach(doc => {
                let now = new Date();
                let expDate = new Date(doc.expDate);
                // if expired
                if (expDate < now){
                    let myquery = { _id: ObjectId( doc._id )};
                    db_connect.collection("sessions").deleteOne(myquery, function (err, res) {
                        if (err) throw err;
                    });
                }
            });
        });
    });

    deleteOldSessions.start();
}

module.exports = { initCleanSessions };