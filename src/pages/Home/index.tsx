import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    //console.log('product.amount: ', product.amount)
    sumAmount[product.id] = product.amount
    //console.log(sumAmount)
    return sumAmount
  }, {} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
      // TODO
      let prod: ProductFormatted[] = await api.get(`/products`)
        .then( response => response.data)
      
      let p = prod.map ( ({ id, title, price, image}) => {
          return {
            id,
            title,
            price,
            image,
            priceFormatted: formatPrice(price)
          }
        })
      
      setProducts(p)
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    // TODO
    addProduct(id)
  }

  return (
    <ProductList>
      {
        products.map( (product) => {
          return (
            <li key={product.id}>
              <img src={product.image} alt={product.image} />
              <strong>{product.title}</strong>
              <span>{product.priceFormatted}</span>
              <button
                type="button"
                data-testid="add-product-button"
                onClick={() => handleAddProduct(product.id)}
              >
                <div data-testid="cart-product-quantity">
                  <MdAddShoppingCart size={16} color="#FFF" />
                  { cartItemsAmount[product.id] || 0 }
                  
                </div>

                <span>ADICIONAR AO CARRINHO</span>
              </button>
            </li>
          )
        }
        )
      }
      
    </ProductList>
  );
};

export default Home;
