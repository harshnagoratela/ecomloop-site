import React from 'react';
import Helmet from 'react-helmet';
import { Header } from 'components';
import { Layout, Container } from 'layouts';
import useGlobal from "../components/Cart/CartState";
import fetch from 'node-fetch';
import styled from 'styled-components';

const Grid = styled.div`
`;
const Row = styled.div`
  display: flex;
`;
const Col = styled.div`
  flex: ${(props) => props.size};
`;

const ShopifyTest = () => {

  const [globalState, globalActions] = useGlobal();
  
  const [createEmail, setCreateEmail] = React.useState("");
  const [createPassword, setCreatePassword] = React.useState("");
  const [createMessage, setCreateMessage] = React.useState("");
  const [findEmail, setFindEmail] = React.useState("");
  const [findPassword, setFindPassword] = React.useState("");
  const [findMessage, setFindMessage] = React.useState("");

  const shopUrl = "https://emprezzo.myshopify.com";
  const accessToken = "0c291ce7693710e4baf0db2cf74576ca";

  const createCustomerQuery = `mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }`;
  const createCustomer = () => {
    const params = {
      query: createCustomerQuery,
      variables: {
        input: {
          "email": createEmail,
          "password": createPassword
        }
      }
    }
    const optionsQuery = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Shopify-Storefront-Access-Token": accessToken
      },
      body: JSON.stringify(params)
    };

    fetch(shopUrl + `/api/graphql`, optionsQuery)
      .then(res => res.json())
      .then(response => {
        console.log("=============== Response from Create Customer Call ===============");
        console.log(JSON.stringify(response, null, 4))
        if(response.data && response.data.customerCreate){
          response.data.customerCreate.customer ? setCreateMessage("Created successfully.....") : setCreateMessage(response.data.customerCreate.customerUserErrors[0].message);
        }
        else setCreateMessage("API calls Limit exceeded.")
      });
  }

  //createCustomer();

  //   {
  //     "data": {
  //         "customerCreate": {
  //             "customer": null,
  //             "customerUserErrors": [
  //                 {
  //                     "code": "TAKEN",
  //                     "field": [
  //                         "input",
  //                         "email"
  //                     ],
  //                     "message": "Email has already been taken"
  //                 }
  //             ]
  //         }
  //     }
  // }

  const findCustomerQuery = `mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
  customerAccessTokenCreate(input: $input) {
    customerAccessToken {
      accessToken
      expiresAt
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}`;
  const findCustomer = () => {
    const params = {
      query: findCustomerQuery,
      variables: {
        input: {
          "email": findEmail,
          "password": findPassword
        }
      }
    }
    const optionsQuery = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Shopify-Storefront-Access-Token": accessToken
      },
      body: JSON.stringify(params)
    };
    
    fetch(shopUrl + `/api/graphql`, optionsQuery)
      .then(res => res.json())
      .then(response => {
        console.log("=============== Response from Find Customer Call ===============");
        console.log(JSON.stringify(response, null, 4))
        if(response.data){
          response.data.customerAccessTokenCreate.customerAccessToken ? setFindMessage("Customer found.....") : setFindMessage("Customer NOT found.....");
        }
      });
  }
  
  return (
    <Layout>
      <Helmet title={'Shopify Test'} />
      <Header title="Shopify Test Page"></Header>
      <Container>
        <Grid>
          <Row>
            <Col size={2}>
              <Row><Col><h2>Create Customer</h2></Col></Row>              
              <Row>
                <Col>Email:<br/><input type="text" value={createEmail} onChange={e => setCreateEmail(e.target.value)}/></Col>
              </Row>              
              <Row>
                <Col>Password:<br/><input type="password" value={createPassword} onChange={e => setCreatePassword(e.target.value)}/></Col>
              </Row>
              <Row>
                <Col><input className="button" type="button" value="REGISTER" onClick={createCustomer}/></Col>
              </Row>  
              <Row>
                <Col>{createMessage}</Col>
              </Row>             
            </Col>
            <Col size={2}>
              <Row><Col><h2>Login Customer</h2></Col></Row>              
              <Row>
                <Col>Email:<br/><input type="text" value={findEmail} onChange={e => setFindEmail(e.target.value)}/></Col>
              </Row>              
              <Row>
                <Col>Password:<br/><input type="password" value={findPassword} onChange={e => setFindPassword(e.target.value)}/></Col>
              </Row>
              <Row>
                <Col><input className="button" type="button" value="LOGIN" onClick={findCustomer}/></Col>
              </Row>             
              <Row>
                <Col>{findMessage}</Col>
              </Row>              
            </Col>
          </Row>
        </Grid>
      </Container>
    </Layout>
  )
};

export default ShopifyTest;