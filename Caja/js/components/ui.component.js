export const uiService = {
  renderProducts(products, containerId, onProductClick) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'col';
      productCard.innerHTML = `
        <div class="card h-100 product-card">
          <div class="card-body">
            <div class="text-center mb-3">
              <img src="${product.image}" alt="${product.name}" class="img-fluid" style="height: 80px; object-fit: contain;">
            </div>
            <h6 class="card-title">${product.name}</h6>
            <p class="card-text small text-muted">${product.category}</p>
            <p class="card-text text-success fw-bold">$${product.price.toFixed(2)}</p>
          </div>
        </div>
      `;
      productCard.addEventListener('click', () => onProductClick(product));
      container.appendChild(productCard);
    });
  },

  renderCart(cart, containerId, emptyMessageId, onRemove, onUpdateQuantity) {
    const container = document.getElementById(containerId);
    const emptyMessage = document.getElementById(emptyMessageId);


    if (!container || !emptyMessage) {
      console.warn('Container or Empty Message element not found');
      return;
    }

    if (cart.length === 0) {
      emptyMessage.style.display = 'block';
    } else {
      emptyMessage.style.display = 'none';
      container.innerHTML = '';

      cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
          <div class="d-flex justify-content-between mb-1">
            <h6 class="mb-0">${item.name}</h6>
            <button class="btn btn-sm text-danger p-0" data-id="${item.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <span class="text-muted small">$${item.price.toFixed(2)} x ${item.quantity}</span>
            <div class="btn-group btn-group-sm" role="group">
              <button class="btn btn-outline-secondary" data-id="${item.id}" data-action="decrease">
                <i class="fas fa-minus"></i>
              </button>
              <span class="btn btn-outline-secondary disabled">${item.quantity}</span>
              <button class="btn btn-outline-secondary" data-id="${item.id}" data-action="increase">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
        `;
        container.appendChild(cartItem);
      });

      // Add event listeners
      container.querySelectorAll('[data-action="decrease"]').forEach(btn => {
        btn.addEventListener('click', () => {
          onUpdateQuantity(parseInt(btn.dataset.id), cart.find(i => i.id === parseInt(btn.dataset.id)).quantity - 1);
        });
      });

      container.querySelectorAll('[data-action="increase"]').forEach(btn => {
        btn.addEventListener('click', () => {
          onUpdateQuantity(parseInt(btn.dataset.id), cart.find(i => i.id === parseInt(btn.dataset.id)).quantity + 1);
        });
      });

      container.querySelectorAll('[data-id]').forEach(btn => {
        if (!btn.dataset.action) {
          btn.addEventListener('click', () => onRemove(parseInt(btn.dataset.id)));
        }
      });
    }
  },

  updateCartTotals({ subtotal, discountAmount, total }) {
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('discount').textContent = `-$${discountAmount.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    document.getElementById('modalTotal').textContent = `$${total.toFixed(2)}`;
  },

  renderCategories(categories, containerId, onCategorySelect) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    categories.forEach(category => {
      const button = document.createElement('button');
      button.className = 'btn btn-outline-secondary category-btn';
      button.dataset.category = category.name;
      button.textContent = category.name;
      button.addEventListener('click', () => onCategorySelect(category.name));
      container.appendChild(button);
    });
  },

  renderPaymentMethods(methods, containerId, iconMap) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    const transactionalMethods = methods.filter(method => method.category === 'transactional');

    transactionalMethods.forEach(method => {
      const col = document.createElement('div');
      col.className = 'col-4';

      const methodDiv = document.createElement('div');
      methodDiv.className = 'payment-method';
      methodDiv.dataset.methodId = method.id;

      const key = method.method.toLowerCase();
      const iconClass = Object.keys(iconMap).find(k => key.includes(k)) ?
        iconMap[Object.keys(iconMap).find(k => key.includes(k))] :
        'fas fa-question-circle';

      const icon = document.createElement('i');
      icon.className = iconClass;

      const span = document.createElement('span');
      span.className = 'small d-block mt-2';
      span.textContent = method.method;

      methodDiv.appendChild(icon);
      methodDiv.appendChild(span);
      col.appendChild(methodDiv);
      container.appendChild(col);

      methodDiv.addEventListener('click', () => {
        container.querySelectorAll('.payment-method').forEach(el => el.classList.remove('selected'));
        methodDiv.classList.add('selected');
      });
    });
  },

  renderPatients(patients, selectId) {
    const select = document.getElementById(selectId);
    select.innerHTML = '';

    patients.forEach(p => {
      const option = document.createElement('option');
      option.value = p.id;
      option.textContent = `${p.first_name} ${p.last_name} - ${p.document_number}`;
      select.appendChild(option);
    });

    $(`#${selectId}`).select2({
      width: '100%',
      placeholder: 'Seleccione un cliente'
    });
  }
};