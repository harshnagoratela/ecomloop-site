import React from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Layout, Container, Content } from 'layouts';
import { TagsBlock, Header, SEO } from 'components';
import AtomFeedList from '../components/AtomFeedList';
import '../styles/prism';

const SuggestionBar = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  background: ${props => props.theme.colors.white.light};
  box-shadow: ${props => props.theme.shadow.suggestion};
`;
const PostSuggestion = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 3rem 0 3rem;
  @media (max-width: 600px) {
    margin-left: 1rem;
    margin-right: 1rem;
  }
`;

const Title = styled.h1`
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    font-size: 1rem;
  }
`;

const Subtitle = styled.h5`
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    font-size: 0.7rem;
  }
`;

const Statistics = styled.div`
  display: flex;
  margin-bottom: 15px;
  padding: 5px;
`;

const StatisticItem = styled.div`
  margin-right: 1rem;
  text-align: center;
  line-height: 1.2rem;
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    font-size: 1rem;

    margin-right: 10px;
  }
`;

const StatisticIcon = styled.img`
  max-width: 25px;
  margin:5px;
`;

const ViewContainer = styled.section`
  display: flex;
  flex-wrap: wrap;
`;
const ShopifyViewCard = styled.div`
  flex: 1 16%;
  padding: 2%;
  @media (max-width: ${props => props.theme.breakpoints.s}) {
      flex: 1 96%;
  }
`;
const PostViewCard = styled.div`
  flex: 1 29%;
  padding: 2%;
  @media (max-width: ${props => props.theme.breakpoints.s}) {
      flex: 1 96%;
  }
`;
const ViewImage = styled.div`
  max-width: 100%;
`;
const ViewInfo = styled.div`
  margin-top: auto;
`;

const SingleItem = ({ data, pageContext }) => {
    const { next, prev } = pageContext;
    const { name, date, slug, imageurl, url, category, tags, localImageUrl, profileimage, localProfileImage, instagramname, instagramposts, instagramfollowers, instagramfollowing, alexalink, alexarank, alexatimeonsite, followersperfollow, followersperpost, socialscore, about, country, state, city, like, fields } = data.googleSheetListRow

    //converting comma seperated tags to tags map
    const tagsList = tags ? tags.split(',') : [];
    const image = localImageUrl ? localImageUrl.childImageSharp.fluid : null;
    const atomfeed = fields && fields.atomfeed ? fields.atomfeed : [];

    //Extracting Posts from MySQL Data
    const maxPosts = 3;
    const listPostEdges = [];
    const rowDataViewEdges = data.allMysqlDataView.edges;
    //filtering top 3 for current instagram id
    rowDataViewEdges.map((edge) => {
        if (listPostEdges.length < maxPosts && edge.node.UserName == instagramname) {
            listPostEdges.push(edge);
        }
    })
    const firstRowDataView = rowDataViewEdges && rowDataViewEdges.length ? rowDataViewEdges[0] : null;

    const subtitle = city + ", " + state + "<br/> " + (firstRowDataView && firstRowDataView.node.AlexaCountry)

    //Extracting Products from MySQL Data
    const maxProducts = 5;
    const listProductEdges = [];
    const rowShopifyViewEdges = data.allMysqlShopifyView.edges;
    //filtering top 3 for current instagram id
    rowShopifyViewEdges.map((edge) => {
        if (listProductEdges.length < maxProducts && edge.node.UserName == instagramname) {
            listProductEdges.push(edge);
        }
    })

    return (
        <Layout>
            <SEO
                title={name}
                description={about || ' '}
                banner={image}
                pathname={url}
            />
            <Header title={name} children={subtitle} date={date} cover={firstRowDataView && firstRowDataView.node.UniquePhotoLink} />
            <Container>
                <div className="profileimage" style={{ display: "flex" }}>
                    {firstRowDataView && firstRowDataView.node.ProfilePicURL &&
                        <img src={firstRowDataView.node.ProfilePicURL} alt={name} className="profileimage" style={{ width: "100px" }} />
                    }
                    <div style={{ paddingLeft: "15px" }}>
                        <Statistics>
                            <StatisticItem><a target="_blank" href={firstRowDataView && firstRowDataView.node.ShortCodeURL}><StatisticIcon src="/instagram_icon.png" alt={instagramname} width="15px" height="15px" max-width="25px" /></a></StatisticItem>
                            <StatisticItem>{firstRowDataView && firstRowDataView.node.PostsCount} <br /><span className="stat_title" title="Social Score">*ESS*</span></StatisticItem>
                            <StatisticItem>{firstRowDataView && firstRowDataView.node.FollowersCount} <br /><span className="stat_title" title="*Instagram Follow Score">*IFS*</span></StatisticItem>
                            <StatisticItem>{firstRowDataView && firstRowDataView.node.FollowingCount} <br /><span className="stat_title" title="Instagram Post Score">*IPS*</span></StatisticItem>
                        </Statistics>
                        <Statistics>
                            <StatisticItem><StatisticIcon width="15px" height="15px" max-width="25px" /></StatisticItem>
                            <StatisticItem>{firstRowDataView && firstRowDataView.node.GlobalRank} <br /><span className="stat_title" title="Social Score">Global<br />Rank</span></StatisticItem>
                            <StatisticItem>{firstRowDataView && firstRowDataView.node.LocalRank} <br /><span className="stat_title" title="*Instagram Follow Score">Local<br />Rank</span></StatisticItem>
                            <StatisticItem>{firstRowDataView && firstRowDataView.node.TOS} <br /><span className="stat_title" title="Instagram Post Score">*TOS*</span></StatisticItem>
                        </Statistics>

                    </div>
                </div>
                <Content input={about} /><br />
                <TagsBlock title="tags" list={tagsList || []} />
                <a target="_blank" href={url} className="button">Shop {name}</a> <a href="/randomshop" className="button buttonalt">Discover another shop</a>

                {/*<AtomFeedList list={atomfeed} /><br />*/}
                {/* List of Products from MySQL View */}
                {listProductEdges && listProductEdges.length > 0 && <h3>customer favorites</h3>}
                <ViewContainer>
                    {listProductEdges.map(({ node }) => {
                        return (
                            <ShopifyViewCard key={node.ProductURL}>
                                <a href={node.ProductURL} target="_blank">
                                    <ViewImage>
                                        <img src={node.ImageURL} />
                                    </ViewImage>
                                </a>
                                <ViewInfo className="info">
                                    <a href={node.ProductURL} target="_blank">
                                        {node.Title}
                                    </a>
                                    <h6>${node.Price}</h6>
                                </ViewInfo>
                            </ShopifyViewCard>
                        );
                    })}
                </ViewContainer>
                <br />
                {/* List of Posts from MySQL View */}
                {listPostEdges && listPostEdges.length > 0 && <h3>instagram posts</h3>}
                <ViewContainer>
                    {listPostEdges.map(({ node }) => {
                        return (
                            <PostViewCard key={node.UniquePhotoLink}>
                                <a href={node.ShortCodeURL} target="_blank">
                                    <ViewImage>
                                        <img src={node.UniquePhotoLink} />
                                    </ViewImage>
                                </a>
                                <ViewInfo className="info">
                                    ${node.Caption}
                                </ViewInfo>
                            </PostViewCard>
                        );
                    })}
                </ViewContainer>
                {/*
        <Statistics>
          <StatisticItem><a target="_blank" href={alexalink}><StatisticIcon src="/alexa_icon.jpg" alt={alexalink} /></a></StatisticItem>
          <StatisticItem>{alexarank} <br/>alexa rank</StatisticItem>
          <StatisticItem>{alexatimeonsite} <br/>avg minutes per visit</StatisticItem>
        </Statistics>
*/}


            </Container>
            <SuggestionBar>
                <PostSuggestion>
                    {prev && (
                        <Link to={`/shops/${prev.slug}`}>

                            <p>&lt; {prev.name}</p>
                        </Link>
                    )}
                </PostSuggestion>
                <PostSuggestion>
                    {next && (
                        <Link to={`/shops/${next.slug}`}>

                            <p>{next.name}	&gt;</p>
                        </Link>
                    )}
                </PostSuggestion>
            </SuggestionBar>
        </Layout>
    );
};

export default SingleItem;

export const query = graphql`
  query($pathSlug: String!) {
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
    googleSheetListRow(slug: {eq: $pathSlug}) {
      name
      imageurl
      localImageUrl {
        childImageSharp {
          fluid(
            maxWidth: 1800,
            duotone: { highlight: "#386eee", shadow: "#2323be", opacity: 60 }
          ) {
            ...GatsbyImageSharpFluid
          }

        }
      }
      url
      slug
      category
      tags
      about
      profileimage
      localProfileImage {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      instagramname
      instagramposts
      instagramfollowers
      instagramfollowing
      followersperfollow
      followersperpost
      socialscore
      alexalink
      alexarank
      alexatimeonsite
      country
      state
      city
      fields {
        atomfeed {
          guid
          title
          link
        }
      }
    }
  }
`;
