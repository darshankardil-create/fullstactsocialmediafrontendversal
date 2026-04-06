import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useState } from "react";

const CommentSection = ({ i, clientio, myinfodoc, setallpost, dayjs }) => {
  const [comment, setcomment] = useState("");

  const [hidecomment, sethidecomment] = useState(false); // also stores id to identify on
  // which post user click and then opens its comment section if click id matches with map id

  function handlelike(postid) {
    //  emit for like

    clientio.emit("comment", {
      postid: postid,
      commentobj: {
        comment: "👍",
        name: myinfodoc.Name,
        username: myinfodoc.UserName,
        time: new Date(),
        like: true, // username && like:true tells frontend on which post to show like:true while mapping with conditional rendering
      },
    });

    //to sync with backend because pagination wont allow to refetch render obj easily

    setallpost((prev) => {
      return prev.map((i) => {
        if (i._id === postid) {
          return {
            ...i,
            CommentsonPost: [
              {
                comment: "👍",
                name: myinfodoc.Name,
                username: myinfodoc.UserName,
                time: new Date(),
                like: true,
                _id: crypto.randomUUID(),
              },
              ...i.CommentsonPost,
            ],
          };
        }

        return i;
      });
    });
  }

  function handleunlike(postid) {
    clientio.emit("unlike", {
      commentobj: {
        username: myinfodoc.UserName,
        like: true,
      },

      postid: postid, //postid goes into findbyidandupdate with $pull query and pulls the obj which matches username and like:true
    });

    // to sync with backend

    setallpost((prev) => {
      return prev.map((i) => {
        if (i._id === postid) {
          return {
            ...i,
            CommentsonPost: i.CommentsonPost.filter(
              (o) => !(o.username === myinfodoc.UserName && o.like),
            ),
          };
        } else {
          return i;
        }
      });
    });
  }

  function handlecomment(postid) {
    if (comment.trim() === "") {
      toast.error("Input field cannot be empty");
      return;
    }

    setcomment("");

    // comment emit

    clientio.emit("comment", {
      postid: postid, //postid goes into findbyidandupdate with $push to push this obj in db document
      commentobj: {
        comment: comment,
        name: myinfodoc.Name,
        username: myinfodoc.UserName,
        time: new Date(),
        like: false,
      },
    });

    // to sync with backend

    setallpost((prev) => {
      return prev.map((i) => {
        if (i._id === postid) {
          return {
            ...i,
            CommentsonPost: [
              {
                comment: comment,
                name: myinfodoc.Name,
                username: myinfodoc.UserName,
                time: new Date(),
                like: false,
                _id: crypto.randomUUID(), //in mongo db this id is allocated automatically
              },
              ...i.CommentsonPost,
            ],
          };
        } else {
          return i;
        }
      });
    });
  }

  return (
    <div>
      {/* 

<div 

            style={{
             height:hidecomment  ?  "380px" : "110px",
              overflowY: "auto",
              transform: "translateY(62px)",
  
            }}


>



</div>


 */}

      <div
        style={{
          marginRight: "10px",
          position: "absolute",

          bottom: hidecomment ? "17.5rem" : "-20px",
          right: 20,
          zIndex: 1,
        }}
      >
        {hidecomment.postid === i._id && (
          <Button
            variant="contained"
            sx={{
              marginRight: "100%",
              position: "absolute",
              right: "10%",
              bottom: "43px",
            }}
            onClick={() => sethidecomment(false)}
          >
            CLOSE
          </Button>
        )}

        {/*hidden checkbox for like  */}
        <input
          type={"checkbox"}
          checked={i.CommentsonPost.some(
            (c) => c.like && c.username === myinfodoc.UserName,
          )}
          style={{
            cursor: "pointer",
            position: "relative",
            top: 5,
            left: "5px",
            appearance: "none",
            height: "45px",
            width: "50px",
            zIndex: 1,
          }}
          onChange={(e) => {
            if (e.target.checked) {
              handlelike(i._id);
            } else {
              handleunlike(i._id);
            }
          }}
        />

        <ThumbUpIcon
          color={
            i.CommentsonPost.some(
              (c) => c.like && c.username === myinfodoc.UserName,
            )
              ? "primary" //primary is just way to give color blue to like icon in material ui so basically its just the controlled input
              : ""
          }
          sx={{
            fontSize: "45px",
            position: "relative",
            right: 42,
            bottom: 10,
          }}
        />

        <CommentIcon
          onClick={() => sethidecomment({ postid: i._id })}
          sx={{
            fontSize: "47px",
            cursor: "pointer",
            position: "relative",
            bottom: 9,
          }}
        />

        <div
          style={{
            display: "flex",
            bottom: 90,
            gap: "15px",
            position: "relative",
          }}
        >
          <div
            style={{
              fontWeight: "800",
              fontSize: "18px",
              borderBottom: "1px solid black",
            }}
          >
            likes:
            {i.CommentsonPost.reduce((acc, i) => acc + Number(i.like), 0)}{" "}
            {/* converts boolean into number */}
          </div>

          <div
            style={{
              fontWeight: "800",
              fontSize: "18px",
              borderBottom: "1px solid black",
            }}
          >
            Comments:
            {i.CommentsonPost.reduce((acc, i) => acc + !i.like, 0)}
          </div>
        </div>
      </div>

      <div
        // style={{
        //   height: hidecomment?.postid === i._id ? "70px" : "0px",

        //   width: "100%",
        // }}

        style={{
          height: hidecomment ? "400px" : "100px",
          // overflowY: "auto",
          transform: "translateY(6rem)",
        }}
      >
        {hidecomment.postid === i._id && (
          <div style={{ height: "15.5rem", overflowY: "auto" }}>
            {i.CommentsonPost.map((c) => {
              return (
                <div key={c._id}>
                  <div
                    style={{
                      display: "flex",
                      margin: "auto",
                      gap: "4px",
                      marginTop: "10px",
                      marginLeft: "8px",
                    }}
                  >
                    {" "}
                    <div>
                      <div
                        style={{
                          height: "2rem",
                          width: "2rem",
                          borderRadius: "100%",
                          background: "pink",
                          textAlign: "center",
                          fontSize: "20px",
                          paddingTop: "3px",
                          fontWeight: "700",
                        }}
                      >
                        {c.name?.split("")[0]}{" "}
                        {/* initial based profile name */}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2,2fr)",
                          width: "250px",
                          fontSize: "11px",
                          fontWeight: "700",
                        }}
                      >
                        <div style={{ width: "7rem", overflowY: "auto" }}>
                          {c.username}
                        </div>

                        <div>
                          {dayjs(c.time).format("DD MMM YYYY, hh:mm A")}
                        </div>

                        <div style={{ width: "7rem", overflowY: "auto" }}>
                          gvbhjnllkmlnjkmhgfcv
                        </div>
                      </div>

                      <div style={{ fontSize: "15px", width: "80%" }}>
                        {c.comment}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {hidecomment.postid === i._id && (
          <div
            style={{
              display: "flex",
              position: "absolute",
              bottom: "6.5rem",
              width: "100%",
              gap: "6px",
            }}
          >
            <textarea
              value={comment}
              placeholder="Comment your thoughts on this post"
              style={{
                border: "1px solid black",

                width: "80%",
                height: "45px",
                marginLeft: "5px",
                outline: "none",
                borderRadius: "10px",
                fontWeight: "700",
                resize: "none",
                background: "rgb(245, 246, 247)",
              }}
              onChange={(e) => {
                setcomment(e.target.value);
              }}
            />

            <Button
              sx={{
                margin: "auto",
                height: "43px",
                marginRight: "5px",
                borderRadius: "10px",
              }}
              variant="contained"
              endIcon={<SendIcon />}
              onClick={() => {
                handlecomment(i._id);
              }}
              style={null}
            >
              SEND
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
