import React from 'react'
import { WarpperContent, WarpperLableText, WarpperTextPrice, WarpperTextValue } from './style'
import { Checkbox, Rate } from 'antd'

const NavbarComponent = () => {
    const onChange = () => { }
    const renderContent = (type, options) => {
        switch(type){
            case 'text':
                return options.map((option) => {
                    
                        return (<WarpperTextValue>{option}</WarpperTextValue>)
                    
                })
            case 'checkbox':
                return (
                    <Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection:'column', gap: '12px' }} onChange={onChange}>
                        {options.map((option) => {
                            return(
                                <Checkbox style={{marginLeft: 0}} value={option.value}>{option.lable}</Checkbox>
                            )
                        })}
                  
                    </Checkbox.Group>
                )
                case 'star':
                    return options.map((option) => {
                        console.log('check', option)
                        return (
                            
                            <div style={{display: 'flex', gap:'12px'}}>
                                <Rate style ={{fontSize:'12px'}} disabled defaultValue={option}/>
                                <span style ={{fontSize:'12px'}}>{`Từ ${option} sao`} </span>
                            </div>
                        )
                    })
                case 'price':
                    return options.map((option) => {
                        console.log('check', option)
                        return (
                            <WarpperTextPrice>{option}</WarpperTextPrice>
                        )
                    })

                            

             
            default: 
                return {}
        }
    }
  return (
    <div>
        <WarpperLableText>Lable</WarpperLableText>
        <WarpperContent>
        {renderContent('text', ['Rau day', 'rau thom', 'rau ngo'])}
        
        </WarpperContent>
        <WarpperContent>
        {renderContent('checkbox', [
            {value: 'a', lable: 'A'}, 
            {value: 'b', lable: 'b'}, 
            {value: 'c', lable: 'c'}
        ])}
        </WarpperContent>

        <WarpperContent>
        {renderContent('star', [3,4,5])}
        </WarpperContent>

        <WarpperContent>
        {renderContent('price', ['Dưới 40.000','Trên 50.000'])}
        </WarpperContent>

    </div>
  )
}

export default NavbarComponent
