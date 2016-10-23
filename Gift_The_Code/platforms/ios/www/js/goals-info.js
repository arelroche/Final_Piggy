function GoalsInfo () {

  function formatData(results, done) {
    var rows = results.rows
    var results = []
    for (i = 0; i < rows.length; i++) {
      results.push(rows.item(i))
    }
    done(results)
  }

  var activeGoals = function(done) {
    var date = new Date().valueOf()
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM goals WHERE startDate < ? AND endDate >= ?', [date, date], function(tx, results) {
        formatData(results, done)
      })
    })
  };

  var pastGoals = function() {
    var date = new Date().valueOf()
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM goals WHERE endDate < ?', [date], formatData)
    })
  }

  var totalPoints = function() {
    var dynamicPoints = parseInt(localStorage.getItem('currentTotalPoints'))
    var staticPoints = parseInt(localStorage.getItem('staticPoints'))
    return dynamicPoints + staticPoints
  }

  return {
    activeGoals: activeGoals,
    pastGoals: pastGoals,
    totalPoints: totalPoints
  }
}