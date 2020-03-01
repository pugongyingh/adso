import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Box, Typography, Button } from "@material-ui/core";
import { PostCard } from "./PostCard";
import { debounce } from "lodash";
import { Appear } from "../../animations/appear";
import { PoseGroup } from "react-pose";
import PostListRow from "./PostListRow";

const PER_PAGE = 10;

export const PostList = ({
  filters,
  query,
  layout = "card",
  categoryId = null
}) => {
  const [posts, setState] = useState([]);
  const [after, setAfter] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = React.useMemo(
    () =>
      debounce(filters => {
        loadMore(filters);
      }, 200),
    []
  );

  useEffect(() => {
    if (filters) {
      setAfter("");
      fetch(filters);
    }
  }, [filters]);
  const variables = {
    first: PER_PAGE,
    searchTerm: filters.searchTerm || "",
    categoryId: categoryId
  };
  if (filters.location) {
    variables = {
      ...variables,
      ...filters.location
    };
  }
  if (filters.priceRange) {
    variables = {
      ...variables,
      ...filters.priceRange
    };
  }
  const { error, fetchMore } = useQuery(query, {
    variables,
    onCompleted: response => {
      if (response) {
        const queryKey = Object.keys(response)[0];
        const data = response[queryKey];
        setState(data.edges);
        setAfter(data.pageInfo.endCursor);
        setPageInfo(data.pageInfo);
      }
    }
  });
  const loadMore = data => {
    let variables = {
      perPage: PER_PAGE,
      after,
      categoryId
    };
    const filters = data.filters;
    if (filters) {
      variables.searchTerm = filters.searchTerm || "";
      if (filters.location) {
        variables.location = filters.location;
      }
      if (filters.priceRange) {
        variables.priceRange = filters.priceRange || null;
      }
    }
    setLoading(true);
    fetchMore({
      variables,
      updateQuery: (prev, { fetchMoreResult }) => {
        setLoading(false);
        if (!fetchMoreResult) return prev;
        const queryKey = Object.keys(fetchMoreResult)[0];
        const data = fetchMoreResult[queryKey];
        setState([...posts, ...data.edges]);
        setAfter(data.pageInfo.endCursor);
        setPageInfo(data.pageInfo);
      },
      notifyOnNetworkStatusChange: true
    });
  };

  if (loading) return "Loading posts";
  if (error) {
    console.error(error);
  }

  return (
    <Box>
      {posts.length == 0 && <Typography>Sorry, no results</Typography>}
      <Box
        display="flex"
        flexDirection={
          layout == "card" ? { xs: "column", sm: "row" } : "column"
        }
        flexWrap={layout == "card" ? { xs: "none", sm: "wrap" } : "none"}
        justifyContent="center"
      >
        <PoseGroup>
          {posts.map((post, index) => (
            <Appear i={index + 100} key={post.id}>
              {layout == "card" ? (
                <PostCard post={post} />
              ) : (
                <PostListRow post={post} />
              )}
            </Appear>
          ))}
        </PoseGroup>
      </Box>
      {pageInfo.hasNextPage && (
        <Box display="flex" justifyContent="center" m="16px">
          <Button
            onClick={e => loadMore(filters)}
            variant="outlined"
            color="secondary"
          >
            Load more
          </Button>
        </Box>
      )}
    </Box>
  );
};
