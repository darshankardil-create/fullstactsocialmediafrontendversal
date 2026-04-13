"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../components/shared-theme/AppTheme";
import ColorModeSelect from "../components/shared-theme/ColorModeSelect";
import baseurl from "../baseUrl";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import MainPage from "./../page";
//contextapi
import { useContext } from "react";
import { ContextPro } from "./../context";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function SignIn(props: { disableCustomTheme?: boolean }) {
  const { myinfodoc } = useContext(ContextPro);

  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");

  const [loading, setloading] = React.useState(false);
  const [Passwordofinp, setPasswordofinp] = React.useState("");

  const router = useRouter();

  async function postdata() {
    setloading(true);

    try {
      const obj = {
        livepass: Passwordofinp,
      };

      const res = await fetch(`${baseurl}/express/deleteac/${myinfodoc._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });

      const format = await res.json();

      if (res.ok) {
        toast.success(format.message);
        router.replace("/");
      } else {
        console.error(format.error);
        if (res.status === 401) {
          toast.error(format.message);
        } else if (res.status === 429) {
          toast.error("Too many req please try again later by login");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
    }
  }

  function validateInputs() {
    const password = document.getElementById("password") as HTMLInputElement;

    let isValid = true;

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  }

  return (
    <div suppressHydrationWarning>
      {!myinfodoc?.UserName && <MainPage />}

      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <SignInContainer direction="column" justifyContent="space-between">
          <ColorModeSelect
            sx={{ position: "fixed", top: "1rem", right: "1rem" }}
          />
          <Card variant="outlined">
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
            >
              DELETE ACCOUNT
            </Typography>
            <Box
              component="form"
              noValidate
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 2,
              }}
            >
              <FormControl>
                <FormLabel style={{ overflowX: "auto" }} htmlFor="password">
                  Password for {myinfodoc.UserName}
                </FormLabel>
                <TextField
                  onChange={(e) => setPasswordofinp(e.target.value)}
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  name="password"
                  placeholder="••••••"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  color={passwordError ? "error" : "primary"}
                />
              </FormControl>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />

              <Button
                type="submit"
                style={{
                  background: loading ? "gray" : "",
                  cursor: loading ? "not-allowed" : "pointer",
                  pointerEvents: loading ? "none" : "auto",
                }}
                fullWidth
                variant="contained"
                onClick={async (e) => {
                  e.preventDefault();
                  if (validateInputs()) {
                    await postdata();
                  }
                }}
              >
                {loading ? "Loading..." : "DELETE"}
              </Button>
            </Box>
          </Card>
        </SignInContainer>
      </AppTheme>
    </div>
  );
}
