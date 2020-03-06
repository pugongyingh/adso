import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import {
  setAuthenticationToken,
  setRefreshToken,
  validateEmail
} from "src/lib/auth";
import { useRouter } from "next/router";
import queryString from "query-string";
import { withSnackbar } from "notistack";
import Link from "src/components/Link";
import { useIdentityContext } from "src/hooks/useIdentity";
import { RESEND_CONFIRMATION } from "src/graphql/authResolvers";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="#">
        Adso App
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  errorText: {
    color: theme.palette.error.main
  }
}));

const LOGIN = gql`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

const SignIn = ({ enqueueSnackbar }) => {
  const router = useRouter();
  const classes = useStyles();
  const { isLoggedIn } = useIdentityContext();
  if (isLoggedIn) {
    router.push("/");
  }
  const [login, { loading }] = useMutation(LOGIN, {
    onCompleted: ({ login }) => {
      setAuthenticationToken(login.accessToken);
      setRefreshToken(login.refreshToken);
      location.reload();
    },
    onError: err => {
      console.log(err);
      if (err && err.message.includes("WrongEmailOrPassword")) {
        setMsg("Wrong email or password");
      }
      if (err && err.message.includes("UserNotConfirmed")) {
        enqueueSnackbar(
          "Please confirm your email. Click link in confirmation email.",
          {
            variant: "warning"
          }
        );
      }
    }
  });
  const [msg, setMsg] = useState("");
  const formRef = React.createRef();

  const onSignIn = event => {
    event.preventDefault();
    const email = formRef.current.email.value;
    if (!validateEmail(email)) return setMsg("Invalid email");
    const password = formRef.current.password.value;
    login({ variables: { input: { email, password } } });
  };

  const [resendConfirmation] = useMutation(RESEND_CONFIRMATION, {
    onCompleted: response => {
      enqueueSnackbar(
        "Confirmation link was sent to your email. Please check your email.",
        {
          variant: "success"
        }
      );
      router.push("/sign-in");
    },
    onError: err => {
      console.log(err);
    }
  });

  const onResend = event => {
    event.preventDefault();
    const email = formRef.current.email.value;
    if (!validateEmail(email)) return setMsg("Invalid email");
    const password = formRef.current.password.value;
    resendConfirmation({
      variables: {
        email,
        password,
        token: "token"
      }
    });
  };

  const handleSubmit = event => {
    const parsed = queryString.parse(location.search);
    if (parsed.resend) {
      onResend(event);
      return;
    }
    onSignIn(event);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Typography variant="caption" className={classes.errorText}>
          {msg}
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/sign-up" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default withSnackbar(SignIn);
