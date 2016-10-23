function Badges () {

  function awardBadge (name, date) {
    db.transaction(function (tx) {
      tx.executeSql('INSERT INTO badges (name, date) VALUES (?,?)', [name, date], function(trans, results) {
        console.log(`Awarded badge ${name}`)
      })
    })
  }

  function awardPoints (amt) {
    var currentPoints = parseInt(localStorage.getItem('currentTotalPoints'))
    var updatedPoints = currentPoints + amt
    localStorage.setItem('staticPoints', updatedPoints)
    console.log(`Awarded ${amt} points`)
  }

  function loginBadge () {
    localStorage.getItem('loginCount')
    if (loginCount === 10) {
      awardBadge('loginBadge', Date.now())
      awardPoints(150)
    }
  }

  function goalCompletedBadge () {
    db.transaction(function (tx) {
      tx.executeSql('SELECT id FROM goals WHERE complete = 1', [], function(trans, results) {
        if (results.rows.length === 1) {
          awardBadge('firstGoalBadge', Date.now())
          awardPoints(200)
        }
      })
    })
  }

  function threePetsBadge () {
    db.transaction(function (tx) {
      tx.executeSql('SELECT id FROM pets', [], function(trans, results) {
        if (results.rows.length === 3) {
          awardBadge('threePetsBadge', Date.now())
          awardPoints(250)
        }
      })
    })
  }

  var updateBadges = function() {
    loginBadge();
    goalCompletedBadge();
    threePetsBadge();
  }

  var userBadges = function() {
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM badges', [], function(trans, results) {
        return results.rows
      })
    })
  }

  return {
    userBadges: userBadges,
    updateBadges: updateBadges
  }
}