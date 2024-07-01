const path = require("path");
const prisma = require("../../../config/prisma.config");
const imagekit = require("../../../libs/imagekit");

async function updateAvatarService(avatar) {
  try {
    const fileBase64 = avatar.buffer.toString("base64");

    const response = await imagekit.upload({
      fileName: Date.now() + path.extname(avatar.originalname),
      file: fileBase64,
      folder: "avatars",
    });

    const fileUrl = response.url;

    ;

    return prisma.users.update({
      where: {
        id: parseInt(avatar.userId),
      },
      data: {
        avatar_link: fileUrl,
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

// async function updateProfileService(userId, data) {
//   try {
//     // if (data.created_at) {
//     //   delete data.created_at;
//     // }
//     return prisma.users.update({
//       where: {
//         id: parseInt(userId),
//       },
//       data ,
//     });
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }

async function updateProfileService(userId, data) {
  try {
    return await prisma.users.update({
      where: {
        id: parseInt(userId),
      },
      data,
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = { updateAvatarService, updateProfileService };
