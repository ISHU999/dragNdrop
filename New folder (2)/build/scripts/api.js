var express = require("express");
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var model = require('./model');

var api = express();
api.use(bodyParser.json());
api.use("/", express.static("C:/Users/asark5/Desktop/IAP2/xt_jan_2017_mentor_mentee/src/"))
mongoose.connect('10.150.222.28:27017/mentorMentee');
var db = mongoose.connection;

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
api.use(allowCrossDomain);

api.invalidSession = { error: "invalid session"};

api.post("/api/getData", function (request, response) {
    api.validateSession(request.body.userId, request.body.sessionId, function (result) {
        // console.log(result)
        if (!result) {
          return  response.status(401).json(api.invalidSession);
        }

        var table = request.body.table;
        console.log("Table:" + table + " :api/getData");
        model.getData(table, function (err, data) {
            if (err) {
                throw err;
            }
            return response.json(data);
        });
    });
});

api.post("/api/getDataByAttribute", function (request, response) {
    api.validateSession(request.body.userId, request.body.sessionId, function (result) {
        // console.log(result)
        if (!result) {
           return  response.status(401).json(api.invalidSession);
        }

        var attribute = request.body.attribute;
        var table = request.body.table;
        console.log("Table:" + table + " :api/getDataByAttribute/" + JSON.stringify(request.body));

        model.getDataByAttribute(table, attribute, function (err, data) {
            if (err) {
                throw err;
            }
            response.json(data);
        });
    });

});

api.post("/api/addData", function (request, response) {
    api.validateSession(request.body.userId, request.body.sessionId, function (result) {
        // console.log(result)
        if (!result) {
         return  response.status(401).json(api.invalidSession);
        }
        var data = request.body.data;
        var table = request.body.table;
        console.log("Table:" + table + " :api/addData/" + JSON.stringify(request.body));
        model.addData(table, data, function (err, data) {
            if (err) {
                throw err;
            }
            response.json(data);
        });
    });
});

api.put("/api/updateData", function (request, response) {
    console.log(__dirname+'/invalid-session.html');
    api.validateSession(request.body.userId, request.body.sessionId, function (result) {
        // console.log(result)
        if (!result) {
         return  response.status(401).json(api.invalidSession);
        }
        var data = request.body.data;
        var table = request.body.table;
        console.log("Table:" + table + " :api/updateData/" + JSON.stringify(request.body));
        console.log(data)
        model.updateData(table, data, {}, function (err, data) {
            if (err) {
                throw err;
            }
            response.json(data);
        });
    });
});

api.delete("/api/deleteData", function (request, response) {
    api.validateSession(request.body.userId, request.body.sessionId, function (result) {
        // console.log(result)
        if (!result) {
        return  response.status(401).json(api.invalidSession);
        }
        var id = request.body.id;
        var table = request.body.table;
        console.log("Table:" + table + " :api/deleteData/" + JSON.stringify(request.body));
        model.deleteData(table, id, function (err, data) {
            if (err) {
                throw err;
            }
            response.json(data);
        });
    });
});

api.post("/api/login", function (request, response) {
    var loginData = request.body.attribute;
    console.log("Table:login" + " :api/login/" + JSON.stringify(loginData));

    model.getDataByAttribute("login", loginData, function (err, data) {
        var returnData = { sessionId: "", flag: "false", id: "", admin: "" };
        var errorText = { "error": "" };
        if (err) {
            errorText.error = err;
            response.send(errorText);
        }
        else {
            if (data.length == 0) {
                return response.send(returnData);
            }
            var sId = model.generateSessionId(32);
            data[0].sessionId = sId;
            model.updateData("login", data[0], { new: true }, function (err, data) {

                if (err) {
                    console.log("Error updating");
                    errorText.error += "Error updating:==>" + err;
                    response.send(errorText);
                }
                else {
                    returnData.sessionId = sId;
                    returnData.flag = true;
                    returnData.id = data.id;
                    returnData.admin = data.admin;
                    console.log(returnData)
                    response.send(returnData);
                }
            });
        }
    });

});

api.post('/api/logout',function(request,response){
     var data = request.body;
    console.log("Table:logout" + " :api/logout/" + JSON.stringify(data));
   
     console.log(data)
      model.updateData("login", data, {}, function (err, data) {
            if (err) {
                throw err;
            }
            response.json(data);
        });
})

api.validateSession = function (id, sessionId, resultFn) {
    var attribute = { id: id, sessionId: sessionId };
    model.getDataByAttribute('login', attribute, function (err, data) {
        if (err) {
            throw err + ' error validating session';
        }
        if (data.length == 1) {
            console.log('Session Validation success');
            return resultFn(true);
        }
        else {
            console.log('Session Validation failed');
            return resultFn(false);
        }
    });
}

var server = api.listen(2020, function () {
    console.log("server started and listening :=" + server.address().port);
});