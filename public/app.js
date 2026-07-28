const API = "http://localhost:3000/api";
const token = localStorage.getItem("token");

// Router Guard
const protectedPages = ["dashboard.html", "stream.html"];
const currentPage = window.location.pathname.split("/").pop();

if (protectedPages.includes(currentPage) && !token) {
  window.location = "/login.html";
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location = "/login.html";
  });
}

// Socket
const needsSocket =
  document.getElementById("streams") || document.getElementById("messages");
const socket = needsSocket && typeof io !== "undefined" ? io() : null;

let currentUser = null;
const getCurrentUser = async () => {
  if (!token) return null;
  if (currentUser) return currentUser;
  try {
    const response = await fetch(`${API}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (data.success) {
      currentUser = data.user;
      return data.user;
    }
  } catch (error) {
    console.error("Kullanıcı bilgisi alınamadı:", error);
  }
  return null;
};

/* REGISTER */
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const response = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (!data.success) return alert(data.message);
      alert("Kayıt Başarılı!");
      window.location = "/login.html";
    } catch (error) {
      alert("Kayıt hatası");
    }
  });
}

/* LOGIN */
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!data.success) return alert(data.message);

      localStorage.setItem("token", data.token);
      window.location = "/dashboard.html";
    } catch (error) {
      alert("Giriş hatası");
    }
  });
}

/* STREAM KEY GETTER */
const streamKeyBtn = document.getElementById("getStreamKey");
const streamKeyInput = document.getElementById("streamKeyText");
if (streamKeyBtn && streamKeyInput) {
  streamKeyBtn.addEventListener("click", async () => {
    try {
      const response = await fetch(`${API}/users/stream-key`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        streamKeyInput.value = data.streamKey;
        streamKeyInput.type = "text";
      }
    } catch (error) {
      console.error(error);
    }
  });
}

/* LOAD STREAMS */
const streamsContainer = document.getElementById("streams");
const loadStreams = async () => {
  if (!streamsContainer) return;
  try {
    const response = await fetch(`${API}/streams`);
    const data = await response.json();
    streamsContainer.innerHTML = "";

    if (data.streams.length === 0) {
      streamsContainer.innerHTML = `<p class="info-text">Şu an canlı yayın bulunmuyor.</p>`;
      return;
    }

    data.streams.forEach((stream) => {
      const div = document.createElement("div");
      div.className = "stream-card";
      div.innerHTML = `
        <h3>${stream.title}</h3>
        <p>Yayıncı: <strong>${stream.streamerId?.username || "Bilinmeyen Yayıncı"}</strong></p>
        <p class="viewers-count">İzleyiciler: ${stream.viewers >= 0 ? stream.viewers : 0}</p> 
        <a href="/stream.html?id=${stream.streamId || stream._id || stream.id}" class="btn">Yayın İzle</a>
      `;
      streamsContainer.appendChild(div);
    });
  } catch (error) {
    console.error(error);
  }
};

if (streamsContainer) {
  loadStreams();
  if (socket) socket.on("streams-updated", loadStreams);
}

/* WATCH STREAM & FLV PLAYBACK */
const videoElement = document.getElementById("video");
if (videoElement && currentPage === "stream.html") {
  const params = new URLSearchParams(window.location.search);
  const streamId = params.get("id");

  if (socket) socket.emit("join-stream", { streamId });

  if (typeof flvjs !== "undefined" && flvjs.isSupported()) {
    const flvPlayer = flvjs.createPlayer({
      type: "flv",
      url: `http://localhost:8000/live/${streamId}.flv`,
    });
    flvPlayer.attachMediaElement(videoElement);
    flvPlayer.load();
    flvPlayer.play().catch(() => console.log("Etkileşim bekleniyor..."));
  }
}

/* CHAT LOGIC */
const sendMessageBtn = document.getElementById("sendMessage");
const messageInput = document.getElementById("messageInput");
const messagesDiv = document.getElementById("messages");

if (sendMessageBtn && messageInput && socket) {
  const params = new URLSearchParams(window.location.search);
  const streamId = params.get("id");

  const sendMsg = async () => {
    const text = messageInput.value.trim();
    if (!text) return;

    const user = await getCurrentUser();
    socket.emit("send-message", {
      streamId,
      username: user ? user.username : "İzleyici",
      message: text,
    });
    messageInput.value = "";
  };

  sendMessageBtn.addEventListener("click", sendMsg);
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMsg();
  });

  socket.on("new-message", (data) => {
    if (!messagesDiv) return;
    const p = document.createElement("p");
    p.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
    messagesDiv.appendChild(p);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}
