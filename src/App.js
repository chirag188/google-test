import React, { useEffect, useState } from "react";
import { Hub, Auth } from "aws-amplify";
import "./App.css";
import UserHome from "./UserHome";
import Landing from "./Landing";
function App() {
  // init state to store user and show loader
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // get user
  async function getUser() {
    try {
      const token = await Auth.currentAuthenticatedUser();
      setLoading(false);
      setUser(token);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }
  //listen for sign in + out events, if neither are happening check if user exists
  useEffect(() => {
    Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signIn") {
        return getUser();
      }
      if (payload.event === "signOut") {
        setUser(null);
        return setLoading(false);
      }
    });
    getUser();
  }, []);

  // show loading screen while fetching, otherwise return page
  // if (loading) return <Loader />;
  return (
    <div className="App">
      {loading ? <div>loading</div> : null}
      {user ? <UserHome email={user.attributes.email} /> : <Landing />}
    </div>
  );
}
export default App;
