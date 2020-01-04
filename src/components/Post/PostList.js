import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Box, Typography, Button } from "@material-ui/core";
import { PostCard } from "./PostCard";
import { debounce } from "lodash";
import { Appear } from "../../animations/appear";
import { PoseGroup } from "react-pose";

const PER_PAGE = 10;

export const PostList = ({ filters, query }) => {
  const [posts, setState] = useState([]);
  const [after, setAfter] = useState("");
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

  const { data, error, fetchMore } = useQuery(query, {
    variables: {
      perPage: PER_PAGE,
      searchTerm: filters.searchTerm || "",
      location: filters.location,
      priceRange: filters.priceRange
    },
    onCompleted: response => {
      if (response) {
        const queryKey = Object.keys(response)[0];
        setState(response[queryKey].data);
        setAfter(response[queryKey].after);
      }
    }
  });
  const loadMore = data => {
    let variables = {
      perPage: PER_PAGE,
      after
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
        setState([...posts, ...fetchMoreResult[queryKey].data]);
        setAfter(fetchMoreResult[queryKey].after);
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
        flexDirection={{ xs: "column", sm: "row" }}
        flexWrap={{ xs: "none", sm: "wrap" }}
        justifyContent="center"
      >
        <PoseGroup>
          {posts.map((post, index) => (
            <Appear i={index + 100} key={post.id}>
              <PostCard post={post} />
            </Appear>
          ))}
        </PoseGroup>
      </Box>
      {after !== "" && (
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
