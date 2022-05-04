const database = require("./api/db");

database.connect()
    .then(() => console.log("Connected to database"))
    .then(() => {return database.get()})
    .then(async function(db) {
        const tools = require('./api/tools');
        var hi = await tools.new_token_test('test');
        console.log(hi);
        // var res = await db.db('navysea').collection('test').insertOne({
        //     _id: 0,
        //     title: "Hello",
        //     dateadded: new Date(),
        //     user: "testuser",
        //     "deltas": {test:"delta"},
        //     html: "<p>This is a test</p>",
        //     shortdescript: "This is a test",
        // });
        // console.log(res);
        // db.close();
    })