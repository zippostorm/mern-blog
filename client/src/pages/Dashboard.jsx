import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="flex flex-grow flex-col md:flex-row">
      {/* Sidebar */}
      <div className="md:w-56">
        <DashSidebar />
      </div>
      <div className="flex-grow h-full">
        {/* Profile */}
        {tab === "profile" && <DashProfile />}
        {/* Posts */}
        {tab === "posts" && <DashPosts />}
      </div>
    </div>
  );
};

export default Dashboard;
