function Badges () {

  function awardBadge (name, date) {
    debugger;
    localStorage.setItem(name, true)
    db.transaction(function (tx) {
      tx.executeSql('INSERT INTO badges (name, date) VALUES (?,?)', [name, date], function(trans, results) {
        console.log(`Awarded badge ${name}`)
      })
    })
  }

  function awardPoints (amt) {
    var currentPoints = parseInt(localStorage.getItem('staticPoints'))
    var updatedPoints = currentPoints + amt
    localStorage.setItem('staticPoints', updatedPoints)
    console.log(`Awarded ${amt} points`)
  }

  function loginBadge () {
    var loginCount = localStorage.getItem('loginCount')
    if (parseInt(loginCount) === 10) {
      awardBadge('loginBadge', Date.now())
      awardPoints(150)
      localStorage.setItem('loginCount', 0)
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
    var currentBadges = []
    var badgeNames = ['threePetsBadge', 'firstGoalBadge', 'loginBadge']
    badgeNames.forEach(function(name) {
      var badge = localStorage.getItem(name)
      if (badge === 'true') {
        currentBadges.push(name)
      }
    })
    return currentBadges

    // db.transaction(function (tx) {
    //   tx.executeSql('SELECT * FROM badges', [], function(trans, results) {
    //     var currentBadges = []
    //     for (i = 0; i < results.rows.length; i++) {
    //       currentBadges.push(results.rows.item(i))
    //     };
    //     return currentBadges
    //   })
    // })
  }

  var trackLogin = function() {
    var currentCount = parseInt(localStorage.getItem('loginCount'))
    var newCount = currentCount + 1
    localStorage.setItem('loginCount', newCount)
    awardPoints(50);
  }

  return {
    userBadges: userBadges,
    updateBadges: updateBadges,
    trackLogin: trackLogin
  }
}