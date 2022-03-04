import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const PlusButton = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={50}
    height={50}
    style={{
      fill: '#000',
    }}
    {...props}>
    <Path d="M25 2C12.31 2 2 12.31 2 25s10.31 23 23 23 23-10.31 23-23S37.69 2 25 2zm0 2c11.61 0 21 9.39 21 21s-9.39 21-21 21S4 36.61 4 25 13.39 4 25 4zm-1 9v11H13v2h11v11h2V26h11v-2H26V13h-2z" />
  </Svg>
);

export default PlusButton;
