import React from 'react';
import { Link, graphql } from 'gatsby';
import Image from 'gatsby-image';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Header, BlogList } from 'components';
import { Layout } from 'layouts';

const ShopsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 4rem 4rem 1rem 4rem;
  @media (max-width: 1000px) {
    margin: 4rem 2rem 1rem 2rem;
  }
  @media (max-width: 700px) {
    margin: 4rem 1rem 1rem 1rem;
  }
`;

const Entries = ({ data }) => {
  const { edges } = data.allGoogleSheetListRow;
  const listEdges = [];
  const combinedEdges = [];
  const maxItems = 12;
  const [limit, setLimit] = React.useState(maxItems);
  const [showMore, setShowMore] = React.useState(true);

  const increaseLimit = () => {
    setLimit(limit + maxItems);
  }

  const rowShopifyViewEdges = data.allMysqlShopifyView.edges;
  const rowDataViewEdges = data.allMysqlDataView.edges;

  //Creating a new dataset with original nodes and required columns from DataView
  edges.map((edge) => {
    const inputInstaID = edge.node.instagramname;
    //filter to show only shops present in ShopifyView
    var resultShopify = _.filter(rowShopifyViewEdges, ({ node }) => node.UserName == inputInstaID)
    if (resultShopify.length > 0) {
      //now finding corresponding data from DataView
      var resultData = _.filter(rowDataViewEdges, ({ node }) => node.UserName == inputInstaID)
      var firstDataRow = null;
      if (resultData.length > 0) {
        firstDataRow = resultData[0]
      }
      let newNode = {
        node : edge,
        dataNode: firstDataRow
      }
      combinedEdges.push(newNode);
    }
  })

  //var sortedEdges = _.sortBy(combinedEdges, ({ node }) => return node.activity)

  //filtering items as per limit
  combinedEdges.map((edge) => {
    if (listEdges.length < limit) {
      listEdges.push(edge);
    }
  })
  console.log("+++++++++++++++++++++++++++++")
  console.log(listEdges)

  return (
    <Layout>
      <Helmet title={'Top Shopify Stores | Shop the most popular stores'} />
      <Header title="🧐 Discover the top Shopify stores" subtitle=""></Header>

      <ShopsWrapper>
        <div class="intro_text">
          <h3>Browse the most popular Shopify stores</h3>
          <p>Discover top Shopify sellers based upon organic search traffic and social media activity.</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Store</th>
              <th></th>

              <th>IFS</th>
              <th>IPS</th>
              <th>ESS</th>
            </tr>
          </thead>
          <tbody>
            {listEdges.map(({ node }) => (
              <tr key={node.name}>
                <td>
                  {node.localProfileImage &&
                    <Link to={`/shops/${node.slug}`}>
                      <Image fluid={node.localProfileImage.childImageSharp.fluid} class="profileimage" style={{ width: "50px" }} title={node.name + 'is on Shopify'} alt={node.about && node.about.substring(0, 140)} />

                    </Link>
                  }

                </td>

                <td><Link to={`/shops/${node.slug}`}>{node.name}</Link></td>

                <td>{node.followersperfollow}</td>
                <td>{node.followersperpost}</td>
                <td>{node.socialscore}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </ShopsWrapper>
      {showMore && listEdges.length > 0 && listEdges.length < edges.length &&
        <div className="center">
          <a className="button" onClick={increaseLimit} style={{ cursor: "pointer" }}>
            Load More
            </a>
        </div>
      }
      <ShopsWrapper>
        <div class="intro_text">
          <h3>Discover top Shopify stores of 2020</h3>
          <p>Find the top Shopify stores by traffic & social media activity. See some of the best Shopify store examples.</p><p>Search in header for more Shopify stores or <a href="/randomshop">discover a shop</a></p>
        </div>
      </ShopsWrapper>
    </Layout>
  );
};

export default Entries;

export const query = graphql`
  query {
    allGoogleSheetListRow {
      edges {
        node {
          name
          url
          slug
          about
          instagramname
        }
      }
    }
    allMysqlDataView {
      edges {
        node {
          UserName
          PostDate
          AlexaCountry
          UniquePhotoLink
          PostsCount
          FollowersCount
          FollowingCount
          GlobalRank
          LocalRank
          TOS
          ProfilePicURL
          Caption
          ShortCodeURL
        }
      }
    }
    allMysqlShopifyView {
      edges {
        node {
          UserName
          Title
          ProductURL
          ImageURL
          Price
        }
      }
    }
  }
`;
