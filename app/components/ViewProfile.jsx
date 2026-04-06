import React from "react";

const ViewProfile = ({
  hideprofile,
  sethideprofile,
  signout,
  myinfodoc,
  setuserlogout,
}) => {
  function signout() {
    localStorage.removeItem("token");
    setuserlogout(true);

    // by removing token user has no loger access to his account he can re gain  token only by signup or log-in
  }

  return (
    <div>
      {hideprofile && (
        <div
          style={{
            width: "80%",
            maxWidth: "19rem",
            height: "20rem",
            background: "rgb(16, 227, 220)",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "10px",
            zIndex: "1",
            position: "fixed",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              borderBottom: "2px solid black",
              width: "100%",
              height: "150px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                height: "6rem",
                width: "6rem",
                borderRadius: "100%",
                background: "pink",
                textAlign: "center",
                paddingBottom: "20px",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "70px",
              }}
            >
              {myinfodoc?.Name?.split("")[0] ?? ""}{" "}
              {/* initial based profile name */}
            </div>
          </div>

          <div
            style={{
              paddingLeft: "10px",
              paddingTop: "30px",
            }}
          >
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

          <div
            style={{
              fontWeight: "700",
              width: "200px",
              fontSize: "30px",
              cursor: "pointer",
              borderBottom: "red",
              borderBottom: "3px solid red",
              textAlign: "center",
              margin: "auto",
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
