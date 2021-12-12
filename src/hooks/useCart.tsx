import { createContext, ReactNode, useContext, useState } from 'react';
import { MdAppRegistration } from 'react-icons/md';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}



interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
       return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {

      // Procure pelo produto no carrinho
      const findProduct = cart.findIndex( product => product.id === productId)

      console.log("findProduct: ", findProduct)
      // Se produto já existe no carrinho
      if (findProduct > -1) {

        // verifique se o produto tem estoque
        const stock: Stock = await api.get(`/stock/${productId}`)
          .then( (response) => {
            return response.data
        })
        console.log("stock.amount", stock.amount)
        console.log("cart[findProduct].amount", cart[findProduct].amount)
        if (stock.amount > cart[findProduct].amount) {
          // Se tem estoque adicione 1 ao amount do produto localizado
          // Adicione o novo array ao setCart
          cart[findProduct].amount += 1;
          setCart([...cart])
          localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))
        } else {
          // Se não tem no estoque retorne um erro
          toast.error('Quantidade solicitada fora de estoque')
        }
      } else {
        console.log("Não tem esse produto no carrinho!")
        // Se não existir:
        // Verifique se tem produto no estoque
        const stock: Stock = await api.get(`/stock/${productId}`)
          .then( (response) => {
            return response.data
        })

        
        console.log("Stock do produto: ", stock)
        
        // pegue o novo produto via api.get e coloque o amount dele como 1
        const product: Product = await api.get(`/products/${productId}`)
          .then( response => response.data )
        
        console.log("Produto adquirido: ", product)
        // Se tem produto no estoque
        if (stock.amount > 0) {
          console.log("Tem estoque!")
          product.amount = 1
          console.log("Produto adquirido: ", product)
          cart.push(product)
          
          setCart([...cart])
          localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))
        } else {
          toast.error('Erro na adição do produto')
        }
        
      }

    } catch(error: any) {
      toast.error('Erro na adição do produto')
      // TODO
      console.log('Erro na adição do produto')
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // Procurar produto para apagar
      const findProduct = cart.findIndex( product => product.id === productId)
      
      // Produto encontrado
      if (findProduct > -1) {
        console.log(cart)
        let newCart = cart.filter( (product) => {
          if (product.id !== productId) return product
        })
        console.log(newCart)
        setCart([...newCart])
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))
      } else {
        toast.error("Erro na remoção do produto")
      }
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // Procure pelo produto no carrinho
      const findProduct = cart.findIndex( product => product.id === productId)

      console.log("findProduct: ", findProduct)
      // Se produto já existe no carrinho
      if (findProduct > -1) {

        // verifique se o produto tem estoque
        const stock: Stock = await api.get(`/stock/${productId}`)
          .then( (response) => {
            return response.data
        })
        console.log("stock.amount", stock.amount)
        console.log("cart[findProduct].amount", cart[findProduct].amount)
        if (stock.amount > cart[findProduct].amount) {
          // Se tem estoque adicione 1 ao amount do produto localizado
          // Adicione o novo array ao setCart
          cart[findProduct].amount += 1;
          setCart([...cart])
          localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))
        } else {
          // Se não tem no estoque retorne um erro
          toast.error('Quantidade solicitada fora de estoque')
        }
      } else {
        toast.error('Erro na alteração de quantidade do produto')
      }
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
