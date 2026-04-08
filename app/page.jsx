"use client";

import { io } from "socket.io-client";

import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import baseurl from "./baseUrl";
import useInfiniteScroll from "react-infinite-scroll-hook";
import ViewProfile from "./../app/components/ViewProfile";
import Header from "./../app/components/header";
import PostForm from "./components/PostForm";
import PostBody from "./components/PostBody";
import CircularProgress from "@mui/material/CircularProgress";

//stamp myinfo and post method

const Page = () => {
  const [clientio, setclientio] = useState(null);
  const [allpost, setallpost] = useState([]);
  const [allpostclone, setallpostclone] = useState([]); //clone for filtering my posts
  const [loading, setloading] = useState(false);
  const [loadingforpost, setloadingforpost] = useState(false);
  const [jwtpayload, setjwtpayload] = useState(null);
  const [token, settoken] = useState("");
  const [hidepostform, sethidepostform] = useState(false);
  const [myinfodoc, setmyinfodoc] = useState({});
  const [hideprofile, sethideprofile] = useState(false);
  const [userlogout, setuserlogout] = useState(false);
  const [mypostpage, setmypostpage] = useState(false);
  const [innerWidth, setinnerWidth] = useState(0);

  //pagination infinite scroll states

  const [avalableindb, setavalableindb] = useState(true);

  //on scrolling observer detects and run fetchallpost on the basis of viewport and it fetches 2 doc as the limit is 2
  //and virtual scroll renders only as much posts as it fits in viewport u can find virtual scroll logic in PostBody component

  async function fetchallpost() {
    try {
      if (loading || !avalableindb) return;

      setloadingforpost(true);

      const limit = 2;

      const skip = allpost.length; //fetch ahead of it skip

      const res = await fetch(
        `${baseurl}/express/getallpost/${skip}/${limit}`,
        {
          method: "GET",
        },
      );

      if (res.ok) {
        const format = await res.json();

        toast.success("Successfully fetched post data");

        const data = format.docsfromUsersPost ?? [];

        if (data.length < limit) {
          toast.error("All doc fetch no doc left in db");
          setavalableindb(false);
        }

        // console.log("first", data);

        setallpost((prev) => [...prev, ...data]);
        setallpostclone((prev) => [...prev, ...data]);

        if (mypostpage) {
          setallpost(() => {
            return allpostclone.filter(
              (i) => i.UserName === myinfodoc.UserName,
            ); // for my page explained in detail in viewprofile component
          });
          toast.success(
            "successfully filter other users post for my post page",
          );
        }
      } else {
        if (res.status === 429) {
          toast.error("Too many req please try again later by getallpost");
          setavalableindb(false);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setloadingforpost(false);
    }
  }

  {
    /*fetch on scroll logic */
  }

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: avalableindb,
    onLoadMore: fetchallpost,
    disabled: !avalableindb, //stops everything like observer etc
    rootMargin: "0px 0px 400px 0px",
  });

  const router = useRouter();

  // fetches all post

  useEffect(() => {
    // make socket connection
    const clientiopass = io(baseurl);

    clientiopass.on("connect", () => {
      setclientio(clientiopass);
    });

    function setlivewidth() {
      setinnerWidth(window.innerWidth);
    }

    setlivewidth();

    window.addEventListener("resize", setlivewidth);

    fetchallpost();

    return () => {
      clientiopass.disconnect();
      window.removeEventListener("resize", setlivewidth);
    };
  }, []);

  // console.log(allpost);

  useEffect(() => {
    function setter() {
      //if token not there redirect user to Sign-in page

      const tokenbylocal = localStorage.getItem("token");

      if (!tokenbylocal) {
        router.push("/Signup");
      }

      settoken(tokenbylocal);
    }

    setter();
  }, [router, userlogout]);

  //to extract payload from token
  //payload includes  document ID from the Userinfo collection

  useEffect(() => {
    if (!token) return;

    async function verifytoken() {
      try {
        const res = await fetch(`${baseurl}/express/verifytoken`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        const format = await res.json();

        if (res.ok) {
          toast.success(`1 ${format.message}`);
          setjwtpayload(format);
        } else {
          if (res.status === 429) {
            toast.error("Too many req please try again later by verifytoken");
            return;
          } else if (res.status === 401) {
            toast.error(`${format.message} please signup again`);
            return;
          }

          console.error(format.error);
          toast.error(format.error);
          toast.error("Failed to extract payload from jwt");
        }
      } catch (error) {
        console.error(error);
      }
    }

    verifytoken();
  }, [token]);

  // use id extarcted from token to get my info  from Userinfo collection

  useEffect(() => {
    if (!jwtpayload) return;

    async function getmyinfo() {
      try {
        const res = await fetch(
          `${baseurl}/express/Userinfodoc/${jwtpayload.payload.id} `,
          {
            method: "GET",
          },
        );

        const format = await res.json();

        if (res.ok) {
          toast.success(`2 ${format.message} by verified token's payload`);
          setmyinfodoc(format.doc);
        } else {
          if (res.status === 404) {
            toast.error(`${format.message} please signup again`);
            router.push("/Signup");
          } else if (res.status === 429) {
            toast.error("Too many req please try again later by getmyinfo");
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    getmyinfo();
  }, [jwtpayload]);

  //to get status of emit via socket.io fail or succeed

  useEffect(() => {
    if (!clientio) return;

    clientio.on("Status", (data) => {
      if (data.status === "successfull") {
        setloading(false);
        sethidepostform(false);
        toast.success("Successfully posted ");
      } else {
        setloading(false);
        sethidepostform(false);
        toast.error(data.message);
      }
    });

    //comment status

    clientio.on("commentStatus", (data) => {
      if (data.status === "successfull") {
        setloading(false);
        toast.success(data.message);
      } else {
        setloading(false);
        toast.error(data.message);
      }
    });

    //unlike status

    clientio.on("unlikeStatus", (data) => {
      if (data.status === "successfull") {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    });
  }, [clientio]);

  return (
    <div
      onClick={() => {
        if (hideprofile) {
          sethideprofile(false);
        }
      }}
    >
      {/* loading  */}

      {loading && (
        <div
          style={{
            position: "fixed",
            zIndex: "3",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            backdropFilter: "blur(10px)",
            pointerEvents: "none",
            cursor: "not-allowed",
          }}
        >
          <CircularProgress
            sx={{ position: "fixed", top: "42%", left: "45%" }}
            size={110}
            disableShrink
            aria-label="Loading…"
          />
        </div>
      )}

      <PostForm
        myinfodoc={myinfodoc}
        hidepostform={hidepostform}
        sethidepostform={sethidepostform}
        loadingforpost={loadingforpost}
        setloadingforpost={setloadingforpost}
        clientio={clientio}
      />

      <Header
        sethidepostform={sethidepostform}
        sethideprofile={sethideprofile}
        myinfodoc={myinfodoc}
        innerWidth={innerWidth}
      />

      <ViewProfile
        sethideprofile={sethideprofile}
        hideprofile={hideprofile}
        myinfodoc={myinfodoc}
        setuserlogout={setuserlogout}
        allpostclone={allpostclone}
        setallpost={setallpost}
        setmypostpage={setmypostpage}
      />

      <PostBody
        allpost={allpost}
        setallpost={setallpost}
        myinfodoc={myinfodoc}
        clientio={clientio}
        innerWidth={innerWidth}
      />

      {/*sentryRef el is observer of fetch on scroll*/}

      <div ref={sentryRef}></div>

      <div
        style={{
          textAlign: "center",
          position: "absolute",
          top: "5rem",
          left: "50%",
          transform: "translate(-50%)",
        }}
      >
        {" "}
        {loading ? "Loading..." : "Scroll to load more"}
      </div>

      {!avalableindb && <p style={{ textAlign: "center" }}>No more posts</p>}

      <div style={{ height: "100px" }}>{/*bottom end empty space */}</div>
    </div>
  );
};

export default Page;
