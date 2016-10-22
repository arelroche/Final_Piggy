
function PointsCalculator () {
  
  function getActiveGoals (date, successCallback) {
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM goals WHERE startDate < ? AND endDate >= ?', [date, date], successCallback)
    })
  }

  // function retrieveGoal (id, successCallback) {
  //   db.transaction(function (tx) {
  //     tx.executeSql('SELECT * FROM goals WHERE id = ?', id, successCallback)
  //   })
  // };

  // function retrieveGoalsPoints (ids, successCallback) {
  //   db.transaction(function (tx) {
  //     tx.executeSql('SELECT points FROM goals WHERE id IN (?,?)', ids, successCallback)
  //   })
  // };

  function savePointsForGoal (goal_id, points) {
    db.transaction(function (tx) {
      tx.executeSql('UPDATE goals SET points = ? WHERE id = ?', [points, goal_id], function(transaction, results) {
        console.log(results);
      })
    })
  };

  function markGoalAsComplete (goal_id) {
    db.transaction(function (tx) {
      tx.executeSql('UPDATE goals SET complete = 1 WHERE id = ?', [goal_id], function(transaction, results) {
        console.log(results);
      })
    })
  }


  function pointsForGoal (goal) {
    var periodStart = new Date(goal.startDate).valueOf()
    var periodEnd = new Date(goal.endDate).valueOf()
    var periodDuration = periodEnd - periodStart
    var currentDate = Date.now();
    var periodElapsed = currentDate - periodStart

    var periodElapsedPercentage = (periodElapsed / periodDuration) * 100.0
    // var proratedGoal = goal.goalMoney * periodElapsedPercentage

    var balance = goal.goalMoney - goal.currentMoney

    var percentCompletedTotalGoal = (balance / goal.goalMoney) * 100.0
    // var percentCompeltedProratedGoal = (balance / proratedGoal) * 100.0

    var points = pointsMultiplier(percentCompletedTotalGoal, goal)
    goal.points = points;
    console.log(`POINTS FOR ${goal.name}: ${goal.points}`)
    savePointsForGoal(goal.id, points);
  }

  function pointsMultiplier (percentCompleted, goal) {
    var totalMultiplier = 10

    if (percentCompleted < 25) {
      return (percentCompleted * 0.5) * totalMultiplier
    } else if (percentCompleted < 50) {
      return (percentCompleted * 0.6) * totalMultiplier
    } else if (percentCompleted < 75) {
      return (percentCompleted * 0.7) * totalMultiplier
    } else if (percentCompleted < 100) {
      return (percentCompleted * 0.9) * totalMultiplier
    } else if (percentCompleted >= 100) {
      markGoalAsComplete(goal.id)
      return (percentCompleted * 1.0) * totalMultiplier
    }
  }

  var aggregatePoints = function(currentGoals) {
    console.log("AGGRETAGE POINTS")
    var promise = new Promise(function(resolve, reject) {
      var sum = 0
      currentGoals.forEach(function(goal) {
        sum += goal.points
      });
      var total = sum / currentGoals.length
      console.log(`AGGRETAGED POINTS: ${total}`)
      resolve(total);
    })
  }

  var getCurrentGoals = function() {
    console.log("GET CURRENT GOALS")
    var promise = new Promise(function(resolve, reject) {
      var currentGoals = []
      getActiveGoals(new Date().valueOf(), function(tx, results) {
        for (i = 0; i < results.rows.length; i++) {
          currentGoals.push(results.rows[i])
        };
        console.log(currentGoals)
        resolve(currentGoals);
      });
    })
    return promise
  }

  var updateCurrentGoals = function (currentGoals) {
    console.log("UPDATE CURRENT GOALS")
    var promise = new Promise(function(resolve, reject) {
      currentGoals.forEach(function(goal) {
        pointsForGoal(goal)
      });
      console.log(currentGoals)
      resolve(currentGoals)
    })
    return promise
  }

  return {
    getCurrentGoals: getCurrentGoals,
    updateCurrentGoals: updateCurrentGoals,
    aggregatePoints: aggregatePoints
  }

}

window.setTimeout(function() {
  pointsCalc = new PointsCalculator();
  pointsCalc.getCurrentGoals()
    .then(pointsCalc.updateCurrentGoals)
    .then(pointsCalc.aggregatePoints)
}, 1000);



