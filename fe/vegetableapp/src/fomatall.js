export const fomatall = (number) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency", 
        currency: "VND", 

    }).format(number);
};