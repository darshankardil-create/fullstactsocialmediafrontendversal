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

//stamp myinfo and post method

const Page = () => {
  const [clientio, setclientio] = useState(null);
  const [allpost, setallpost] = useState([]);
  const [allpostclone, setallpostclone] = useState([]); //clone for filtering my posts
  const [loading, setloading] = useState(false);
  const [jwtpayload, setjwtpayload] = useState(null);
  const [token, settoken] = useState("");
  const [hidepostform, sethidepostform] = useState(false);
  const [myinfodoc, setmyinfodoc] = useState({});
  const [hideprofile, sethideprofile] = useState(false);
  const [userlogout, setuserlogout] = useState(false);
  const [mypostpage, setmypostpage] = useState(false);

  //pagination infinite scroll states

  const [avalableindb, setavalableindb] = useState(true);

  //on scrolling observer detects and run fetchallpost on the basis of viewport and it fetches 2 doc as the limit is 2
  //and virtual scroll renders only as much posts as it fits in viewport u can find virtual scroll logic in PostBody component

  async function fetchallpost() {
    try {
      if (loading || !avalableindb) return;

      setloading(true);

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

        console.log("first", data);

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
      setloading(false);
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

    fetchallpost();

    return () => {
      clientiopass.disconnect();
    };
  }, []);

  console.log(allpost);

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
            toast.error(format.message);
          } else if (res.status === 429) {
            toast.error("Too many req please try again later by getmyinfo");
          }

          toast.error(format.error);
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
      <PostForm
        myinfodoc={myinfodoc}
        loading={loading}
        hidepostform={hidepostform}
        sethidepostform={sethidepostform}
        setloading={setloading}
        clientio={clientio}
      />

      <Header
        sethidepostform={sethidepostform}
        sethideprofile={sethideprofile}
        myinfodoc={myinfodoc}
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
      />

      {/*sentryRef el is for observer of fetch on scroll*/}

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
