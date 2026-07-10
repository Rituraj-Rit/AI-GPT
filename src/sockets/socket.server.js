// npm install socket.io

const { Server } = require("socket.io");

// Day - 151
// npm i cookie
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.mode");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require("../services/vector.service");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  // Day - 151
  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.token) {
      return next(new Error("Authentication error: No token provided"));
    }
    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);

      const user = await userModel.findById(decoded.id);

      socket.user = user;

      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("ai-message", async (messagePayload) => {
      if (typeof messagePayload === "string") {
        messagePayload = JSON.parse(messagePayload);
      }

      // 1. Save user message
      const message = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: messagePayload.contents,
        role: "user",
      });

      // 2. Generate vector
      const vectors = await aiService.generateVector(messagePayload.contents);

      // console.log(vectors);

      const memory = await queryMemory({
        queryVector: vectors,
        limit: 3,
        metadata: {
          user: socket.user._id.toString(),
        },
      });

      console.log(memory);

      await createMemory({
        vectors,
        messageId: message._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id.toString(),
          text: messagePayload.contents,
        },
      });

      console.log(memory);

      // 3. Get latest chat history
      let chatHistory = await messageModel
        .find({ chat: messagePayload.chat })
        .sort({ createdAt: 1 }) // oldest -> newest
        .lean();
      let stm;

      if (chatHistory.length === 0) {
        stm = [
          {
            role: "user",
            parts: [{ text: messagePayload.contents }],
          },
        ];
      } else {
        stm = chatHistory.map((item) => ({
          role: item.role,
          parts: [{ text: item.content }],
        }));
      }

      const ltm = [
        {
          role: "user",
          parts: [
            {
              text: `These are some previous memories:\n${memory
                .map((item) => item.metadata.text)
                .join("\n")}`,
            },
          ],
        },
      ];

      console.log(ltm, stm)
      // 5. Gemini response

      const contents = [...ltm, ...stm];
      const response = await aiService.generateResponse(contents);

      const responseMessage = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: response,
        role: "model",
      });

      const responseVectors = await aiService.generateVector(response);

      await createMemory({
        vectors: responseVectors,
        messageId: responseMessage._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: response,
        },
      });
      // 7. Send response
      socket.emit("ai-response", {
        chat: messagePayload.chat,
        content: response,
      });
    });
  });
}

module.exports = initSocketServer;
