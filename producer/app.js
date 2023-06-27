const express = require("express");
const amqp = require("amqplib");
const app = express();
const PORT = 4001;

var channel, connection;  //global variables
var t = 0;
async function connectQueue() {
    try {
        connection = await amqp.connect("amqps://xvpsimiz:Lhs1PQyvSRvqHnvub1lQdwEz_Bgx06dW@rattlesnake.rmq.cloudamqp.com/xvpsimiz");
        channel = await connection.createChannel()

        await channel.assertQueue("test-queue")

    } catch (error) {
        console.log(error)
    }
}
connectQueue();

async function sendData(data) {
    // send data to queue
    await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(data)));

    // close the channel and connection
    // await channel.close();
    // await connection.close();
}

app.use(express.json());
app.get("/send-msg", async(req, res) => {

    // data to be sent
    t++;
    const data = {
        t:t,
        author: "Leigh Burdugo"
    }
    await sendData(data);  // pass the data to the function we defined
    console.log("A message is sent to queue")
    res.send("Message Sent"); //response to the API request
});
app.get('/close',async ()=>{
    await channel.close();
    await connection.close();
})

app.listen(PORT, () => {
    console.log("Server started on port:", PORT);
});
