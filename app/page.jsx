"use client";
import { io } from "socket.io-client";

import toast from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import baseurl from "./baseUrl";

import ViewProfile from "./../app/components/ViewProfile";
import Header from "./../app/components/header";
import PostForm from "./components/PostForm";
import PostBody from "./components/PostBody";

//stamp myinfo and post method

const Page = () => {
  const [clientio, setclientio] = useState("");
  const [allpost, setallpost] = useState([]);
  const [loading, setloading] = useState(false);
  const [jwtpayload, setjwtpayload] = useState(null);
  const [token, settoken] = useState("");
  const [hidepostform, sethidepostform] = useState(false);
  const [myinfodoc, setmyinfodoc] = useState({});
  const [hideprofile, sethideprofile] = useState(false);
  const [userlogout, setuserlogout] = useState(false);

  //pagination infinite scroll states

  const [avalableindb, setavalableindb] = useState(true);

  //on scrolling 80% of innerHeight fetch 1 doc from UsersPost collection because the limit is 1

  async function fetchallpost() {
    try {
      if (loading) return;

      setloading(true);

      const limit = 1;

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

        if (format?.message === "no post found") {
          toast.error("No posts found. Post something to explore the app");
        }

        setavalableindb(format.availabledoc);

        console.log("first", data);

        setallpost((prev) => [...prev, ...data]);

        if (setavalableindb < limit) {
          setavalableindb(false); //if no doc left stop fetching
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
    }
  }

  const router = useRouter();

  // fetches all post

  useEffect(() => {
    // make socket connection
    const clientiopass = io("http://localhost:3000");

    clientiopass.on("connect", () => {
      setclientio(clientiopass);
    });

    fetchallpost();
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
      <InfiniteScroll
        dataLength={allpost.length}
        next={fetchallpost}
        hasMore={avalableindb} //stop fetchin if no doc left
        loader={<h4>Loading...</h4>}
        endMessage={<p style={{ textAlign: "center" }}>No more posts</p>}
        scrollThreshold="80%" //fetch data when user scroll 80% of innerHeight
      ></InfiniteScroll>

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
      />

      <PostBody
        allpost={allpost}
        setallpost={setallpost}
        myinfodoc={myinfodoc}
        clientio={clientio}
      />

      <div style={{ height: "250px" }}>{/*bottom end empty space */}</div>
    </div>
  );
};

export default Page;
