import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
    display: flex; 
    align-items: center; 
    gap: 24px; 
    justify-content: flex-start; 
    height: 44px;
    & > * {
        text-decoration: none;
        font-weight: 500;
        position: relative;
        outline: none !important;
        text-transform: uppercase;
        transition: color 0.2s;
        margin: 12px 0;

        &:hover,
        &:focus {
            color: #195f07;
        }

        &:after {
            content: "";
            background-color: black;
            position: absolute;
            bottom: 0;
            left: 0;
            height: 2px;
            width: 0;
            transition: width 0.2s;
        }

        &:hover::after,
        &:focus::after {
            background-color: #195f07;
            width: 100%;
        }
    }
`

export const WrapperButtonMore = styled(ButtonComponent)`
    &:hover {
        color: #fff; 
        background: #195f07;

        span{
            color: #fff;
        }
    }
    width: 100%; 
    text-align: center;
    cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointers'}
`

export const WrapperProduct = styled.div`
    display: flex; 
    gap: 15px; 
    justify-content: center; 
    margin-top: 20px; 
    flex-wrap: wrap
`
