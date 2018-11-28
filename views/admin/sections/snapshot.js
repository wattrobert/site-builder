var snapshotContainer = $('.section-snapshot-container');
// var snapshots = $('.section-snapshot');
snapshotContainer.toArray().forEach((snap) => {
  var shot = $(snap);
  var height = Number(shot[0].scrollHeight * 0.5);
  shot.height(height);
  shot.parent().css('min-height', height + 40)
})