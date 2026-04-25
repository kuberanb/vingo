import User from "./models/user.model.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    // console.log(socket.id);
    socket.on("identity", async ({ userId }) => {
      if (userId) {
        try {
          const user = await User.findByIdAndUpdate(
            userId,
            {
              socketId: socket.id,
              isOnline: true,
            },
            { new: true },
          );
        } catch (error) {
          console.log(error);
        }
      }
    });

    socket.on("disconnect", async () => {
      try {
        const user = User.findOneAndUpdate(
          { socketId: socket.id },
          {
            socketId: null,
            isOnline: false,
          },
        );
      } catch (error) {}
    });
    socket.on("updateLocation", async ({ lattitude, longitude, userId }) => {
      try {
        const user = await User.findByIdAndUpdate(userId, {
          location: { type: "Point", coordinates: [longitude, lattitude] },
          isOnline: true,
          socketId: socket.id,
        });

        if (user) {
          io.on("updateDeliveryLocation", {
            deliveryBoyId: userId,
            lattitude,
            longitude,
          });
        }
      } catch (error) {
        console.log(`updateDeliveryLocation error : `, error);
      }
    });
  });
};
