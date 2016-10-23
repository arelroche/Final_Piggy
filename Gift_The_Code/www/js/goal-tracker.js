
function GoalTracker () {
  
  function getActiveGoals (date, successCallback) {
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM goals WHERE startDate < ? AND endDate >= ?', [date, date], successCallback)
    })
  }

  function savePointsForGoal (goal_id, points) {
    db.transaction(function (tx) {
      tx.executeSql('UPDATE goals SET points = ? WHERE id = ?', [points, goal_id], function(transaction, results) {
        console.log("updated points");
      })
    })
  };

  function markGoalAsComplete (goal_id) {
    db.transaction(function (tx) {
      tx.executeSql('UPDATE goals SET complete = 1 WHERE id = ?', [goal_id], function(transaction, results) {
        console.log("saved goal as complete");
      })
    })
  }

  function saveProgressForGoal (goal_id, percentCompleted) {
    db.transaction(function (tx) {
      tx.executeSql('UPDATE goals SET progress = ? WHERE id = ?', [percentCompleted, goal_id], function(transaction, results) {
        console.log("updated progress")
      })
    })
  }

  function saveStandingForGoal (goal_id, standing) {
    db.transaction(function (tx) {
      tx.executeSql('UPDATE goals SET standing = ? WHERE id = ?', [standing, goal_id], function(transaction, results) {
        console.log("updated progress")
      })
    })
  }

  function proratedGoalProgress (goal) {
    var periodStart = goal.startDate
    var periodEnd = goal.endDate
    var periodDuration = periodEnd - periodStart
    var currentDate = Date.now();
    var periodElapsed = currentDate - periodStart

    var periodElapsedProportion = (periodElapsed / periodDuration)
    var proratedGoal = goal.goalMoney * periodElapsedProportion
    var percentCompletedProratedGoal = (goal.currentMoney / proratedGoal) * 100

    saveStandingForGoal(goal.ID, parseInt(percentCompletedProratedGoal));
  }

  function pointsForGoal (goal) {
    var periodStart = goal.startDate
    var periodEnd = goal.endDate
    var periodDuration = periodEnd - periodStart
    var currentDate = Date.now();
    var periodElapsed = currentDate - periodStart
    var percentCompletedTotalGoal = (goal.currentMoney / goal.goalMoney) * 100
    // var points = pointsMultiplier(percentCompletedTotalGoal, goal);
    var points = Math.floor(percentCompletedTotalGoal * 10)
    // alert(`POINTS FOR ${goal.name}: ${points}`)
    goal.points = points;
    savePointsForGoal(goal.ID, points);
    saveProgressForGoal(goal.ID, points)
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
      markGoalAsComplete(goal.ID)
      return (percentCompleted * 1.0) * totalMultiplier
    }
  }

  var aggregatePoints = function(currentGoals) {
    console.log("AGGREGATE POINTS")
    var promise = new Promise(function(resolve, reject) {
      // var originalMax = 1000
      var sum = 0
      // var weightedSum = 0
      var total = 0
      getActiveGoals(new Date().valueOf(), function(tx, results) {
        for (i = 0; i < results.rows.length; i++) {
          var points = results.rows.item(i).points;
          sum += points;
        };
        // var priority = goal.priority
        // var weight = 1 - (priority / 10)
        // sum += goal.points
        // weightedSum += goal.points * weight
        total = parseInt(sum / results.rows.length)
        localStorage.setItem('currentTotalPoints', total)
        resolve(total);
      });
      // var reduceMaxBy = weightedSum / sum
      // var newMax = originalMax * reduceMaxBy
      // var denominator = (total / newMax)
      // var totalWeightedPoints = originalMax * denominator
    })
  }

  var getCurrentGoals = function() {
    console.log("GET CURRENT GOALS")
    var promise = new Promise(function(resolve, reject) {
      var currentGoals = []
      getActiveGoals(new Date().valueOf(), function(tx, results) {
        for (i = 0; i < results.rows.length; i++) {
          currentGoals.push(results.rows.item(i))
        };
        resolve(currentGoals);
      });
    })
    return promise
  }

  var updateCurrentGoals = function (currentGoals) {
    console.log("UPDATE CURRENT GOALS")
    var promise = new Promise(function(resolve, reject) {
      currentGoals.forEach(function(goal) {
        pointsForGoal(goal);
        proratedGoalProgress(goal);
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



