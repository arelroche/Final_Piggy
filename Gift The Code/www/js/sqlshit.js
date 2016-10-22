function makeGoal(type, currentmoney, goalmoney, startdate, enddate, complete, name)
{
  return {
    Type : type,
    CurrentMoney: currentmoney,
    GoalMoney: goalmoney,
    StartDate: startdate,
    EndDate: enddate,
    Complete: complete,
    Name: name
  }
}

function makeFreq(id, frequency)
{
  return {
    Frequency: frequency,
    Id: id
  }
}

function makePet(name, type, points, goalPoints, skincolor)
{
  return {
    Name: name,
    Type: type,
    Points: points,
    GoalPoints: goalPoints,
    SkinColor: skincolor
  }
}



var estimatedSize = 30 *1024*1024;

var db = window.openDatabase("piggy.db", 1.1, "piggy", estimatedSize);


// $(document).ready(function(){
  
  db.transaction(function (tx) {
    
    tx.executeSql("CREATE TABLE IF NOT EXISTS goals("+
                  "ID INTEGER PRIMARY KEY ASC,"+
                  "type TEXT,"+
                  "currentMoney money,"+
                  "goalMoney money,"+
                  "startDate datetime,"+
                  "endDate datetime,"+
                  "complete bit,"+
                  "points int,"+
                  "name TEXT)"
                  , [], onSuccess, onError);
    
    tx.executeSql("CREATE TABLE IF NOT EXISTS freq("+
                  "ID INTEGER PRIMARY KEY,"+
                  "fequency int)"
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
    
    tx.executeSql("CREATE TABLE IF NOT EXISTS itemhistory("+
                  "ID INTEGER PRIMARY KEY ASC,"+
                  "amount money,"+
                  "date datetime,"+
                  "name TEXT)"
                  , [], onSuccess, onError);
    
    tx.executeSql("CREATE TABLE IF NOT EXISTS itemmap("+
                  "idItem int,"+
                  "idGoal int"
                  , [], onSuccess, onError);
    
    // InsertGoal(makeGoal("Debt", 10, 50, new Date('2016-10-20'), new Date('2016-10-27'), 0, "card Y"));
    // InsertGoal(makeGoal("Savings", 10, 50, new Date('2016-10-20'), new Date('2016-11-20'), 0, "card Z"));
    
    tx.executeSql('SELECT * FROM goals', [], onSuccess2, onError);
    
    
    function InsertGoal(Goal)
    {
      tx.executeSql("INSERT INTO goals (type, currentMoney, goalMoney, startDate, endDate, complete, name) VALUES (?,?,?,?,?,?,?)", [Goal.Type, Goal.CurrentMoney, Goal.GoalMoney, Goal.StartDate, Goal.EndDate, Goal.Complete, Goal.Name], onSuccess, onError);  
    }
    
//    InsertGoal(makeGoal("Debt", 10, 50, new Date(), new Date(), 0, "card Z"));
    
  });

 
  function onSuccess(transaction, resultSet) {
    // log('Query completed: ' + JSON.stringify(resultSet) + ", " + JSON.stringify(resultSet.rows) + "," + resultSet.rows.length);
  }
  function onSuccess2(transaction, results) {
      var tblText='<p>';
      var len = results.rows.length;
      tblText+= "<p>" + len + "</p>";
      for (var i = 0; i < len; i++) {
        var tmpArgs=results.rows.item(i);
        tblText+= "<p>" + JSON.stringify(tmpArgs) + "</p>";
      }
      tblText +="</p>";
//      document.getElementById("tblDiv").innerHTML =tblText;
    // log('Query completed: ' + tblText);
  }

  function onError(transaction, error) {
      log('Query failed: ' + error.message);
  }

// });



function log(text)
{
  // $("#workspace").append("<p>"+text+"</p>");
  console.log(text);
}