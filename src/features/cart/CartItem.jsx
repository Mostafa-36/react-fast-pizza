import { useSelector } from "react-redux";
import { formatCurrency } from "../../utils/helpers";
import DeleteItem from "./DeleteItem";
import UpdataItemQuantity from './UpdataItemQuantity'
import { getCurrentQuantityById } from "./cartSlice";
function CartItem({ item }) {
  const { pizzaId, name, quantity, totalPrice } = item;
  const currentQuantity=useSelector(getCurrentQuantityById(pizzaId))
  return (
    <li className="py-3 sm:flex sm:justify-between sm:items-center">
      <p className="mb-1 sm:mb-0">
        {quantity}&times; {name}
      </p>
      <div className="flex items-center sm:gap-6">
        <p className="text-sm font-bold">{formatCurrency(totalPrice)}</p>
        <UpdataItemQuantity pizzaId={pizzaId} currentQuantity={currentQuantity} />
        <DeleteItem pizzaId={pizzaId} />
      </div>
    </li>
  );
}

export default CartItem;
