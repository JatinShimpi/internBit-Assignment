// ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useNavigate } from "react-router";
// your Supabase client

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setAuthenticated(true);
      } else {
        navigate("/");
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (!authenticated) return null;

  return children;
};

export default ProtectedRoute;
