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
