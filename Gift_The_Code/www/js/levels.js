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
  }

  return {
    currentLevel: currentLevel,
    updateLevel: updateLevel
  }
}