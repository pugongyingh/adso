import React from "react";
import {
  Card,
  CardHeader,
  Avatar,
  CardMedia,
  CardContent,
  Typography,
  Box,
  CardActions,
  IconButton,
  CardActionArea
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import moment from "moment";
import MessageIcon from "@material-ui/icons/Message";
import ShareIcon from "@material-ui/icons/Share";
import { useRouter } from "next/dist/client/router";

const useStyles = makeStyles(theme => ({
  card: {
    margin: theme.spacing(1)
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  price: {
    color: theme.palette.primary.dark
  }
}));

export const PostCard = ({ post }) => {
  const classes = useStyles();
  const router = useRouter();
  return (
    <Card className={classes.card}>
      <CardActionArea onClick={e => router.push(`/p?id=${post.uuid}`)}>
        <CardHeader
          avatar={<Avatar aria-label="author">RK</Avatar>}
          title={post.title}
          subheader={moment(+post.createdAt).fromNow()}
        />
      </CardActionArea>
      <CardMedia
        className={classes.media}
        image={post.images[0]}
        title={post.title}
      />
      <CardActions>
        <Box display="flex" justifyContent="space-between" flexGrow="1">
          <Box>
            {post.priceInfo.toLowerCase() == "fixed" ? (
              <Box>
                <Typography variant="subtitle2">Price: </Typography>
                <Typography className={classes.price}>${post.price}</Typography>
              </Box>
            ) : (
              <Typography variant="subtitle2">Contact for Price</Typography>
            )}
          </Box>
          <Box>
            <IconButton>
              <MessageIcon />
            </IconButton>
            <IconButton>
              <ShareIcon />
            </IconButton>
          </Box>
        </Box>
      </CardActions>
    </Card>
  );
};
