import { InputNumber } from "antd";
import styled from "styled-components";

export const WrapperLeft = styled.div`
    width: 910px;
`

export const WrapperStyleHeader = styled.div`
    background: #fff;
    padding: 10px 20px;
    border-radius: 6px;
    display: flex;  
    align-items: center;
    margin-bottom: 20px;
    span {
        color: #242424; 
        font-weight: 500; 
        font-size: 15px;
    }
`

export const WrapperListOrder = styled.div`
    margin-top: 20px;
`
export const WrapperLable = styled.label`
    color: #000; 
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
    width: 50px;
    text-align: left;
`

export const WrapperItemOrder = styled.div`
    padding: 15px 20px;
    border-radius: 6px;
    display: flex;  
    align-items: center;
    background: #f7f7f7;
    margin-top: 15px;
    border: 1px solid #ddd;
`

export const WrapperCountOrder = styled.div`
    display: flex;  
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 6px;
    overflow: hidden;
`

export const WrapperInputNumber = styled(InputNumber)`
    &.ant-input-number.ant-input-number-sm {
        width: 50px;
        border: none;
        text-align: center;
        font-size: 16px;
        .ant-input-number-handler-wrap {
            display: none !important;
        }
    }
`

export const WrapperPriceDiscount = styled.span`
    color: red;
    font-size: 13px; 
    margin-left: 5px;
    text-decoration: line-through;
`

export const WrapperRight = styled.div`
    width: 300px; 
    margin-left: 30px;
    display: flex;  
    flex-direction: column; 
    gap: 15px;
    align-items: center;
`

export const WrapperInfo = styled.div`
    width: 100%;
    padding: 20px;
    background: #f9f9f9;
    margin-bottom: 15px;
    border-radius: 6px;
    border: 1px solid #ddd;
`

export const WrapperInfoPayment = styled.div`
    width: 100%;
    padding: 20px;
    background: #cfefe5;
    border-radius: 6px;
    height: 220px;
    margin-bottom: 40px; 
    border: 1px solid #ddd;
`

export const WrapperInfoPaymentMethod = styled.div`
    width: 100%;
    padding: 20px;
    background: #cfefd4;
    border-radius: 6px;
    height: 200px;
    margin-bottom: 40px; 
    border: 1px solid #ddd;
`

export const HeaderContent = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .product-title {
        color: #3f51b5;
        font-weight: bold;
    }
`

export const WrapperTotal = styled.div`
    display: flex;  
    padding: 20px;
    justify-content: space-between;
    align-items: flex-start;
    border-radius: 6px;
    background: #f9f9f9;
    width: 100%;
    border: 1px solid #ddd;
`
export const WrapperItemOrderLabel = styled.div`
    text-align: right;
    color: #28b3ad;
    font-weight: bold;
    font-size: 18px;
`

export const WrapperProduct = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding: 20px;
    background: #fff;
    border-radius: 6px;
    border: 1px solid #ddd;
    
`

export const WrapperProductDetails = styled.div`
    display: flex;
    
    align-items: center;
`
export const ProductImage = styled.img`
    width: 70px;
    height: 70px;
    object-fit: cover;
    border: 1px solid #ddd;
    padding: 5px;
    border-radius: 4px;
`
export const WrapperItem = styled.div`
    color: #000; 
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
    width: 55px;
    text-align: left;
    
`

export const ProductTitle = styled.div`
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
`