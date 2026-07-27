const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const NodeMediaServer = require("node-media-server");
const mongoose = require("mongoose");
const Stream = require("../src/models/Stream");
const User = require("../src/models/User");

const mongoUri =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/live-stream";
mongoose.connect(mongoUri).then(() => {
  console.log("MongoDB Connected Successfully");
});

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 8000,
    mediaroot: "./media",
    allow_origin: "*",
  },
};

const nms = new NodeMediaServer(config);
nms.run();
console.log("RTMP Server Running");

function findStreamPath(id, streamPath) {
  if (typeof streamPath === "string" && streamPath.startsWith("/"))
    return streamPath;
  if (typeof id === "string" && id.startsWith("/")) return id;

  const obj =
    id && typeof id === "object"
      ? id
      : streamPath && typeof streamPath === "object"
        ? streamPath
        : null;

  if (obj) {
    if (obj.publishStreamPath) return obj.publishStreamPath;
    if (obj.publishToPath) return obj.publishToPath;
    if (obj.path) return obj.path;
    if (obj.req && obj.req.url) return obj.req.url;

    for (const key in obj) {
      if (typeof obj[key] === "string" && obj[key].startsWith("/live/")) {
        return obj[key];
      }
    }
  }
  return null;
}

nms.on("postPublish", async (id, streamPath, args) => {
  try {
    const actualPath = findStreamPath(id, streamPath);

    if (!actualPath) {
      console.log("--- YAYIN YOLU BULUNAMADI, DETAYLI ANALİZ ---");
      console.log(
        "Gelen id tipi:",
        typeof id,
        id ? id.constructor.name : "null",
      );
      console.log("Gelen streamPath tipi:", typeof streamPath);
      return;
    }

    console.log("STREAM PATH:", actualPath);

    const streamKey = actualPath.split("/")[2];
    console.log("STREAM KEY:", streamKey);

    const user = await User.findOne({ streamKey });

    if (!user) {
      console.log("INVALID STREAM KEY");
      return;
    }

    await Stream.findOneAndUpdate(
      { streamerId: user._id },
      {
        streamId: streamKey,
        streamerId: user._id,
        title: `${user.username} Live Stream`,
        isLive: true,
      },
      {
        upsert: true,
        new: true,
      },
    );

    console.log("LIVE CREATED:", user.username);
  } catch (error) {
    console.log("POST PUBLISH ERROR:", error.message);
  }
});

nms.on("donePublish", async (id, streamPath, args) => {
  try {
    const actualPath = findStreamPath(id, streamPath);
    if (!actualPath) return;

    const streamKey = actualPath.split("/")[2];

    await Stream.findOneAndUpdate({ streamId: streamKey }, { isLive: false });

    console.log("STREAM ENDED:", streamKey);
  } catch (error) {
    console.log("DONE PUBLISH ERROR:", error.message);
  }
});
