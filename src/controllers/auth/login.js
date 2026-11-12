import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  getUserByEmail,
  updateUserLastLogin,
  createUser,
} from "../../db/queries.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "User not found.",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    await updateUserLastLogin(user.id);

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN USER ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

const logout = async (req, res) => {
  console.log("Raw cookie header:", !!req.headers.cookie);
  console.log("Parsed cookies:", req.cookies);
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
};

const createNewUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    const [user] = await getUserByEmail(email);
    if (user) {
      console.log("user already exists");
      return res.status(400).json({ message: "user already exists" });
    }
    console.log("creating user");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashing password");
    const [newUser] = await createUser({
      name: name,
      email: email,
      password: hashedPassword,
    });
    console.log("new user", newUser);
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    console.log("token", token);
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("CREATE USER ERROR:", error);
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res
        .status(400)
        .json({ message: "An account with this email already exists." });
    }
    return res.status(500).json({
      message: error.message,
    });
  }
};

export { login, logout, createNewUser };
