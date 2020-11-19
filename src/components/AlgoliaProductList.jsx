import React from 'react';
import styled from '@emotion/styled';
import _ from 'lodash';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Hits,
  SearchBox,
  Pagination,
  Highlight,
  ClearRefinements,
  RefinementList,
  Configure,
} from 'react-instantsearch-dom';
import 'instantsearch.css/themes/algolia.css';

const SearchWrapper = styled.div`
  overflow: hidden;
  margin: 0 auto;
`;

const LeftPanel = styled.div`
  float: left;
  width: 250px;

  .ais-ClearRefinements-button {
    background-color: #C04CFD;
  }

  .ais-RefinementList-labelText {
    margin-left: 5px;
  }
`;

const RightPanel = styled.div`
  margin-left: 260px;

  .ais-Hits-item, .ais-Results-item {
    width: calc(20% - 1rem);
  }

  .ais-Pagination-item--selected .ais-Pagination-link {
    color: #FFF;
    background-color: #C04CFD;
    border-color:#C04CFD
  }

  .ais-Pagination-item--disabled .ais-Pagination-link {
    color: #a5abc4;
  }

  ais-Breadcrumb-link, .ais-HierarchicalMenu-link, .ais-Menu-link, .ais-Pagination-link, .ais-RatingMenu-link {
    color:#C04CFD
  }
  
`;

const AlgoliaProductList = () => {
  const searchClient1 = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_SEARCH_KEY
  );
  const searchClient = algoliasearch(
    'B1G2GM9NG0',
    'aadef574be1f9252bb48d4ea09b5cfe5'
  );
  const searchIndexName1 = `empProducts`;
  const searchIndexName = `demo_ecommerce`;

  return (
    <SearchWrapper>
      <InstantSearch indexName={searchIndexName} searchClient={searchClient}>
        <LeftPanel>
          <ClearRefinements />
          <h2>Filters</h2>
          <RefinementList attribute="brand" />
          <Configure hitsPerPage={10} />
        </LeftPanel>
        <RightPanel>
          <SearchBox />
          <Hits hitComponent={Hit} />
          <Pagination />
        </RightPanel>
      </InstantSearch>
    </SearchWrapper>
  );
}

function Hit(props) {
  return (
    <div>
      <img src={props.hit.image} align="left" alt={props.hit.name} />
      <div className="hit-name">
        <Highlight attribute="name" hit={props.hit} />
      </div>
      <div className="hit-description">
        <Highlight attribute="description" hit={props.hit} />
      </div>
      <div className="hit-price">${props.hit.price}</div>
    </div>
  );
}

export default AlgoliaProductList;
