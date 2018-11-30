var sortableElements = document.getElementsByClassName('sortable-list');
var sortables = {};
Object.values(sortableElements).forEach((el) => {
  sortables[el.id] = Sortable.create(el, {
    sort: true,
    group: el.id,
    handle: '.sortable-list-item-handle',
    ghostClass: 'dropping',
    dragClass: 'dragging',
    animation: 150,
    dataIdAttr: 'id',
    filter: '.fa-trash-alt',
    onFilter: (event) => {
      event.item.parentNode.removeChild(event.item);
    },
    onUpdate: (event) => {
      $('#sections').val(sortables[el.id].toArray().join(','))
      // console.log(sortables[el.id].toArray());
      // console.log('sort update', event.to);

    }
  });
})

console.log(sortables);