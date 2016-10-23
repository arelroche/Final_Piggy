/* functions to Make an Entry for each Table in the BD*/
function DatabaseSetup () {
  //Estimated size of DB 30mb
  var estimatedSize = 30*1024*1024;

//open the DB, name of DB is piggy
  window.db = window.openDatabase("piggy.db", 1.1, "piggy", estimatedSize);

/*Function to Make Each Table in the DB*/
  function GenerateTables(tx)
  {
  console.log("GENERATING DATAGBASE TABLES")
//    tx.executeSql("DROP TABLE goals", [], onSuccess, onError);

    tx.executeSql("CREATE TABLE IF NOT EXISTS goals("+
                  "ID INTEGER PRIMARY KEY ASC,"+
                  "type TEXT,"+
                  "currentMoney money,"+
                  "goalMoney money,"+
                  "startDate long,"+
                  "endDate long,"+
                  "complete bit,"+
                  "points int,"+
                  "priority int,"+
                  "progress int,"+
                  "standing int,"+
                  "name TEXT)"
                  , [], onSuccess, onError);

    tx.executeSql("CREATE TABLE IF NOT EXISTS pets("+
                  "ID INTEGER PRIMARY KEY ASC,"+
                  "type TEXT,"+
                  "currentPoints int,"+
                  "finalPoints int,"+
                  "expression text,"+
                  "skincolor text,"+
                  "name TEXT)"
                  , [], onSuccess, onError);

  tx.executeSql("DROP TABLE transactionhistory", [], onSuccess, onError);
  tx.executeSql("CREATE TABLE IF NOT EXISTS transactionhistory("+
                "amount money,"+
                "date long,"+
                "name TEXT, "+
                "CONSTRAINT pk_TransHist PRIMARY KEY (amount, date, name))"
                , [], onSuccess, onError);


    tx.executeSql("CREATE TABLE IF NOT EXISTS badges("+
                     "ID INTEGER PRIMARY KEY,"+
                     "name text UNIQUE,"+
                     "date long)"
                    , [], onSuccess, onError);


  //  tx.executeSql("DROP TABLE itemmap", [], onSuccess, onError);
    
    tx.executeSql("CREATE TABLE IF NOT EXISTS transactionmap("+
                  "item TEXT NOT NULL,"+
                  "idGoal int NOT NULL,"+
                  "CONSTRAINT pk_ItemMap PRIMARY KEY (item, idGoal))"
                  , [], onSuccess, onError);
    
    tx.executeSql("CREATE TABLE IF NOT EXISTS uncategorizedtransaction("+
                  "amount money,"+
                  "date long,"+
                  "name TEXT)"
                  , [], onSuccess, onError);

//    tx.executeSql("DELETE FROM goals");

    InsertGoal(tx, makeGoal("Debt", 15, 50, new Date('2016-10-20').valueOf(), new Date('2016-10-27').valueOf(), 0, "card Y", 0));
    InsertGoal(tx, makeGoal("Savings", 33, 50, new Date('2016-10-20').valueOf(), new Date('2016-11-20').valueOf(), 0, "card Z", 1));
    InsertGoal(tx, makeGoal("Spending", 980, 1000, new Date('2016-10-20').valueOf(), new Date('2016-10-27').valueOf(), 0, "card X", 2));
  }

  var buildDatabase = function() {
    var promise = new Promise(function(resolve, reject) {
      console.log("BUILDING DATABASE")
      db.transaction(function (tx) {
        ClearGoals(tx);
        ClearItemHistory(tx);
        ClearItemMap(tx);
        ClearPets(tx);
        ClearUncategorizedTransaction(tx);
    
        GenerateTables(tx);
        
        resolve()
      });
    });
    return promise
  }

  
  function getDate(date)
  {
    var temp = date.split(' ');
    return new Date(temp[1]+"-"+temp[0]+"-2016").valueOf();
  }
  
  var updateDatabaseWithTransationInfo = function()
  {
    var promise = new Promise(function(resolve, reject) {
      window.db.transaction(function(tx){
        var TransactionInfo = JSON.parse(localStorage.getItem("userAccountTransactions"));
        for(var cnt = 0; cnt < TransactionInfo.length; cnt++){
          var date = getDate(TransactionInfo[cnt][0]);
          var name = TransactionInfo[cnt][1];
          var amount= parseFloat(TransactionInfo[cnt][2].substr(4, TransactionInfo[cnt][2].length));

          InsertItemHistory(tx, makeItem(amount, date, name), function(tx, results){
            //did add to table
            UpdateGoal(tx, date, amount, name);
          }, function(tx, error){
            //didnt add to table
          }); 
        }
        resolve();
      });
    });
    return promise
  }
  
  function makeGoal(type, currentmoney, goalmoney, startdate, enddate, complete, name, priority)
  {
    return {
      Type : type,
      CurrentMoney: currentmoney,
      GoalMoney: goalmoney,
      StartDate: startdate,
      EndDate: enddate,
      Complete: complete,
      Name: name,
      Priority: priority
    }
  }
  function makePet(type, points, goalPoints, expression, skincolor, name)
  {
    return {
      Name: name,
      Type: type,
      Points: points,
      GoalPoints: goalPoints,
      Expression: expression,
      SkinColor: skincolor
    }
  }
  function makeItem(amount, date, name)
  {
    return {
      Amount: amount,
      Date: date,
      Name: name
    }
  }
  function makeMap(item, idGoal)
  {
    return{
      Item: item,
      IDGoal: idGoal
    };
  }

  /*Set of testing Callback Funcitons*/
  function onSuccess(transaction, resultSet) {
    log('Query completed: ' + JSON.stringify(resultSet) + ", " + JSON.stringify(resultSet.rows) + "," + resultSet.rows.length);
  }
  function onSuccess2(transaction, results) {
    var tblText='<p>';
      var len = results.rows.length;
      tblText+= "<p> Length: " + len + "</p>";
      for (var i = 0; i < len; i++) {
        var tmpArgs=results.rows.item(i);
        tblText+= "<p>" + JSON.stringify(tmpArgs) + "</p>";
      }
      tblText +="</p>";
    log('Query completed: ' + tblText);
  }
  function onError(transaction, error) {
        log('Query failed: ' + error.message);
    }

  /*Set of Insert Statements for each Table in the DB */
  function InsertMap(tx, Map)
  {
    tx.executeSql("INSERT INTO transactionmap (item, idGoal) VALUES (?,?)", [Map.Item, Map.IDGoal], onSuccess, onError);  
  }
  function InsertGoal(tx, Goal)
  {
    tx.executeSql("INSERT INTO goals (type, currentMoney, goalMoney, startDate, endDate, complete, name) VALUES (?,?,?,?,?,?,?)", [Goal.Type, Goal.CurrentMoney, Goal.GoalMoney, Goal.StartDate, Goal.EndDate, Goal.Complete, Goal.Name], onSuccess, onError);  
  }
  function InsertPet(tx, Pet)
  {
    tx.executeSql("INSERT INTO pets (type, currentPoints, finalPoints, expression, skincolor, name) VALUES (?,?,?,?,?,?)", [Pet.Type, Pet.Points, Pet.GoalPoints, Pet.Expression, Pet.Skincolor,  Pet.Name], onSuccess, onError);  
  }
  function InsertItemHistory(tx, Item, Success, Fail)
  {
    var success = Success || onSuccess;
    var fail = Fail || onError;
    tx.executeSql("INSERT INTO transactionhistory (amount, date, name) VALUES (?,?,?)", [Item.Amount, Item.Date, Item.Name], success, fail);  
  }
  function InsertUncategorizedTransaction(tx, Item)
  {
    tx.executeSql("INSERT INTO uncategorizedtransaction (amount, date, name) VALUES (?,?,?)", [Item.Amount, Item.Date, Item.Name], onSuccess, onError);  
  }

  /*Set of functions to Clear Each table in the Database*/
  function ClearPets(tx)
  {
    tx.executeSql("DELETE FROM pets", [], onSuccess, onError);  
  }
  function ClearGoals(tx)
  {
    tx.executeSql("DELETE FROM goals", [], onSuccess, onError);  
  }
  function ClearItemHistory(tx)
  {
    tx.executeSql("DELETE FROM transactionhistory", [], onSuccess, onError);  
  }
  function ClearItemMap(tx)
  {
    tx.executeSql("DELETE FROM transactionmap", [], onSuccess, onError);  
  }
  function ClearUncategorizedTransaction(tx)
  {
    tx.executeSql("DELETE FROM uncategorizedtransaction", [], onSuccess, onError);  
  }


  /*Update goal, transaction history with unique data*/
  function getSimpleName(name)
  {
    return name.substr(0, ((name.indexOf(' ') === -1)? name.length : name.indexOf(' ')));
  }

  function UpdateGoal(tx, date, amount, name)
  { 
    var simpleName = getSimpleName(name);
    tx.executeSql("SELECT * FROM transactionmap WHERE item = ?", [simpleName], function(trans, result){
      if(result.rows.length > 0)
      {
        tx.executeSql("UPDATE goals SET "+
                      "currentMoney = currentMoney + ? "+
                      "WHERE ID = ?",
                     [amount, result.rows[0].idGoal], onSuccess, onError);
      }
      else
      {
         InsertUncategorizedTransaction(tx, makeItem(amount, date, name));
      }
    }, onError);
  }

  function sendCallback(results, callback)
  {
    if(results.rows.length > 0)
    {
      var result = [];
      for (var cnt = 0; cnt < results.rows.length; cnt++){
        var row = results.rows[cnt];
        var rowData = [];
        Object.keys(row).forEach(function(name){
          rowData.push(row[name]);
        });
        result.push(rowData);
      }
      console.log(result);
      callback(result);
    }
    else{
      callback([]);
    }
  }

  function getUncategorizedTransactions(callback)
  {
    db.transaction(function(tx){
      tx.executeSql("SELECT * FROM uncategorizedtransaction",[],function(tx, results){
        sendCallback(results, callback);
      }, onError);
    });
  }

  function getAllGoals(callback)
  {
    db.transaction(function(tx){
      tx.executeSql("SELECT * FROM goals",[],function(tx, results){
        sendCallback(results, callback);
      }, onError);
    });
  }

  function getSpendingGoals(callback)
  {
    db.transaction(function(tx){
      tx.executeSql("SELECT * FROM goals WHERE type = 'Spending'",[],function(tx, results){
        sendCallback(results, callback);
      }, onError);
    });
  }

  function getSavingGoals(callback)
  {
    db.transaction(function(tx){
      tx.executeSql("SELECT * FROM goals WHERE type = 'Saving'",[],function(tx, results){
       sendCallback(results, callback);
      }, onError);
    });
  }

  function getRepayingGoals(callback)
  {
    db.transaction(function(tx){
      tx.executeSql("SELECT * FROM goals WHERE type = 'Debt'",[],function(tx, results){
        sendCallback(results, callback);
      }, onError);
    });
  }


  var logCnt = 0;
  function Log(text)
  {
    log("" + (logCnt++) + ": "+ text);
  }



  function log(text)
  {
    $("#workspace").append("<p>"+text+"</p>");
  };

  return {
    buildDatabase: buildDatabase,
    updateDatabaseWithTransationInfo: updateDatabaseWithTransationInfo
  }
}