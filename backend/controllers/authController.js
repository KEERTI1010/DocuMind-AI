const { createClient } = require("@supabase/supabase-js");
const { supabaseAdmin } = require("../config/supabase");
const { supabase } = require("../config/supabaseClient");
const supabaseUrl = process.env.SUPABASE_URL;
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function register(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.FRONTEND_URL || "http://localhost:5173"}/login`,
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      message: "Registration successful. Please confirm your email if required.",
      user: { id: data.user?.id, email: data.user?.email },
    });
  } catch (err) {
    return res.status(500).json({ error: "Registration failed" });
  }
}

async function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_in: data.session.expires_in,
      user: { id: data.user.id, email: data.user.email },
    });
  } catch (err) {
    return res.status(500).json({ error: "Login failed" });
  }
}

async function me(req, res) {
  return res.json({ user: { id: req.user.id, email: req.user.email } });
}

async function logout(req, res) {
  const token = req.accessToken;

  if (!token) {
    return res.status(401).json({ error: "Missing or invalid authorization token" });
  }

  try {
    const { error } = await supabaseAdmin.auth.admin.signOut(token, "global");

    if (error) {
      return res.status(500).json({ error: "Logout failed" });
    }

    return res.json({ message: "Logout successful" });
  } catch (err) {
    return res.status(500).json({ error: "Logout failed" });
  }
}

module.exports = { register, login, me, logout };
