
function PointsCalculator () {}

PointsCalculator.prototype.retrieveGoal = function (id, successCallback) {
  db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM goals WHERE id = ?', id, successCallback)
  })
};

PointsCalculator.prototype.retrieveGoalsPoints = function (ids, successCallback) {
  console.log("retrieveGoalsPoints")
  db.transaction(function (tx) {
    tx.executeSql('SELECT points FROM goals WHERE id IN (?,?)', ids, successCallback)
  })
};

PointsCalculator.prototype.savePointsForGoal = function (goal_id, points) {
  db.transaction(function (tx) {
    tx.executeSql('UPDATE goals SET points = ? WHERE id = ?', [points, goal_id], function(transaction, results) {
      console.log(results);
    })
  })
};


PointsCalculator.prototype.pointsForGoal = function(goal_id) {
  var that = this;
  this.retrieveGoal(goal_id, function(tx, results) {
    console.log("pointsForGoal")
    var goal = results.rows[0]
    var periodStart = new Date(goal.startDate).valueOf()
    var periodEnd = new Date(goal.endDate).valueOf()
    var periodDuration = periodEnd - periodStart
    var currentDate = Date.now();
    var periodElapsed = currentDate - periodStart

    var periodElapsedPercentage = (periodElapsed / periodDuration) * 100.0
    var proratedGoal = goal.goalMoney * periodElapsedPercentage

    var balance = goal.goalMoney - goal.currentMoney

    var percentCompletedTotalGoal = (balance / goal.goalMoney) * 100.0
    // var percentCompeltedProratedGoal = (balance / proratedGoal) * 100.0

    var points = that.pointsMultiplier(percentCompletedTotalGoal)
    that.savePointsForGoal(goal_id, points);

    return points
  }, 
  function(tx, err) {
    console.log(err);
  });
}

PointsCalculator.prototype.pointsMultiplier = function(percentCompleted) {
  var maxPoints = 1000

  if (percentCompleted < 25) {
    return (percentCompleted * 0.5) * maxPoints
  } else if (percentCompleted < 50) {
    return (percentCompleted * 0.6) * maxPoints
  } else if (percentCompleted < 75) {
    return (percentCompleted * 0.7) * maxPoints
  } else if (percentCompleted < 100) {
    return (percentCompleted * 0.9) * maxPoints
  } else if (percentCompleted >= 100) {
    return (percentCompleted * 1.0) * maxPoints
  }
}

PointsCalculator.prototype.aggregatePoints = function(goal_ids) {
  this.retrieveGoalsPoints(goal_ids, function(tx, results) {
    var total = 0
    for (i = 0; i < results.rows.length; i++) {
      total += results.rows[i].points
    }
    return total;
  },
  function(tx, err) {
    console.log(err);
  });
}

window.setTimeout(function() {
  pointsCalc = new PointsCalculator();
  pointsCalc.pointsForGoal([34]);
  pointsCalc.pointsForGoal([35]);
}, 1000);

window.setTimeout(function() {
  pointsCalc = new PointsCalculator();
  pointsCalc.aggregatePoints([34,35])
}, 2000);

