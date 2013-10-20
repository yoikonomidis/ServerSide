var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    db;

var mongoClient = new MongoClient(new Server('localhost', 27017));
mongoClient.open(function(err, mongoClient) {
    db = mongoClient.db("employeedb09");
    db.collection('employees2', {strict:true}, function(err, collection) {
        if (err) {
            console.log("The 'employees' collection doesn't exist. Creating it with sample data...");
            populateDB();
        }
    });
});

 
exports.findById = function(req, res) {
    console.log(req.params);
    var id = parseInt(req.params.id);
    console.log('findById: ' + id);
    db.collection('employees2', function(err, collection) {
        collection.findOne({'id': id}, function(err, item) {
            console.log(item);
            res.jsonp(item);
        });
    });
};

exports.findByManager = function(req, res) {
    var id = parseInt(req.params.id);
    console.log('findByManager: ' + id);
    db.collection('employees2', function(err, collection) {
        collection.find({'managerId': id}).toArray(function(err, items) {
            console.log(items);
            res.jsonp(items);
        });
    });
};

exports.findAll = function(req, res) {
    var name = req.query["name"];
    db.collection('employees2', function(err, collection) {
        if (name) {
            collection.find({"fullName": new RegExp(name, "i")}).toArray(function(err, items) {
                res.jsonp(items);
            });
        } else {
            collection.find().toArray(function(err, items) {
                res.jsonp(items);
            });
        }
    });
};

exports.save = function(req, res) {
    var id = parseInt(req.params.id);
    var firstName = req.params.firstName;
    var lastName = req.params.lastName;
    var managerId = parseInt(req.params.managerId);
    var employee = {"id": id, "firstName": firstName, "lastName": lastName, "managerId": managerId};
    db.collection('employees2', function(err, collection) {
	collection.insert(employee, {safe:true}, function(err, result) {});
    });
    res.jsonp(employee	);
};

 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    console.log("Populating employee database...");
    var employees = [
        {"id": 1, "firstName": "James", "lastName": "King", "managerId": 0},
        {"id": 2, "firstName": "Julie", "lastName": "Taylor", "managerId": 1},
        {"id": 3, "firstName": "Eugene", "lastName": "Lee", "managerId": 1},
        {"id": 4, "firstName": "John", "lastName": "Williams", "managerId": 1}
    ];
 
    db.collection('employees2', function(err, collection) {
        collection.insert(employees, {safe:true}, function(err, result) {});
    });
 
};


