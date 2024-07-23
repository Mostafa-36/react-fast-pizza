import { useDispatch } from 'react-redux'
import Button from '../../ui/Button'
import { decreaseItemQuantity, increaseItemQuantity } from './cartSlice'
function UpdataItemQuantity({pizzaId,currentQuantity}) {
    const dispatch=useDispatch()
    return (
        <div className='flex gap-1 items-center md:gap-3'>
            <Button type='round' onclick={()=>dispatch(decreaseItemQuantity(pizzaId))}>-</Button>
            <span className='text-sm font-medium'>{currentQuantity}</span>
            <Button type='round' onclick={()=>dispatch(increaseItemQuantity(pizzaId))}>+</Button>
        </div>
    )
}

export default UpdataItemQuantity
