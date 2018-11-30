let autocomplete;
let dataContainer = $('[data-products]');
let productInput = $('#productid');
if (dataContainer && productInput) {
  let products = JSON.parse(dataContainer.attr('data-products'));
  let source = [];
  Object.keys(products).forEach((key) => {
    let product = products[key];
    product.id = key;
    source.push(product)
  })
  console.log(source);
  productInput.selectize({
    minLength: 0,
    maxItems: 1,
    create: false,
    placeholder: 'Type to search and select a product...',
    valueField: 'id',
    labelField: 'title',
    searchField: ['id', 'title', 'description', 'currency', 'price'],
    options: source,
    onInitialize: (event) => {
      $('.selectize-input').addClass('form-control');
    },
    render: {
      item: (item, escape) => {
        return `<div class="d-inline-flex align-items-center">
          <div class="my-0 mr-2">${escape(item.title)}</div>
          <div class="bg-success text-light rounded small px-1">${escape(item.currency + item.price)}</div>
        </div>`;
      },
      option: (item, escape) => {
        return `<div class="row p-2">
          <div class="col-auto pr-0">
            <div style="background-image:url('${item.image}'" class="rounded border-light shadow-sm border bg-white h-100 selectize-product-image"></div>
          </div>
          <div class="col">
            <div class="d-flex align-items-center">
              <div class="my-0 mr-2">${escape(item.title)}</div>
              <div class="bg-success text-light rounded small px-1">${escape(item.currency + item.price)}</div>
            </div>` +
          (item.description ? `<p class="small mb-0 mt-2">${escape(item.description)}</p>` : '') +
          `</div>
        </div>`;
      }
    }
  })
}