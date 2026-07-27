const {
  getStream,
  getAllStreams,
  updateViewerCount,
} = require("../services/streamService");

module.exports = (io) => {
  io.on("connection", (socket) => {
    let currentStreamId = null;

    socket.on("join-stream", async ({ streamId }) => {
      try {
        const stream = await getStream(streamId);
        if (!stream || !stream.isLive) {
          return socket.emit("stream-not-found");
        }

        currentStreamId = streamId;
        await updateViewerCount(streamId, 1);
        socket.join(streamId);

        io.to(streamId).emit("new-viewer", {
          viewersCount: stream.viewers + 1,
        });

        const streams = await getAllStreams();
        io.emit("streams-updated", streams);
      } catch (error) {
        console.error("Socket Join Error:", error.message);
      }
    });

    socket.on("send-message", ({ streamId, username, message }) => {
      io.to(streamId).emit("new-message", {
        username,
        message,
        createdAt: new Date(),
      });
    });

    socket.on("disconnect", async () => {
      try {
        if (currentStreamId) {
          await updateViewerCount(currentStreamId, -1);

          const streams = await getAllStreams();
          io.emit("streams-updated", streams);
        }
      } catch (error) {
        console.error("Socket Disconnect Error:", error.message);
      }
    });
  });
};
