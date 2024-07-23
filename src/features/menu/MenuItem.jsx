import { useDispatch, useSelector } from "react-redux";
import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";
import { addItem, getCart, getCurrentQuantityById } from "../cart/cartSlice";
import DeleteItem from "../cart/DeleteItem";
import UpdataItemQuantity from '../cart/UpdataItemQuantity'

function MenuItem({ pizza }) {
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  const dispatch=useDispatch(getCart)
  const currentQuantity=useSelector(getCurrentQuantityById(id))
  const isInCart=currentQuantity>0;

  function handleAddToCart(){
    const newItem={pizzaId:id,
      name,
      unitPrice,
      quantity:1,
      totalPrice:unitPrice}
    dispatch(addItem(newItem))
  }

  return (
    <li className="flex gap-4 py-2">
      <img src={imageUrl} alt={name} className={`h-24 ${soldOut?"grayscale opacity-70":""}`} />
      <div className="flex flex-col grow">
        <p className="font-medium">{name}</p>
        <p className="text-sm italic text-stone-500 capitalize">{ingredients.join(", ")}</p>
        <div className="mt-auto flex items-center justify-between">
          {!soldOut ? <p className=" text-sm uppercase text-stone-500">{formatCurrency(unitPrice)}</p> : <p>Sold out</p>}
          {isInCart && <div className="flex items-center gap-3 sm:gap-8">
            <UpdataItemQuantity pizzaId={id} currentQuantity={currentQuantity} />
            <DeleteItem pizzaId={id}/>
            </div>}
          {!soldOut && !isInCart && <Button type="small" onclick={handleAddToCart}>Add to cart</Button>}
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
