import Button from "@mui/material/Button";
import Link from "next/link";
import toast from "react-hot-toast";

const ViewProfile = ({
  hideprofile,
  sethideprofile,
  signout,
  myinfodoc,
  setuserlogout,
  getonlymypost,
  setavalableindb,
  hidefilbtn,
  sethidefilbtn,
  setonlymypost,
}) => {
  function signout() {
    localStorage.removeItem("token");
    setuserlogout(true);

    // by removing token user has no loger access to his account he can re gain  token only by signup or log-in
  }

  // as this app fetches data on scroll if mypostpage is true it re applies the filter of mypost on every  newly fetched data

  return (
    <div>
      {hidefilbtn && (
        <div
          style={{
            height: "50px",
            width: "100%",
            background: "rgb(17, 235, 242)",
            zIndex: "2",
            position: "fixed",
            top: 60,
            left: 0,
            display: "grid",
            placeItems: "center",
          }}
        >
          <Button
            sx={{
              background: "rgb(19, 209, 120)",
              color: "black",
              fontWeight: "700",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "")}
            onClick={() => {
              setavalableindb(true);
              setonlymypost([]); //reset
              sethidefilbtn(false);
            }}
          >
            Show all posts including yours
          </Button>
        </div>
      )}
      {hideprofile && (
        <div
          style={{
            width: "80%",
            maxWidth: "19rem",
            height: "23rem",
            background: "rgb(16, 227, 220)",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "10px",
            zIndex: "7",
            position: "fixed",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              borderBottom: "2px solid black",
              width: "100%",
              height: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                height: "4rem",
                width: "4rem",
                borderRadius: "100%",
                background: "pink",
                textAlign: "center",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "60px",
                lineHeight: "55px",
              }}
            >
              {myinfodoc?.Name?.split("")[0] ?? ""}{" "}
              {/* initial based profile name */}
            </div>
          </div>

          <div
            style={{
              paddingLeft: "10px",
              paddingTop: "80px",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <button
              style={{
                background: "none",
                border: "none",
                borderBottom: "black solid 2px",
                fontWeight: "700",
                position: "absolute",
                top: "8rem",
                fontSize: "20px",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.target.style.borderBottom = "blue solid 3px")
              }
              onMouseOut={(e) => (e.target.style.borderBottom = "")}
              onClick={async () => {
                const mydata = await getonlymypost();
                if (mydata.length === 0) {
                  //mydata holds same data as onlymypost just using direct return value to avoid state async behaviour
                  toast.error(
                    `Found zero post for userName ${myinfodoc.UserName}`,
                  );
                  sethideprofile(false);
                  return;
                }
                setavalableindb(false); // to turn off fetch on scroll of allpost
                sethideprofile(false);
                sethidefilbtn(true);
              }}
            >
              See my posts
            </button>

            <div style={{ fontWeight: "700", display: "flex" }}>
              <div>UserName:</div>

              <div style={{ flexShrink: 0, overflowY: "auto", width: "12rem" }}>
                {myinfodoc.UserName}
              </div>
            </div>

            <div style={{ fontWeight: "700", display: "flex" }}>
              <div>Name:</div>

              <div
                style={{
                  flexShrink: 0,
                  fontWeight: "700",
                  overflowY: "auto",
                  width: "14rem",
                }}
              >
                {myinfodoc.Name}
              </div>
            </div>
          </div>

          <Link
            href="/Deleteac"
            style={{ textDecoration: "none", color: "black" }}
          >
            <div
              style={{
                fontWeight: "700",
                width: "200px",
                fontSize: "30px",
                cursor: "pointer",
                borderBottom: "3px solid red",
                textAlign: "center",
                margin: "auto",
                paddingTop: "10px",
              }}
              onMouseEnter={(e) => (e.target.style.color = "red")}
              onMouseLeave={(e) => (e.target.style.color = "")}
            >
              Delete account
            </div>
          </Link>

          <div
            style={{
              fontWeight: "700",
              width: "200px",
              fontSize: "30px",
              cursor: "pointer",
              borderBottom: "3px solid red",
              textAlign: "center",
              margin: "auto",
              paddingTop: "20px",
            }}
            onMouseEnter={(e) => (e.target.style.color = "red")}
            onMouseLeave={(e) => (e.target.style.color = "")}
            onClick={() => {
              let c = confirm("This action will sign you out");
              if (!c) return;
              sethideprofile(false);
              signout();
            }}
          >
            Sign out
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProfile;
