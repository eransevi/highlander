import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  width: 100%;
  background-color: #f8f9fa;
  padding: 20px 0;
  text-align: center;
  box-shadow: 0 4px 2px -2px gray;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: bold;
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Title>HighLander Game</Title>
    </HeaderContainer>
  );
};

export default Header;
