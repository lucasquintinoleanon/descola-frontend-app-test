const convertForGTM = (products, list, position) =>
  products.map((product, index) => ({
    'name': product.title,
    'id': product.id,
    'price': product?.prices?.sale_price || product?.prices?.salePrice || product?.prices?.price,
    'brand': 'Descola',
    'list': list,
    'position': position + index
  }));

export default convertForGTM;
