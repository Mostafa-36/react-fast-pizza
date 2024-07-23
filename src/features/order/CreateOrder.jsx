import { useState } from "react";
import { createOrder } from "../../services/apiRestaurant";
import {
  Form,
  redirect,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from '../cart/EmptyCart';
import store from '../../store';
import {formatCurrency} from '../../utils/helpers'
import { fetchAddress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

// const fakeCart = [
//   {
//     pizzaId: 12,
//     name: "Mediterranean",
//     quantity: 2,
//     unitPrice: 16,
//     totalPrice: 32,
//   },
//   {
//     pizzaId: 6,
//     name: "Vegetale",
//     quantity: 1,
//     unitPrice: 13,
//     totalPrice: 13,
//   },
//   {
//     pizzaId: 11,
//     name: "Spinach and Mushroom",
//     quantity: 1,
//     unitPrice: 15,
//     totalPrice: 15,
//   },
// ];

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const formErrors = useActionData();
  const dispatch = useDispatch()


  const {username, status: addressStatus, position, address, error: errorAddress}=useSelector(store=>store.user);
  const isLoadingAddress = addressStatus==='loading'

  const totalCartPrice=useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice=totalCartPrice + priorityPrice;

  const cart=useSelector(getCart)
console.log(cart)


  if(!cart.length) return <EmptyCart/>

  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-semibold mb-8">Ready to order? Let's go!</h2>

      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input className="input grow" defaultValue={username} type="text" name="customer" required />
        </div>

        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
          {formErrors?.phone && <p className="text-xs mt-2 text-red-700 bg-red-100 p-2 rounded-md">{formErrors.phone}</p>}
          </div>
        </div>

        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center relative">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input disabled={isLoadingAddress} defaultValue={address} className="input w-full" type="text" name="address" required />
            {addressStatus === 'error' && <p className="text-xs mt-2 text-red-700 bg-red-100 p-2 rounded-md">{errorAddress}</p>}
          </div>
          {!position.latitude && !position.longitude &&<span className="absolute right-[3px] top-[3px] sm:top-[5px] z-50 sm:right-[5px]">
          <Button type="small" disabled={isLoadingAddress} onclick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
              >
                Get position
              </Button>
          </span>}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring
          focus:ring-yellow-400 focus:ring-offset-2"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label className="font-medium" htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input type="hidden" name="position" value={position.latitude && position.longitude ? 
            `${position.latitude},${position.longitude}`:''} />
          <Button disabled={isSubmitting || isLoadingAddress} type="primary" >
            {isSubmitting ? "Placing order..." : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}
export async function action({ request }) {
  // const order = await createOrder();
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log(data)
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };
  // console.log(order);
  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      "Please give us your correct phone number. we might need it to contact you";
  if (Object.keys(errors).length > 0) return errors;

  //If everything is okay. create new order and redirect
  const newOrder = await createOrder(order);
  // console.log(newOrder);
  
  store.dispatch(clearCart())
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
