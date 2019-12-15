import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Box, Typography, Button } from "@material-ui/core";
import { ALL_POSTS } from "../../graphql/postResolvers";
import { PostCard } from "./PostCard";

export const PostList = () => {
  const [posts, setState] = useState([]);
  const [page, setPage] = useState(1);
  const [after, setAfter] = useState("");
  const { data, loading, error, fetchMore } = useQuery(ALL_POSTS, {
    variables: {
      perPage: 10
    },
    onCompleted: response => {
      console.log("response", response);
      setState(response.allPosts.data);
      setAfter(response.allPosts.after);
    }
  });
  if (loading) return "Loading posts";
  if (error) {
    console.error(error);
  }

  const loadMore = e => {
    fetchMore({
      variables: {
        perPage: 2,
        after
      },
      updateQuery: (prev, { fetchMoreResult, ...rest }) => {
        if (!fetchMoreResult) return prev;
        console.log("fetchMoreResult", fetchMoreResult);
        setState([...posts, ...fetchMoreResult.allPosts.data]);
        setAfter(fetchMoreResult.allPosts.after);
      }
    });
  };
  return (
    <Box>
      <Typography>This is Post list</Typography>
      <div>
        {posts.map(post => (
          <PostCard key={post.uuid} post={post} />
        ))}
        {after !== "" && (
          <Box display="flex" justifyContent="center" m="16px">
            <Button onClick={loadMore} variant="outlined" color="secondary">
              Load more
            </Button>
          </Box>
        )}
      </div>
    </Box>
  );
};
