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
    var level = localStorage.getItem('currentLevel')
    if (!level) {
      localStorage.setItem('currentLevel', 1)
    }
    return parseInt(localStorage.getItem('currentLevel'));
  }

  function levelUp () {
    var newLevel = currentLevel() + 1
    var message = `Congratulations, you beat the level! You're now up to level ${newLevel}!`
    localStorage.setItem('currentLevel', newLevel)
    localStorage.setItem('staticPoints', 0)
    notification(message);
    spawnNewCreature()
    ShowNewPal()
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