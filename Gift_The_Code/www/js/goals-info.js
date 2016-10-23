function GoalsInfo () {

  function formatData(tx, results) {
    var rows = results.rows
    var results = []
    for (i = 0; i < rows.length; i++) {
      results.push(rows[i])
    }
    return results;
  }

  var activeGoals = function() {
    var date = new Date().valueOf()
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM goals WHERE startDate < ? AND endDate >= ?', [date, date], formatData)
    })
  };

  var pastGoals = function() {
    var date = new Date().valueOf()
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM goals WHERE endDate < ?', [date], formatData)
    })
  }

  var totalPoints = function() {
    var dynamicPoints = localStorage.getItem('currentTotalPoints')
    var staticPoints = localStorage.getItem('staticPoints')
    return parseInt(dynamicPoints) + parseInt(staticPoints)
  }

  return {
    activeGoals: activeGoals,
    pastGoals: pastGoals,
    totalPoints: totalPoints
  }
}