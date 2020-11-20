import React from 'react';
import styled from '@emotion/styled';
import _ from 'lodash';
import { Highlight } from 'react-instantsearch-dom';
import theme from '../../config/theme';
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";

const Wrapper = styled.article`
  margin: 0.3rem;
  position: relative;
  z-index: 100;
  border-radius: ${props => props.theme.borderRadius.default};
  {/* box-shadow: ${props => props.theme.shadow.feature.small.default};*/}
  transition: ${props => props.theme.transitions.boom.transition};
  height: 12rem;

  &:hover {
    box-shadow: ${props => props.theme.shadow.feature.small.hover};
    transform: scale(1.04);
  }

  @media (max-width: 1000px) {
    height: 18rem;
  }

  @media (max-width: 700px) {
    flex-basis: 100%;
    max-width: 100%;
    width: 100%;
    height: 15rem;
  }
`;

const Image = styled.div`
  position: absolute;
  top: 0;
  overflow: hidden;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1;
  object-fit: cover;
  text-align: center;
  border-radius: ${props => props.theme.borderRadius.default};
  img {
    border-radius: ${props => props.theme.borderRadius.default};
  }
  > div {
    position: static !important;
  }
  > div > div {
    position: static !important;
  }
`;

const StyledLink = styled.a`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1rem;
  z-index: 3;
  border-radius: ${props => props.theme.borderRadius.default};
  &:after {
    content: '';
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 30%,
      rgba(0, 0, 0, 0.2) 60%,
      rgba(0, 0, 0, 0.3) 80%,
      rgba(0, 0, 0, 0.5) 100%
    );
    z-index: -10;
    border-radius: ${theme.borderRadius.default};
    transition: opacity ${theme.transitions.default.duration};
  }
`;

const Information = styled.div`
  color: ${props => props.theme.colors.white.light};
  margin: 0 1rem 1.25rem 1.25rem;
  position: absolute;
  bottom: 0;
  left: 0;
`;

const Vendor = styled.h5`
  margin: 0;
  margin-bottom: 0.6rem;
`;

const Title = styled.div`
  margin: 0;
  margin-bottom: 0.2rem;
  text-transform: capitalize;
  font-size: .8em;

`;
const SubTitle = styled.h5`
  margin: 0;
  margin-bottom: 0.6rem;
`;
const Price = styled.div`
  font-size: 0.8rem;
  margin: 0;

`;

const StyledDialog = styled(Dialog)`
@media (max-width: 700px) {
  width: 90vw;
}
.dialogTitle {
  @media (max-width: 700px) {
    font-size: 1.5rem;
  }
}

.dialogImageDescription {
  display : flex;
  img {
    max-height: 300px;
    max-width: 50%;
    margin-right: 3%;
  }
  span {
    padding-left: 2rem;
  }

  @media (max-width: 700px) {
    display : block;
    img {
      max-width : 100%;
    }
    span {
      padding-left: 0rem;
    }
  }
}
`;

const AlgoliaProductItem = (props) => {
  const [showDialog, setShowDialog] = React.useState(false);
  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

  //console.log("**** props", props)

  const convertToSelectList = (variants) => {
    if (variants == null) return;
    if (variants.toLowerCase() == "default title") return;
    const list = variants.split(",");
    return (
      <div>Options: <select>
        {list.map((item, index) => (
          <option key={index}>{item}</option>
        ))}
      </select>
      </div>
    )

  }

  return (
    <Wrapper>
      {props && props.hit &&
        <>
          <Image>
            <a href={`/shops/${props.hit.emprezzoID}/`} title={props.hit.name} target="_blank">
              {props.hit.imageURL &&
                <img src={props.hit.imageURL} style={{ objectFit: 'fill' }} />
              }
            </a>
          </Image>
          <StyledLink href="javascript:void(0)" onClick={() => openDialog()} title={props.hit.shopName}>
            <Information>
              <Title><Highlight attribute="name" hit={props.hit} /></Title>
              {props.hit.price &&
                <Price>${props.hit.price}</Price>
              }
            </Information>
          </StyledLink>
          <StyledDialog isOpen={showDialog} onDismiss={closeDialog}>
            <button className="close-button" onClick={closeDialog} style={{ float: "right", cursor: "pointer" }}>
              <span aria-hidden>X</span>
            </button>
            <div className="dialogImageDescription">
              {props.hit.imageURL &&
                <img src={props.hit.imageURL} />
              }
              <div>
                <h3>{props.hit.name}</h3>
                <p><i>Available at {props.hit.name || props.hit.shopName} from ${props.hit.price}</i></p>
                <p>{props.hit.description && props.hit.description.substring(0, 220)}</p>
                {convertToSelectList(props.hit.VariantTitle)}
              </div>
            </div>
            <br />
            <div>
              <a href={props.hit.productURL} target="_blank" class="button">Buy at {props.hit.shopName}</a>
              <a href={props.hit.emprezzoID ? `/shops/${props.hit.emprezzoID}/` : props.hit.VendorURL} class="button buttonalt">Get shop info</a>
            </div>
            <br />
          </StyledDialog>
        </>
      }
    </Wrapper>
  );
}

export default AlgoliaProductItem;
