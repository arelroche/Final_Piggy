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
    tx.executeSql("DROP TABLE goals", [], onSuccess, onError);

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

    tx.executeSql("CREATE TABLE IF NOT EXISTS transactionhistory("+
                  "ID INTEGER PRIMARY KEY ASC,"+
                  "amount money,"+
                  "date long,"+
                  "name TEXT)"
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

    tx.executeSql("DELETE FROM goals");

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
    //    ClearPets(tx);
        ClearUncategorizedTransaction(tx);
    //    
        GenerateTables(tx);
    //    EchoDB(tx);
    //    
        InsertGoal(tx, makeGoal("debt", 0, 500, new Date().valueOf(), new Date().valueOf(), 0, "costco"));
    //    InsertMap(tx, makeMap("costco", 1));
    //    InsertMap(tx, makeMap("costco2", 1));
    //    InsertMap(tx, makeMap("costco5", 1));
        
        // var testData = [[new Date(1000000).valueOf(), "costco" , 100.0],[new Date(1000000).valueOf(), "costco 2" , 100.0],[new Date(1000000).valueOf(), "costco" , 100.50],[new Date(1000000).valueOf(), "costco 2" , 100.50],[new Date(1000000).valueOf(), "costco 5" , 500.0]];
        
        // UpdateDatabaseWithTransationInfo(tx, testData);
        
        
        
    //    tx.executeSql("SELECT * FROM transactionmap", [], onSuccess2, onError);
    //    tx.executeSql("SELECT * FROM goals", [], onSuccess2, onError);
        
    //     setTimeout(function(){
    //       GetUncategorizedTransactions(function(results){
    //         Log(results);
    //       });
    //       GetGoals(function(results){
    //         Log(results);
    //       });
    //       db.transaction(function (tx) {
    //         tx.executeSql("SELECT * FROM goals", [], onSuccess2, onError);
    // //        tx.executeSql("SELECT * FROM uncategorizedtransaction", [], onSuccess2, onError);
    //       });
    //     }, 1000);
        resolve()
      });
    });
    return promise
  }

  var updateDatabaseWithTransationInfo = function(tx, TransactionInfo)
  {
    var promise = new Promise(function(resolve, reject) {

      db.transaction(function(tx) {
        var len = TransactionInfo.length;
        //check if the last exisits
        var cnt = len -1;
        var date = TransactionInfo[cnt][0];
        var name = TransactionInfo[cnt][1];
        var amount= TransactionInfo[cnt][2];

        var finalLen = len;
        var onFree = function()
        {
          var ques = "";
          for(var cnt = 0; cnt < finalLen; cnt++){
            var date = TransactionInfo[cnt][0];
            var name = TransactionInfo[cnt][1];
            var amount= TransactionInfo[cnt][2];
            InsertItemHistory(tx, makeItem(amount, date, name));
            UpdateGoal(tx, date, amount, name);
          }
          console.log("UPDATED DATABASE WITH TRANSACTION INFO")
          resolve()
        }
        
        var onExists = function()
        {
            cnt--;
            if(cnt < 0)
              return;
            
            date = TransactionInfo[cnt][0];
            name = TransactionInfo[cnt][1];
            amount= TransactionInfo[cnt][2];
            CheckTransaction(tx, date, name, amount, onFree, onExists);  
        }
        
        CheckTransaction(tx, date, name, amount, onFree, onExists);
      })
    });

    return promise
  };


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


  function EchoDB(tx)
  {
    tx.executeSql("SELECT * FROM goals", [], onSuccess2, onError);
    tx.executeSql("SELECT * FROM pets", [], onSuccess2, onError);
    tx.executeSql("SELECT * FROM transactionhistory", [], onSuccess2, onError);
    tx.executeSql("SELECT * FROM transactionmap", [], onSuccess2, onError);
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

  function CheckTransaction(tx, date, name, amount, onFree, onExist)
  {
    tx.executeSql("SELECT * FROM transactionhistory Where name = ? AND date = ? AND amount = ?", [name, date, amount], function(trans, results){
      if(results.rows.length > 0)
      {
        onExist();
      }
      else
      {
        onFree();
      }
    },onError);
  }

  function Will()
  {
    Matt(function(results){
      $("body").append(results);
    });
  }


  function Matt(returnFunc)
  {
    
    
    //do stuff thoughDB and get results in async function
    var results = [];
    returnFunc(results);
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