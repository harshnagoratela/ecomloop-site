import React, { Fragment } from "react"
import { Highlight, Snippet } from "react-instantsearch-dom"
import { Link } from "gatsby"
import { Calendar } from "@styled-icons/octicons"
import { Tag } from "@styled-icons/octicons"

export const ShopHit = clickHandler => ({ hit }) => (
  <div>
    <Link to={`/shops/` + hit.slug} onClick={clickHandler}>
      <h4>
        <Highlight attribute="title" hit={hit} tagName="mark" />
      </h4>
    </Link>
    <div>
      <Calendar size="1em" />
      &nbsp;
      <Highlight attribute="date" hit={hit} tagName="mark" />
      &nbsp;
      <Tag size="1em" />
      &nbsp;
      <Highlight attribute="tags" hit={hit} tagName="mark" />
    </div>
    <Snippet attribute="excerpt" hit={hit} tagName="mark" />
  </div>
)
