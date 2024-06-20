import { useEffect, useState } from "react";
import { useShoppingCart } from "../../../context/ShoppingCartContext";
import useCurrencyFormatter from "../../../hooks/useCurrencyFormatter";
import { Product } from '../../../models/Product';

type CartItemProps = {
    product: Product;
    quantity: number;
    updateDiscount?: (discount: number) => void;
    readonly?: boolean;
}

function CartItem(item: CartItemProps) {

    const [itemData, setItemData] = useState<Product>({} as Product);
    const [quantity, setQuantity] = useState<number>(1);

    const { increaseItemQuantity, decreaseItemQuantity, removeItemFromCart, coupon } = useShoppingCart();

    useEffect(() => {
        setItemData(item.product);
        setQuantity(item.quantity);
    }, [item]);

    const handleDescreaseQuantity = (id: number) => {
        decreaseItemQuantity(itemData.id);
    }

    const handleIncreaseQuantity = (id: number) => {
        increaseItemQuantity(itemData.id);
    }

    const currencyFormat = useCurrencyFormatter();

    const effectivePrice = itemData.salePrice && itemData.salePrice < itemData.price
        ? itemData.salePrice
        : itemData.price;

    return (
        <tr>
            <th scope="row">
                <div className="d-flex align-items-center">
                    <img src={itemData.image} className="img-fluid me-5 rounded-circle" style={{ width: '80px', height: '80px' }} alt={itemData.name} />
                </div>
            </th>
            <td>
                <div className="mb-0 mt-4">{itemData.name}</div>
            </td>
            <td style={{ width: item.readonly ? "100px" : "auto" }}>
                <div className="mb-0 mt-4">
                    {itemData.salePrice && itemData.salePrice < itemData.price ? (
                        <>
                            <span className="text-danger">{currencyFormat(itemData.salePrice)}</span>
                            <span className="text-muted text-decoration-line-through ms-2">{currencyFormat(itemData.price)}</span>
                        </>
                    ) : (
                        currencyFormat(itemData.price)
                    )}
                </div>
            </td>
            <td>
                {!item.readonly && (
                    <div className="input-group quantity mt-4" style={{ width: '100px' }}>
                        <button className="btn btn-sm btn-minus rounded-circle bg-light border" onClick={() => handleDescreaseQuantity(itemData.id)}>
                            <i className="fa fa-minus"></i>
                        </button>
                        <input type="text" className="form-control form-control-sm text-center border-0" value={quantity} readOnly />
                        <button className="btn btn-sm btn-plus rounded-circle bg-light border" onClick={() => handleIncreaseQuantity(itemData.id)}>
                            <i className="fa fa-plus"></i>
                        </button>
                    </div>
                )}
                {item.readonly && (
                    <div className="mb-0 mt-4">{quantity}</div>
                )}
            </td>
            <td>
                <div className="mb-0 mt-4">{currencyFormat(effectivePrice * quantity)}</div>
            </td>
            <td>
                {!item.readonly && (
                    <button className="btn btn-md rounded-circle bg-light border mt-3" onClick={() => removeItemFromCart(itemData.id)}>
                        <i className="fa fa-times text-danger"></i>
                    </button>
                )}
            </td>
        </tr>
    );
}

export default CartItem;
