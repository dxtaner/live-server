const express = require("express");
const {
  getAllStreams,
  createOrUpdateStream,
} = require("../services/streamService");

module.exports = (io) => {
  const router = express.Router();

  router.get("/streams", async (req, res) => {
    try {
      const streams = await getAllStreams();
      res.json({ success: true, streams });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.post("/media-webhook", async (req, res) => {
    try {
      const { action, streamKey, streamerId, username } = req.body;

      if (action === "postPublish") {
        await createOrUpdateStream({
          streamId: streamKey,
          streamerId,
          title: `${username} Canlı Yayını`,
          isLive: true,
        });
      } else if (action === "donePublish") {
        await createOrUpdateStream({
          streamerId,
          isLive: false,
        });
        io.to(streamKey).emit("stream-ended");
      }

      const updatedStreams = await getAllStreams();
      io.emit("streams-updated", updatedStreams);

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  return router;
};
