import React from 'react';
import Helmet from 'react-helmet';
import algoliasearch from 'algoliasearch';

const Temp = ({ data }) => {

  const algoliaClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_KEY
  );
  const algoliaIndex = algoliaClient.initIndex('uncommonry')

  const updatePayload = [];
  const { edges } = data.allMysqlMainView;
  edges.map(({ node }) => {
    updatePayload.push({
      amazonPay: node.amazonPay,
      applePay: node.applePay,
      shopifyPay: node.shopifyPay,
      objectID: node.id
    })
  })
  console.log(updatePayload);
  // algoliaIndex.partialUpdateObjects(updatePayload, { createIfNotExists: false }).then((response) => {
  //   console.log("**** Processing - Algolia Response taskID = ", response.taskIDs)
  // });
  return (
    <>
      <Helmet title={'Temp'} />
      <h1>Temp Page to update Index</h1>
    </>
  )
};

export default Temp;

export const query = graphql`
  query {
    allMysqlMainView {
      edges {
        node {
          id: UniqueID
          randomShopKey: UniqueKey
          emprezzoID: UniqueID
          shopName: name
          url: url
          tags: tags
          about: about
          shopTags: tags
          shopCategory: category
          freeShipMin: FreeShipMin
          baseShipRate: BaseShipRate
          returnDays: ReturnDays
          returnShipFree: ReturnShipFree
          priceMin: PriceMin
          priceMax: PriceMax
          priceAvg: PriceAvg
          productCount: CountProducts
          updateDate: CreateDate
          shopImage: ProfileImage
          shopImage2: ProfilePicURL
          trafficRank: GlobalRankOrder
          socialRankScore: SocialRankScore
          amazonPay: AmazonPay
          applePay: ApplePay
          venmo: PaypalVenmoSupport
          paypal: PaypalShopID
          shopifyPay: ShopifyPay
          shopifyID: ShopifyID
          afterpay: AfterPay
          klarna: Klarna
          affirm: Affirm
        }
      }
    }
  }
`;
