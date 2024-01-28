import User from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import { handleMongoError } from "../utlis/error.js";
import jwt from "jsonwebtoken";

export const createUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  const salt = parseInt(process.env.SALT);
  const hashedPassword = bcryptjs.hashSync(password, salt);
  const user = new User({
    username,
    email,
    password: hashedPassword,
    role: "user",
  });

  try {
    await user.save();
    const userChanged = user.toObject();
    delete userChanged.password;

    const token = jwt.sign({ user: userChanged._id }, process.env.JWTTOKEN, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(201).json({
      message: "User Created",
      status: "201",
      user: userChanged,
      token,
    });
  } catch (err) {
    next(handleMongoError(err, "401", "User Not Created"));
  }
};

export const findUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: "User not Found", status: "401" });
    }

    const comparePassword = bcryptjs.compareSync(password, user.password);
    if (!comparePassword) {
      res.status(401).json({
        message: "User not Found please check the details once more",
        status: "401",
      });
    }

    const userChanged = user.toObject();

    delete userChanged.password;
    const token = jwt.sign({ user: userChanged._id }, process.env.JWTTOKEN, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res
      .status(200)
      .json({ message: "User Found", status: "200", user: userChanged, token });
  } catch (err) {
    next(err);
  }
};

export const allUsers = async (req, res, next) => {
  try {
    const user = await User.find({}, { username: 1, _id: 1 });

    res.status(200).json({ message: "User Found", status: "200", user });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  const userId = req.body.userId;
  const updates = req.body;

  try {
    const updateFields = {};
    for (const key in updates) {
      if (updates.hasOwnProperty(key) && key !== "userId") {
        updateFields[key] = updates[key];
      }
    }

    let hashedPassword = "";
    if (
      updateFields.hasOwnProperty("password") &&
      updateFields["password"] !== ""
    ) {
      const salt = parseInt(process.env.SALT);
      hashedPassword = bcryptjs.hashSync(updateFields["password"], salt);
      updateFields["password"] = hashedPassword;
    } else {
      delete updateFields["password"];
    }

    const user = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    if (!user) {
      res.status(404).json({ message: "User not Found", status: "404" });
      return;
    }

    const userChanged = user.toObject();
    delete userChanged.password;

    res
      .status(200)
      .json({ message: "User Updated", status: "200", user: userChanged });
  } catch (err) {
    next(err);
  }
};
