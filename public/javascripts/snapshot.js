window.initSnapshot = function () {
  var snapshotContainer = $('.section-snapshot-container');
  snapshotContainer.toArray().forEach((snap) => {
    var shot = $(snap);
    var height = Number(shot[0].scrollHeight * 0.5);
    shot.height(height);
  })
}

window.initSnapshot();