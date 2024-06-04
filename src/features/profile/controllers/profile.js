const {
  updateAvatarService,
  updateProfileService,
} = require("../services/profile");

async function updateAvatar(req, res) {
  try {
    const avatar = req.file;

    if (!avatar) {
      return res.status(400).json({
        status: "error",
        message: "Avatar file is missing.",
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(400).json({
        status: "error",
        message: "User ID is missing.",
      });
    }

    // Attach userId to the avatar object
    avatar.userId = req.user.id;

    const fileUrl = await updateAvatarService(avatar);

    res.status(200).json({
      status: "success updated avatar",
      data: {
        avatar: fileUrl,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const data = req.body;

    if (data.created_at) {
      delete data.created_at;
    }

    const user = await updateProfileService(userId, data);

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

module.exports = { updateAvatar, updateProfile };
