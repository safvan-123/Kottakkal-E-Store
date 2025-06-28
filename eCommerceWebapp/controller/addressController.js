import Address from "../models/address.js";

export const saveOrUpdateAddress = async (req, res) => {
  try {
    const data = req.body;
    const userId = req.user._id;

    const updated = await Address.findOneAndUpdate(
      { user: userId },
      { ...data, user: userId },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, address: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const address = await Address.findOne({ user: userId });
    res.status(200).json({ success: true, address });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
