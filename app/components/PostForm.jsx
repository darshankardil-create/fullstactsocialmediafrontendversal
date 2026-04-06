import { Activity } from "react";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { CldUploadWidget } from "next-cloudinary";
import SendIcon from "@mui/icons-material/Send";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState, useEffect } from "react";

const PostForm = ({
  myinfodoc,
  loading,
  sethidepostform,
  hidepostform,
  setloading,
  clientio,
}) => {
  const [highlightonempty, sethighlightonempty] = useState("");
  const [textofarea, settextofarear] = useState("");
  const [pimgurl, setpimgurl] = useState([]); //uploaded file's public url

  useEffect(() => {
    function recoveruploaded() {
      //get uploaded file if exist from local

      const uploded = localStorage.getItem("uploaded");

      if (uploded) setpimgurl(JSON.parse(uploded));
    }

    recoveruploaded();
  }, []);

  //stores uploaded fiels public url
  useEffect(() => {
    if (pimgurl.length === 0) return;
    localStorage.setItem("uploaded", JSON.stringify(pimgurl));
  }, [pimgurl]);

  //post logic

  function send() {
    //validation

    if (textofarea.trim() === "") {
      toast.dismiss();

      toast.error("Input cannot be empty!", {
        duration: 3000,
      });

      sethighlightonempty("2px solid red");

      return;
    }

    setloading(true);

    const imgurl = pimgurl;
    const messageforpost = textofarea.trim();
    const Username = myinfodoc.UserName;
    const name = myinfodoc.Name;

    //post emit

    clientio.emit("post message", {
      messageforpost,
      imgurl,
      Username,
      name,
    });
  }

  function clear() {
    localStorage.removeItem("uploaded");
    settextofarear("");
    setpimgurl([]);
  }

  return (
    <div>
      <Activity mode={hidepostform ? "visible" : "hidden"}>
        <div
          style={{
            pointerEvents: loading ? "none" : "",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "80%",
            height: "35rem",
            background: "rgb(240, 240, 242)",
            display: "grid",
            placeItems: "center",
            maxWidth: "700px",
            borderRadius: "20px",
            boxShadow: "15px 15px 35px rgba(3, 3, 2)",
            zIndex: "2",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 5,
              fontSize: "30px",
              width: "30px",
              borderRadius: "5px",
              textAlign: "center",
              color: "black",
              cursor: "pointer",
            }}
            onClick={() => sethidepostform(false)}
          >
            X
          </div>

          <div
            style={{
              position: "absolute",
              zIndex: 2,
              display: "flex",
              gap: "20px",
              background: "rgb(51, 214, 95)",
              width: "100%",
              justifyContent: "flex-start",
              alignItems: "center",
              height: "60px",
              top: "7%",
              overflowX: "auto",
              paddingLeft: "10px",
            }}
          >
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
                }}
              >
                {myinfodoc?.Name?.split("")[0] ?? ""}{" "}
                {/* initial based profile name */}
              </div>
            </div>

            <div style={{ flexShrink: 0, fontWeight: "700" }}>
              {myinfodoc.UserName}
            </div>

            <div
              style={{ flexShrink: 0, marginRight: "1rem", fontWeight: "700" }}
            >
              {myinfodoc.Name}
            </div>
          </div>

          <textarea
            value={textofarea}
            style={{
              width: "90%",
              resize: "none",
              background: "rgb(241, 242, 237)",
              height: "50%",
              outline: "none",
              position: "absolute",
              top: "20%",
              border: `${highlightonempty}`,
            }}
            onChange={(e) => {
              settextofarear(e.target.value);

              sethighlightonempty("");
            }}
          />

          <div style={{ position: "absolute", left: 20, top: "26.5rem" }}>
            {pimgurl.length}/4
          </div>

          <div
            style={{
              height: "6rem",
              width: "100%",
              top: "73%",
              border: "0.5px solid black",
              position: "absolute",
              overflowX: "auto",
              display: "flex",
              gap: "3rem",
              paddingLeft: "1.25rem",
            }}
          >
            {pimgurl.map((i, ind) => {
              return (
                <div key={ind}>
                  <div
                    onClick={() => {
                      const c = confirm(
                        "Are you sure you want to remove this file",
                      );
                      if (!c) return;
                      setpimgurl(
                        (prev) => prev.filter((o) => o !== i), //remove attached file logic
                      );
                    }}
                    title="Click to delete"
                    style={{
                      backgroundColor: "rgb(239, 68, 68)",
                      height: "2.5rem",
                      width: "2rem",
                      position: "relative",
                      top: "2.5rem",
                      cursor: "pointer",
                      zIndex: 5,
                      color: "white",
                      fontWeight: "900",
                      textAlign: "center",
                      paddingTop: "0.375rem",
                      border: "1px solid black",
                    }}
                  >
                    x
                  </div>

                  {/* Filename */}
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "rgb(23, 37, 84)",
                      paddingTop: "0.375rem",
                      overflowY: "auto",
                      width: "7.5rem",
                      height: "2.5rem",
                      paddingLeft: "2.5rem",
                      position: "relative",
                      backgroundColor: "rgb(255, 251, 235)",
                      border: "0.5px solid black",
                    }}
                  >
                    {i.split("/")[7]}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              overflowX: "auto",
              position: "absolute",
              bottom: "10px",
              gap: "30px",
              width: "100%",
              height: "50px",
              paddingTop: "10px",
              justifyContent: "flex-start",
            }}
          >
            <div style={{ marginLeft: "20px" }}>
              <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={() => {
                  const c = confirm(
                    "This action will clear the entire input field and uploaded files.",
                  );
                  if (c) {
                    clear();
                  }
                }}
              >
                Clear
              </Button>
            </div>

            <div style={{ minWidth: "162px" }}>
              <CldUploadWidget
                uploadPreset="ml_default"
                options={{ multiple: true, maxFiles: 4 }}
                onSuccess={(s) =>
                  setpimgurl((prev) => [...prev, s.info.secure_url])
                }
              >
                {({ open }) => {
                  return (
                    <Button
                      onClick={() => {
                        if (pimgurl.length > 4) {
                          toast.error(
                            "Can't upload more then 4 files for 1 post ",
                          );
                          return;
                        }

                        open();
                      }}
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload files
                    </Button>
                  );
                }}
              </CldUploadWidget>
            </div>

            <div style={{ marginRight: "15px" }}>
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={send}
                style={{ background: loading ? "gray" : "" }}
              >
                {loading ? "loading..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </Activity>
    </div>
  );
};

export default PostForm;
