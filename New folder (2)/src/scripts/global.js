
var db = {
    reqType: "",
    reqData: "",
    data: "",
    successFunc: "",
    errFunc: "",
    login: function (data, successFunc, errFunc) {
        db.reqData = "login";
        db.reqType = "POST";
        console.log(db.reqType)
        db.data = data;
        db.successFunc = successFunc;
        db.errFunc = errFunc;
        db.ajax();
    },
    logout: function ( successFunc, errFunc) {
        db.reqData = "logout";
        db.reqType = "POST";
        var data={};
        data.id = parseInt(localStorage.getItem('id'));
        data.sessionId = "";
        db.data = data;
        db.successFunc = successFunc;
        db.errFunc = errFunc;
        db.ajax();
    },
    accessData: function (requestData, table, data, successFunc, errFunc) {
        db.successFunc = successFunc;
        db.errFunc = errFunc;
        db.reqData = requestData;

        var errorMsg = "";
        if (table === "supervisor" || table === "supervisee" || table === "admin" || table === "login") {


            data.table = table;
            data.userId = parseInt(localStorage.getItem('id'));
            data.sessionId = localStorage.getItem('session_id');
            db.data = data;
        }
        else {
            errorMsg += "Invalid table requested.\nAccepted Types: \n1.supervisor \n2.supervisee\n3.admin";
        }

        if (requestData === "deleteData") {
            db.reqType = "DELETE";
        }
        else if (requestData === "updateData") {
            db.reqType = "PUT";
        }
        else if (requestData === "getData" || requestData === "getDataByAttribute" || requestData === "addData" || requestData === "getDataById") {
            db.reqType = "POST";
        }
        else {
            errorMsg += "\nInvalid requestType.\nAccepted Types:\n1.deleteData \n2.updateData \n3.getData\n4.getDataByAttribute\n5.addData\n\n";
        }


        try {
            JSON.parse(JSON.stringify(data));
            // if((requestData != "getData")||(data.id==null||data.id==""))
            //     errorMsg+="Missing id attribute";
        } catch (e) {
            errorMsg += 'Please provide valid JSON data::=> ' + e.message;
        }



        if (errorMsg != "") {
            return errFunc(errorMsg);
        }

        db.ajax();

    },
    ajax: function () {

        $.ajax({
            type: db.reqType,
            contentType: "application/json",
            url: "http://10.150.222.28:2020/api/" + db.reqData,
            data: JSON.stringify(db.data),
            success: db.successFunc,
            error: db.errFunc
        });
    },
    setLocalStorage: function (keyValue, cvalue) {
        localStorage.setItem(keyValue, cvalue);
    },
    removeLocalStorage: function (value) {
        localStorage.removeItem(value);
    }


}