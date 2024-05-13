const express = require("express");
const fs = require("fs");
const app = express();
app.use(require("express-status-monitor")());
const port = 3000;

//1)streams are used for transferring data from client to server OR server to server.

//2)with the help of streams we divide a file into chunks and it is passed as soon as a chunk is available

//3)Suppose we want to transfer a file of size 1 gb to another file.In this case we are assuming that the server's memory is 1GB.so to pass this file it needs to go through the server memory but we know that the server memmory is only 1 gb so our server in this case will crash because the file used all the memory of the server.

//4)So to prevent this we use streams. From File1 to the server memory we create a readable stream meaning we create chunks of the data we want to transfer.Now in the server these chunks are stored as BUFFER.

//5)BUFFER- It is a physical storage in our memory where data is stored. we can set the size of this buffer and when the size of this buffer is full then the data is transferred to the File2 using Writable streams in chunks of size equal to that buffer.

//6) Now the better way of streaming is to use createReadStream method. Here we use can use pipe which means we are converting a readable stream to writable stream.

//7) req and res are also streams. res is Writable stream and req is Readable stream.

app.get("/", (req, res) => {
  try {
    // This is the BAD way ->
    // const read = fs.readFileSync("myText.txt");
    // console.log(read);
    // res.end(read);

    // This is the BETTER way ->
    // const read = fs.createReadStream("myText.txt");
    // read.pipe(res);

    //Q) Copy the content of a file into output.txt using GOOD way
    const readStream = fs.createReadStream("myText.txt");
    const writeStream = fs.createWriteStream("output.txt");
    readStream.on("data", (chunk) => {
      console.log("chunks:", chunk);
      return writeStream.write(chunk);
    });
    res.end();
  } catch (error) {
    console.error("Error reading file:", error);
    res.status(500).send("Error reading file");
  }
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
