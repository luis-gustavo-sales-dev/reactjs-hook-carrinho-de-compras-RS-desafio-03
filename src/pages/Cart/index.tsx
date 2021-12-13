import React, { useEffect, useState } from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}


const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();
  const [total, setTotal] = useState('');

  useEffect( () => {
    const tot = cart.reduce( (total, product) => {
      total += product.amount * product.price
      return total
    }, 0)
    
    setTotal(formatPrice(tot))
  }, [cart])


  let cartFormated = cart.map ( ({ id, title, price, image, amount}) => {
    return {
      id,
      title,
      price,
      image,
      amount,
      priceFormated: formatPrice(price)
    }
  })

  function handleProductIncrement(product: Product) {
    // TODO
    // console.log("handleProductIncrement")
    // console.log("product.amount", product.amount)
    let amount = product.amount + 1 
    // console.log("product.amount", amount)
    updateProductAmount({
      productId: product.id,
      amount: amount
    })
  }

  function handleProductDecrement(product: Product) {
    // TODO
    // console.log("handleProductDecrement")
    if(product.amount >= 1){
      product.amount -= 1 
    }
    updateProductAmount({
      productId: product.id,
      amount: product.amount
    })
  }

  function handleRemoveProduct(productId: number) {
    // TODO
    removeProduct(productId)
  }

  function calculateProductSubtotal(productId: number) {
    //console.log(cart)
    let subtotal = 0;
    const findProduct = cart.findIndex( product => product.id === productId)
    if (findProduct > -1){
      subtotal = cart[findProduct].amount * cart[findProduct].price
    }
    return formatPrice(subtotal)
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          { cartFormated.map ( (product, index) => {
            return (<tr data-testid="product" key={product.id}>
                <td>
                  <img src="https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg" alt="Tênis de Caminhada Leve Confortável" />
                </td>
                <td>
                  <strong>{product.title}</strong>
                  <span>{product.priceFormated}</span>
                </td>
                <td>
                  <div>
                    <button
                      type="button"
                      data-testid="decrement-product"
                      disabled={product.amount <= 1}
                      onClick={() => handleProductDecrement(cart[index])}
                    >
                      <MdRemoveCircleOutline size={20} />
                    </button>
                    <input
                      type="text"
                      data-testid="product-amount"
                      readOnly
                      value={product.amount}
                    />
                    <button
                      type="button"
                      data-testid="increment-product"
                      onClick={() => handleProductIncrement(cart[index])}
                    >
                      <MdAddCircleOutline size={20} />
                    </button>
                  </div>
                </td>
                <td>
                  <strong>{calculateProductSubtotal(product.id)}</strong>
                </td>
                <td>
                  <button
                    type="button"
                    data-testid="remove-product"
                    onClick={() => handleRemoveProduct(product.id)}
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>)
              }
            )}
 
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
