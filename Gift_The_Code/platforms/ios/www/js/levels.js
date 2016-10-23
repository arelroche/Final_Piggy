function Levels () {

  var updateLevel = function () {
    var dynamicPoints = localStorage.getItem('currentTotalPoints')
    var staticPoints = localStorage.getItem('staticPoints')
    var total = parseInt(dynamicPoints) + parseInt(staticPoints)
    if (total >= 1000) {
      levelUp();
    } 
  }

  var currentLevel = function() {
    return parseInt(localStorage.getItem('currentLevel'));
  }

  function levelUp () {
    var newLevel = currentLevel() + 1
    localStorage.setItem('currentLevel', newLevel)
    localStorage.setItem('staticPoints', 0)
    spawnNewCreature()
  }

  function spawnNewCreature() {
    db.transaction(function (tx) {
      tx.executeSql('INSERT INTO pets (type, currentPoints, expression, skincolor, name) '+
                    'VALUES (?,?,?,?,?)', 
                    ['owl', 0, 'happy', 'brown', 'Your new Pal!'], 
                    function(trans, results) {
                      console.log("New creature created!");
                    })
    })
  }

  return {
    currentLevel: currentLevel,
    updateLevel: updateLevel
  }
}