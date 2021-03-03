import React, { useCallback, useContext } from 'react';
import styled from '@emotion/styled';
import CartItem from './Cart/CartItem';
import _ from 'lodash';
import useGlobal from "./Cart/CartState";

const Title = styled.h2`
  margin: 1rem;
  width: -webkit-fill-available;
`;
const Wrapper = styled.div`
  text-align: left;
  width: 100%;
`;
const CartWrapper = styled.div`
  justify-content: left;
  padding: 1rem;
  @media (max-width: 600px) {
    display: block;
    padding: 1rem;
  }
`;
const CartSection = styled.div`
  display: flex;
  @media (max-width: 600px) {
    display: block;
  }
`;
const CartItems = styled.div`
  padding-top: 1rem;
  width: 100%;
`;
const CartItemWrapper = styled.div`
    border-top: 1px solid rgba(0,0,0,.125);
`;

const DisplaySavedProducts = () => {

    const [globalState, globalActions] = useGlobal();

    const [loaded, setLoaded] = React.useState(false)

    React.useEffect(() => {
        const allProducts = globalState.cfSavedProductsList['products'];
        if (!allProducts) {
          globalActions.getSavedProducts();
        }        
      }, [globalState.cfSavedProductsList['products'], globalState.authenticated]);
    
    return (
        <Wrapper>
            <CartWrapper>
                <CartSection>
                    <CartItems>
                        <h3>Saved Products</h3>
                        {!globalState.cfSavedProductsList['products'] &&
                            <div>Loading...</div>
                        }
                        {globalState.cfSavedProductsList['products'] && globalState.cfSavedProductsList['products'].length <= 0 &&
                            <CartItemWrapper>Your list is empty</CartItemWrapper>
                        }
                        {globalState.cfSavedProductsList['products'] && globalState.cfSavedProductsList['products'].length > 0 &&
                            globalState.cfSavedProductsList['products'].map((product, index) => {
                                return (
                                    <CartItemWrapper key={index}>
                                        <CartItem product={product} />
                                    </CartItemWrapper>
                                );
                            })
                        }
                    </CartItems>
                </CartSection>
            </CartWrapper>
        </Wrapper>
    );
}

export default DisplaySavedProducts;