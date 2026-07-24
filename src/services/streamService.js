const Stream = require("../models/Stream");

const createOrUpdateStream = async ({
  streamId,
  streamerId,
  title,
  isLive,
}) => {
  return await Stream.findOneAndUpdate(
    { streamerId },
    { streamId, streamerId, title, isLive },
    { upsert: true, new: true },
  );
};

const getStream = async (streamId) => {
  return await Stream.findOne({ streamId });
};

const getAllStreams = async () => {
  return await Stream.find({ isLive: true }).populate(
    "streamerId",
    "username avatar",
  );
};

const updateViewerCount = async (streamId, amount) => {
  return await Stream.findOneAndUpdate(
    { streamId },
    { $inc: { viewers: amount } },
    { new: true },
  );
};

module.exports = {
  createOrUpdateStream,
  getStream,
  getAllStreams,
  updateViewerCount,
};
