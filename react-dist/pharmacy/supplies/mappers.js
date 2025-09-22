export class SuppliesDeliveriesTableMapper {
  static mapToTableItems(items) {
    return items.map(item => {
      return {
        id: item.id,
        type: 'Administrativo',
        observations: item.observations || '--',
        status: {
          label: item.status,
          severity: item.status === 'pending' ? 'warning' : 'success'
        },
        products: item.products.map(product => ({
          id: product.id,
          name: product.product.name,
          quantity: product.quantity
        })),
        original: item
      };
    });
  }
}