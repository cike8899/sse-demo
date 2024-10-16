import { EventSourceParserStream } from "eventsource-parser/stream";
import doc from "./api.md";

async function fetchData(url, body = {}) {
  const response = await fetch(url || "/sse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const reader = response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new EventSourceParserStream())
    .getReader();
  const logItem = document.createElement("p");
  document.getElementById("container").appendChild(logItem);
  while (true) {
    const { value, done } = await reader.read();
    console.info("stream:", value);
    try {
      const val = JSON.parse(value.data);
      const d = val?.data;
      if (typeof d !== "boolean") {
        console.log("Received:", d);
        logItem.textContent = d?.answer || "";
      }
    } catch (e) {
      console.warn(e);
    }
    if (done) break;
  }
}

async function fetchDataNext(url, body = {}) {
  fetch(url || "/sse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "IjUxOGFjNTU0MTI2MTExZWZhODlhZmExNjNlMTk3MTk4Ig.ZkQbSg.82kgkMY9dgibqL9DNjPaNfHTjIU",
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      // Get the readable stream from the response body
      const stream = response.body;
      // Get the reader from the stream
      const reader = stream.getReader();
      // Define a function to read each chunk
      const readChunk = () => {
        // Read a chunk from the reader
        reader
          .read()
          .then(({ value, done }) => {
            // Check if the stream is done
            if (done) {
              // Log a message
              console.log("Stream finished");
              // Return from the function
              return;
            }
            // Convert the chunk value to a string
            const chunkString = new TextDecoder().decode(value);
            // Log the chunk string
            console.log("Received:", chunkString);
            // Read the next chunk
            readChunk();
          })
          .catch((error) => {
            // Log the error
            console.error(error);
          });
      };
      // Start reading the first chunk
      readChunk();
    })
    .catch((error) => {
      // Log the error
      console.error(error);
    });
}

async function fetchDataWithPureSse() {
  const source = new EventSource("/sse");
  source.onopen = function () {
    console.log("Connection to the server was opened.");
  };

  source.onmessage = function (event) {
    console.log("Received:", event.data);
    const logItem = document.createElement("p");
    logItem.textContent = event.data;
    document.getElementById("container").appendChild(logItem);
  };

  source.onerror = function (error) {
    console.error("Error occurred:", error);
  };
}

async function fetchDataAgain() {
  fetchData("/stream");
}

async function sendMsg() {
  fetchData("/v1/conversation/completion", {
    conversation_id: "1dd1f9b011cd11ef827afa163e197198",
    messages: [
      {
        content: "Hi! I'm your assistant, what can I do for you?",
        role: "assistant",
      },
      { content: "汽车", role: "user" },
      {
        content:
          "您好！您提到了“汽车”，这是一个非常广泛的话题。汽车是现代生活中非常重要的交通工具，它们可以用于个人出行、货物运输等。如果您有关于汽车的具体问题或者想要了解的信息，请详细说明，我会尽力为您提供帮助。根据您提供的知识库内容，这里包含了一些与汽车相关的信息：1.美国纯电及插混汽车月度注册量情况：展示了纯电动车和插混电动车的注册量占比以及同比和环比数据 ##0$$。2.国内月度新能源汽车渗透率：显示了从2018年到2023年新能源汽车在国内的渗透率趋势 ##1$$。3.新能源汽车销量风险提示：包括销量不及预期和技术升级进度不及预期的风险 ##2$$。4.新车型发布和新能源汽车批售销量数据：提到了一些新车型的发布和2023年1-4月新能源汽车的销量累计数据 ##3$$。5.乘联会预计新能源乘用车厂商批发销量：提供了一些主要车企的批发销量预估排名。6.新能源汽车行业评级和市场动态：包括工信部发布的“双积分",
        role: "assistant",
      },
      { role: "user", content: "电池" },
    ],
  });
}

function loadMd() {
  console.log("🚀 ~ loadMd ~ doc:", doc);

  return doc;
}

window.fetchData = fetchData;
window.fetchDataNext = fetchDataNext;
window.fetchDataWithPureSse = fetchDataWithPureSse;
window.fetchDataAgain = fetchDataAgain;
window.sendMsg = sendMsg;
window.loadMd = loadMd;
