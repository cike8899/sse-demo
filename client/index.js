async function fetchData() {
  const response = await fetch("/sse", {
    method: "POST",
    headers: {
      "Content-Type": "text/event-stream",
    },
    body: JSON.stringify({
      user_id: 123,
    }),
  });
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    console.log("Received:", value);
  }
}

async function fetchDataNext() {
  fetch("/sse")
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

window.fetchData = fetchData;
window.fetchDataNext = fetchDataNext;
