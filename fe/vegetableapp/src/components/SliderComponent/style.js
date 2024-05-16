import Slider from "react-slick";
import styled from "styled-components";

export const WrapperSliderStyle = styled(Slider)`
    & .slick-prev {
        left: 12px; 
        top: 50%;
        z-index: 10;
        &::before {
            font-size: 50px; 
            color: #195f07;
        }
    }
    & .slick-next {
        right: 40px;
        top: 50%;
        z-index: 10; 
        &::before {
            font-size: 50px;
            color: #195f07;
        }
    }
    & .slick-dots {
        z-index: 10;
        bottom: -2px !important;
        li {
            button {
                &::before {
                    color: rgb(255, 255, 0.5);
                    font-size: 20px;
                }
            }
        }
        li.active {
            button {
                &::before {
                    color: #fff;
                }
            }
        }
    }
`