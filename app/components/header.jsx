import Button from "@mui/material/Button";
import Link from "next/link";

const Header = ({ sethidepostform, sethideprofile, myinfodoc }) => {
  return (
    <div>
      <header
        style={{
          background: "rgb(3, 19, 252)",
          height: "4rem",
          display: "flex",
          alignItems: "center",
          gap: 8,
          justifyContent: "center",
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: "2",
        }}
      >
        <Button
          sx={{
            maxHeight: "40px",
            background: "purple",
            fontWeight: "600",
            transition: "transform 0.3s ease",
          }}
          variant="contained"
          onClick={() => sethidepostform(true)}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.07)")}
          onMouseLeave={(e) => (e.target.style.transform = "")}
        >
          Post +
        </Button>

        <Link href="/Signup">
          <Button
            sx={{
              maxHeight: "40px",
              background: "purple",
              fontWeight: "600",
              transition: "transform 0.3s ease",
            }}
            variant="contained"
            onMouseOver={(e) => (e.target.style.transform = "scale(1.07)")}
            onMouseLeave={(e) => (e.target.style.transform = "")}
          >
            Sing-up
          </Button>
        </Link>

        <Link href="/login">
          <Button
            variant="contained"
            sx={{
              maxHeight: "40px",
              background: "purple",
              fontWeight: "600",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.07)")}
            onMouseLeave={(e) => (e.target.style.transform = "")}
          >
            Log-in
          </Button>
        </Link>

        <div>
          <div
            style={{
              height: "2rem",
              width: "2rem",
              borderRadius: "100%",
              background: "pink",
              textAlign: "center",
              paddingTop: "5px",
              fontWeight: "700",
              cursor: "pointer",
              position: "relative",
              transition: "transform 0.3s ease",
            }}
            onClick={() => sethideprofile(true)}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.07)")}
            onMouseLeave={(e) => (e.target.style.transform = "")}
          >
            {myinfodoc?.Name?.split("")[0] ?? ""}{" "}
            {/* initial based profile name */}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
