import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchFeed = async (nextCursor = null) => {
    try {
      setLoading(true);
      const url = nextCursor
        ? `/posts/feed?limit=5&lastId=${nextCursor}`
        : "/posts/feed?limit=5";

      const res = await axios.get(url);
      setPosts((prev) => [...prev, ...res.data.results]);
      setCursor(res.data.nextCursor);
    } catch (err) {
      console.error("Failed to fetch feed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <>
      <Navbar />

      {/* Main Feed Layout */}
      <div className="pt-24 pb-12 bg-gray-50 min-h-screen flex justify-center">
        <div className="w-full max-w-2xl px-4">
          {/* Feed Heading */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Latest <span className="text-blue-500">Posts</span>
            </h2>
            <span className="text-sm text-gray-500">
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </span>
          </div>

          {/* Feed Content */}
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post._id} post={post} />)
            ) : (
              <div className="text-center text-gray-500 mt-10">
                {loading ? "Loading posts..." : "No posts yet!"}
              </div>
            )}
          </div>

          {/* Load More Button */}
          {cursor && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => fetchFeed(cursor)}
                disabled={loading}
                className={`px-6 py-2 rounded-lg text-white font-semibold transition-all ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-700 hover:bg-gray-800"
                }`}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
