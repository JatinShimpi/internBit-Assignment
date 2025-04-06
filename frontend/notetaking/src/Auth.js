import { supabase } from "./supabase";

export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error.message);
    return { success: false, message: error.message };
  }

  return { success: true, user: data.user };
};


export const signupUser = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Signup error:", error.message);
    return { success: false, message: error.message };
  }

  return { success: true, user: data.user };
};