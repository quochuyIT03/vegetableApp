import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import InputComponent from '../InputComponent/InputComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';

const ButtonInputSearch = (props) => {
  const {
    size,
    placeholder,
    textButton,
    variant, // Thay bordered bằng variant
    backgroundColorInput = '#fff',
    backgroundColorButton = '#0f9654',
    colorButton = '#fff'
  } = props;
  return (
    <div style={{ display: 'flex' }}>
      <InputComponent
        size={size}
        variant={variant} // Thay bordered bằng variant
        placeholder={placeholder}
        style={{ backgroundColor: backgroundColorInput }}
        {...props} //mới sửa sau này phần search
      />
      <ButtonComponent
        size={size}
        styleButton={{
          background: backgroundColorButton,
          border: variant !== 'default' && 'none' // Sử dụng variant để điều chỉnh border
        }}
        icon={<SearchOutlined color={colorButton} style={{ color: '#fff' }} />}
        textButton={textButton}
        styleTextButton={{ color: colorButton }} />
    </div>
  );
};

export default ButtonInputSearch;
