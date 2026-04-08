import CommentSection from "./CommentSection";
import Image from "next/image";
import Button from "@mui/material/Button";
import { useState } from "react";
import { Virtuoso } from "react-virtuoso";
import dayjs from "dayjs";

function Row({ allpost, setallpost, myinfodoc, clientio, ind, innerWidth }) {
  const [imgchg, setimgchg] = useState({ v: 0 });

  if (!allpost) return;

  const i = allpost[ind];

  //for extention
  const getextention = i.Imgurl[imgchg.v]
    ?.split("/")[7]
    .split("/")
    .pop()
    .split(".")
    .pop();

  const allowedforimg = ["jpg", "jpeg", "png", "webp", "avif", "gif", "svg"];

  return (
    <div
      key={i._id}
      style={{
        position: "relative",
        width: "90%",
        maxWidth: "38rem",
        borderRadius: "20px",
        background: "rgb(245, 246, 247)",
        boxShadow: "0 1px 14px 5px black",
      }}
    >
      {/* post header 1 div with another sub div and that sub div  has 3 grandsub div with grid-cols-3  */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px",
          marginLeft: "8px",
        }}
      >
        {" "}
        <div>
          <div
            style={{
              height: "3rem",
              width: "3rem",
              borderRadius: "100%",
              background: "pink",
              textAlign: "center",
              textAlign: "center",
              lineHeight: "50px",
              fontSize: "30px",
              fontWeight: "700",
              marginTop: "20px",
            }}
          >
            {i?.Name ? i.Name.split("")[0] : ""} {/* initial based profile name */}
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,2fr)",
            columnGap: innerWidth <= 460 ? "0px" : "20px",
            fontWeight: "700",
            paddingTop: "20px",
          }}
        >
          <div style={{ width: "7rem", overflowY: "auto" }}>{i.UserName}</div>

          <div style={{ fontSize: innerWidth <= 460 ? "11.5px" : "16px" }}>
            {dayjs(i.createdAt).format("DD MMM YYYY, hh:mm A")}
          </div>

          <div style={{ width: "7rem", overflowY: "auto" }}>{i.Name}</div>
        </div>
      </div>

      <p
        style={{
          width: "100%",
          margin: "auto",
          overflow: "hidden",
          display: "block",
          fontWeight: "700",
          marginTop: "20px",
          marginBottom: "10px",
          width: "95%",
        }}
      >
        {i.TextPost}
      </p>

      {i.Imgurl.length >= 1 && (
        <div
          style={{
            height: "608px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {i.Imgurl.length > 1 && (
            <>
              <button
                style={{
                  fontSize: "100px",
                  position: "absolute",
                  color: "red",
                  right: "10px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setimgchg((prev) => {
                    if (prev.el !== i._id) {
                      //clean up
                      return { el: i._id, v: 0 };
                    }

                    if (prev.v >= i.Imgurl.length - 1) {
                      return prev;
                    }

                    return { el: i._id, v: prev.v + 1 };
                  });
                }}
              >
                {">"}
              </button>

              {imgchg.el !== i._id && (
                <Button
                  variant="contained"
                  sx={{ position: "absolute" }}
                  onClick={() =>
                    setimgchg(
                      (prev) =>
                        prev.el !== i._id ? { el: i._id, v: 0 } : prev, //clean up
                    )
                  }
                >
                  VIEW IMAGE
                </Button>
              )}

              <button
                style={{
                  fontSize: "100px",
                  position: "absolute",
                  color: "red",
                  left: "10px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setimgchg((prev) => {
                    if (prev.el !== i._id) {
                      return { el: i._id, v: 0 };
                    }

                    if (prev.v <= 0) {
                      return prev;
                    }

                    return { el: i._id, v: prev.v - 1 };
                  });
                }}
              >
                {"<"}
              </button>

              <div
                style={{
                  position: "absolute",
                  top: "38rem",
                  fontSize: "20px",
                  left: "10px",
                  fontWeight: "700",
                }}
              >
                {imgchg.v + 1}/{i.Imgurl.length}
              </div>
            </>
          )}

          {allowedforimg.includes(getextention) ? (
            <Image
              alt="image"
              height={550}
              width={550}
              src={i.Imgurl[imgchg.el === i._id ? imgchg.v : 0]}
              style={{
                width: "100%",
              }}
            />
          ) : (
            <iframe
              alt="image"
              src={i.Imgurl[imgchg.el === i._id ? imgchg.v : 0]}
              style={{
                height: "550px",
                width: "100%",
              }}
            />
          )}
        </div>
      )}

      <CommentSection
        setallpost={setallpost}
        myinfodoc={myinfodoc}
        clientio={clientio}
        i={i}
        dayjs={dayjs}
      />
    </div>
  );
}

const PostBody = ({ allpost, setallpost, myinfodoc, clientio, innerWidth }) => {
  return (
    // overscan for buffer

    <Virtuoso
      useWindowScroll
      style={{
        maxWidth: "35rem",
        margin: "3rem auto",
        paddingLeft: "20px",
      }}
      totalCount={allpost.length}
      itemContent={(ind) => {
        return (
          <>
            <div style={{ height: "100px" }} /> {/*empty space*/}
            <Row
              allpost={allpost}
              setallpost={setallpost}
              clientio={clientio}
              myinfodoc={myinfodoc}
              ind={ind}
              innerWidth={innerWidth}
            />
          </>
        );
      }}
    />
  );
};
export default PostBody;
