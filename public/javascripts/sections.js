$('#sectionSelector').on('shown.bs.modal', window.initSnapshot)
$('#sectionSelector').on('hide.bs.modal', resetSelection)

function toggleSection(id) {
  $('[data-id=' + id + ']').toggleClass('selected');
  var selectedCount = $('.section-option.selected').length;
  $('#selectionCount').html(`${selectedCount} selected`);
  $('#addSelectionsBtn').attr('disabled', !selectedCount);
}

function resetSelection() {
  $('.section-option').removeClass('selected');
  $('#selectionCount').html('0 selected');
  $('#addSelectionsBtn').attr('disabled', true);
}

function removeSection(index) {
  $('.sortable-list-item')[0]
}

function addSections() {
  var val = $('#sections').val();
  var oldSections = val && val.length ? val.split(',') : [];
  var newSections = $('.section-option.selected').toArray().map((element) => element.attributes['data-id'].value);
  var currentSections = oldSections.concat(newSections);
  $('#sections').val(currentSections.join(','));
  refreshSortableSections(currentSections);
}

function refreshSortableSections(sectionIds) {
  $.ajax({
    type: 'GET',
    url: '/api/pages/sections/refresh',
    data: {
      sections: sectionIds
    },
    dataType: 'html',
    success: function (updatedTemplate) {

      $('#sectionSelector').modal('hide');
      $('#sortableSections').html(updatedTemplate);
      window.initSnapshot();
    },
  });
}