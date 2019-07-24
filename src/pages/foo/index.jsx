import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import styles from './style.css';
import './store';

// 我们的单个styled component 定义
const StyledButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 140px;
  height: 40px;
  border-radius: 4px;
  font-size: 18px;
  color: #fff;
  background: linear-gradient(20deg, rgb(219, 112, 147), #daa357);
`;
console.log(process.env);
class Foo extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { foo } = this.props;
    const { id } = this.props.match.params;
    return (<div className={styles.text}>
      Foo: {id}-{foo.name}
      <StyledButton onClick={() => foo.changeName()}>changename</StyledButton>
    </div>);
  }
}

export default connect(state => ({
  foo: state.foo,
}))(Foo);