
import { InputNumber } from "antd";
import styled from "styled-components";

export const WrapperLeft = styled.div`
    width: 910px;
    
`
export const WrapperStyleHeader = styled.div`
    background: rgb(255, 255, 255);
    padding: 9px 16px;
    border-radius: 6px;
    display: flex;  
    align-items: center;
    span{
        color: rgb(36, 36, 36); 
        font-weight: 500; 
        font-size: 15px;
    }

`
export const WrapperListOrder = styled.div`

`
export const WrapperItemOrder = styled.div`
    padding: 9px 16px;
    border-radius: 6px;
    display: flex;  
    align-items: center;
    background: #e7e7e6;
    margin-top: 12px;
`
export const WrapperCountOrder = styled.div`
    display: flex;  
    align-items: center;
    border: 1px solid black;
    border-radius: 6px;

`
export const WrapperInputNumber = styled(InputNumber)`
    &.ant-input-number.ant-input-number-sm{
        width: 40px;
        border-top: none;
        border-bottom: none;
        font-size: 20px;
        .ant-input-number-handler-wrap {
            display: none !important;
        }
    }
`

export const WrapperPriceDiscount = styled.span`
    color: red;
    font-size: 13px; 
    margin-left: 3px;
    text-decoration: line-through;
    

`
export const WrapperRight = styled.div`
    width: 300px; 
    margin-left: 30px;
    display: flex;  
    flex-direction: column; 
    gap: 10px;
    align-items: center;
`
export const WrapperInfo = styled.div`
    width: 100%;
    padding: 17px 20px;
    background: #ededed;
    border-bottom: 2px solid #d10808;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;

`
export const WrapperTotal = styled.div`
    display: flex;  
    padding: 17px 20px;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    background: #ededed;
    width: 100%;
`