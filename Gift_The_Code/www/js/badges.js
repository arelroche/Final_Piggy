function Badges () {

  function awardBadge (name, reason, date) {
    localStorage.setItem(name, true)
    db.transaction(function (tx) {
      tx.executeSql('INSERT INTO badges (name, date) VALUES (?,?)', [name, date], function(trans, results) {
        var message = `Congratulatios, you won a badge for ${reason}!`
        notification(message)
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
    if (!loginCount) {
      localStorage.setItem('loginCount', 0)
    }
    if (parseInt(loginCount) >= 3) {
      awardBadge('loginBadge', 'logging in three times', Date.now())
      awardPoints(150)
      ShowLoginBadgeNotification()
      localStorage.setItem('loginCount', 0)
    }
  }

  function goalCompletedBadge () {
    db.transaction(function (tx) {
      tx.executeSql('SELECT id FROM goals WHERE complete = 1', [], function(trans, results) {
        if (results.rows.length === 1) {
          awardBadge('firstGoalBadge', 'reaching your first goal', Date.now())
          awardPoints(200)
          ShowFirstGoal()
        }
      })
    })
  }

  function threePetsBadge () {
    db.transaction(function (tx) {
      tx.executeSql('SELECT id FROM pets', [], function(trans, results) {
        if (results.rows.length === 3) {
          awardBadge('threePetsBadge', 'earning three pets', Date.now())
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
    var currentCount
    if(localStorage.getItem('loginCount') == "NaN"){
      localStorage.setItem('loginCount', 1);
      currentCount = parseInt(localStorage.getItem('loginCount'))
    } else {
      currentCount = parseInt(localStorage.getItem('loginCount'))
    }
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