import React, {useEffect, useState} from 'react';
import {MdAddShoppingCart} from 'react-icons/md';

import {ProductList} from './styles';
import {useCart} from '../../hooks/useCart';
import {formatPrice} from "../../util/format";
import {api} from "../../services/api";

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
    const {addProduct, cart} = useCart();

    const cartItemsAmount = cart.reduce((sumAmount, product) => {
        const newSumAmount = {...sumAmount}
        newSumAmount[product.id] = product.amount
        return newSumAmount;
    }, {} as CartItemsAmount)

    useEffect(() => {
        async function loadProducts() {
            const response = await api.get('/products').then(({data}) => data)
            return response.map((value: Product) => ({
                ...value,
                priceFormatted: formatPrice(value.price)
            }))
        }

        loadProducts().then((value) => setProducts(value));
    }, []);

    async function handleAddProduct(id: number) {
        await addProduct(id)
    }

    return (
        <ProductList>
            {products.map(({id, image, priceFormatted, title}) => (
                <li key={id}>
                    <img src={image} alt={title}/>
                    <span>{priceFormatted}</span>
                    <button
                        type="button"
                        data-testid="add-product-button"
                        onClick={() => handleAddProduct(id)}
                    >
                        <div data-testid="cart-product-quantity">
                            <MdAddShoppingCart size={16} color="#FFF"/>
                            {cartItemsAmount[id] || 0}
                        </div>

                        <span>ADICIONAR AO CARRINHO</span>
                    </button>
                </li>
            ))}
        </ProductList>
    );
};

export default Home;
