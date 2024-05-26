import { Button } from 'antd'
import React from 'react'

const ButtonComponent = ({ size, textButton, styleButton, styleTextButton, disabled, ...rests }) => {
  return (
    <Button
      style={{
        ...styleButton,
        background: disabled ? '#ccc' : styleButton.background
      }}
      size={size}
      {...rests}
    >
      <span style={styleTextButton}>{textButton}</span>
    </Button>
  )
}

export default ButtonComponent

// import { Button } from 'antd';
// import React from 'react';

// const ButtonComponent = ({ size, textButton, styleButton, styleTextButton, disabled, ...rests }) => {
//   return (
//     <Button
//       style={{
//         ...styleButton,
//         background: disabled ? '#ccc' : (styleButton && styleButton.background ? styleButton.background : null)
//       }}
//       size={size}
//       {...rests}
//     >
//       <span style={styleTextButton}>{textButton}</span>
//     </Button>
//   );
// };

// export default ButtonComponent;

