import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    orderItems: [],
    orderItemsSelected: [],
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

export const orderSlide = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrderProduct: (state, action) => {
            const { orderItems } = action.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product === orderItems.product)
            if (itemOrder) {
                itemOrder.amount += orderItems?.amount
            } else {
                state.orderItems.push(orderItems)
            }

        },
        increaseAmount: (state, action) => {
            const { idProduct } = action.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
            const itemOrderSelected = state?.orderItemsSelected?.find((item) => item?.product === idProduct)
            if (itemOrder && itemOrder.amount < 10) {
                itemOrder.amount++;
                if (itemOrderSelected) {
                    itemOrderSelected.amount++;
                }

            }
        },
        decreaseAmount: (state, action) => {
            const { idProduct } = action.payload;
            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct);
            const itemOrderSelected = state?.orderItemsSelected?.find((item) => item?.product === idProduct)
            if (itemOrder && itemOrder.amount > 1) {
                itemOrder.amount--;
                if (itemOrderSelected) {
                    itemOrderSelected.amount--;
                }

            }

        },
        deleleOrderProduct: (state, action) => {
            const { idProduct } = action.payload
            const itemOrder = state?.orderItems?.filter((item) => item?.product !== idProduct)
            const itemOrderSelected = state?.orderItemsSelected?.filter((item) => item?.product === idProduct)
            state.orderItems = itemOrder
            state.orderItemsSelected = itemOrderSelected;
        },
        deleleManyOrderProduct: (state, action) => {
            const { listChecked } = action.payload
            const itemOrders = state?.orderItems?.filter((item) => !listChecked.includes(item.product))
            const itemOrderSelected = state?.orderItemsSelected?.filter((item) => !listChecked.includes(item.product))
            state.orderItems = itemOrders
            state.itemOrderSelected = itemOrderSelected
        },
        selectedOrder: (state, action) => {
            const { listChecked } = action.payload;
            const orderSelected = [];
            state.orderItems.forEach((order) => {
                if (order?.product && listChecked.includes(order.product)) {
                    orderSelected.push(order);
                }
            });
            state.orderItemsSelected = orderSelected;
        },

    },
})

// Action creators are generated for each case reducer function
export const { addOrderProduct, increaseAmount, decreaseAmount, deleleOrderProduct, deleleManyOrderProduct, selectedOrder } = orderSlide.actions

export default orderSlide.reducer