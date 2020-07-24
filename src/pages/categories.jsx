import React from 'react';
import { graphql } from 'gatsby';
import styled from '@emotion/styled';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Header } from 'components';
import PostList5Col from '../components/PostList5Col';
import { Layout } from 'layouts';
import _ from 'lodash';

const CategoryHeading = styled.h1`
  margin-left: 4rem;
`;

const CategoryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: normal;
  margin: 1rem 4rem 1rem 4rem;
  @media (max-width: 1000px) {
    margin: 1rem 2rem 1rem 2rem;
  }
  @media (max-width: 700px) {
    margin: 1rem 1rem 1rem 1rem;
  }
`;

const Categories = ({ data, pageContext }) => {
  const { category } = pageContext;
  const categoryHeading = category + " Shops";
  const categoryGroup = data.allGoogleSheetListRow.group;
  console.log(categoryGroup)  

  const rowDataViewEdges = data.allMysqlDataView.edges;

  return (
    <Layout title={'Shop Independent ' + categoryHeading + ' | Discover direct-to-consumer' + categoryHeading } >
      <Header title={categoryHeading}><span class="Header--Subtitle">discover exceptional independent {categoryHeading}</span></Header>
      
        {categoryGroup.map((category, index) => {
          const listEdges = _.slice(category.edges,0,5)
          return (
            <div key={index}>
              <CategoryHeading>{category.fieldValue}</CategoryHeading> 
              <CategoryWrapper>
                {listEdges.map(({ node }) => (
                  <PostList5Col
                      key={node.name}
                      columns="5"
                      cover={node.localImageUrl && node.localImageUrl.childImageSharp.fluid}
                      path={`/shops/${node.slug}`}
                      title={node.name}
                      excerpt={node.about && node.about.substring(0,40)+"..."}
                      mysqldataview={rowDataViewEdges}
                      instagramname={node.instagramname}
                    />
                ))}
              </CategoryWrapper>
            </div>
        )})}
           
      
      
    </Layout>
  );
};

export default Categories;

export const query = graphql`
  query {
    allMysqlDataView {
      edges {
        node {
          UserName
          UniquePhotoLink
          ProfilePicURL
          Caption
          ShortCodeURL
        }
      }
    }
    allGoogleSheetListRow {
      group(field: category) {
        fieldValue
        edges {
          node {
            name
            slug
            url
            category
            tags
            about
            state
            city
            instagramname
          }
        }
      }
    }
  }
`;
