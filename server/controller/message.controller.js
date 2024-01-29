import Message from "../model/message.model.js";

export const getMessages = async (req, res) => {
  try {
    const userId = req.params.userId;
    const openedUserId = req.params.openedUserId;

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: openedUserId },
        { sender: openedUserId, recipient: userId },
      ],
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMessage = async (req, res) => {
  const message = new Message({
    sender: req.body.sender,
    recipient: req.body.recipient,
    message: req.body.message,
    group: req.body.group,
  });

  try {
    const newMessage = await message.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
