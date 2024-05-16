import { createSlice  } from '@reduxjs/toolkit'

const initialState = {
    orderItems: [
       
    ],
        shippingAddress: {
            
        },
        paymentMethod: '', 
        itemsPrice: 0, 
        shippingPrice: 0, 
        taxPrice: 0, 
        totalPrice: 0, 
        discountPrice: 0,
        user: '',  
        isPaid: false, 
        paidAt: '', 
        isDelivered: false, 
        deliveredAt: '', 
    }
   
export const orderSlide = createSlice ({
  name: 'order',
  initialState,
  reducers: {
        addOrderProduct: (state, action) => {
            
            console.log({state, action})
            const {orderItems} = action.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product === orderItems.product)
            if(itemOrder){
                itemOrder.amount += orderItems?.amount
            }else{
                state.orderItems.push(orderItems)
            }
           
        },
        increaseAmount: (state, action) => {
            const {idProduct} = action.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
            if (itemOrder && itemOrder.amount < 10) {
                itemOrder.amount++;
              }
        },
        decreaseAmount: (state, action) => {
            const { idProduct } = action.payload;
            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct);
            if (itemOrder && itemOrder.amount > 1) {
              itemOrder.amount--;
            }
          },
        deleleOrderProduct: (state, action) => {
            const {idProduct} = action.payload
            const itemOrder = state?.orderItems?.filter((item) => item?.product !== idProduct)
            state.orderItems = itemOrder
        },
        deleleManyOrderProduct: (state, action) => {
            const {checkList} = action.payload
            const itemOrders = state?.orderItems?.filter((item) => !checkList.includes(item.product))
            state.orderItems = itemOrders
        },
  },
})

// Action creators are generated for each case reducer function
export const { addOrderProduct, increaseAmount, decreaseAmount, deleleOrderProduct, deleleManyOrderProduct } = orderSlide.actions

export default orderSlide.reducer