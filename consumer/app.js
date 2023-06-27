const express = require("express");
const amqp = require("amqplib");
const app = express();
const PORT = 4002;

var channel, connection;  //global variables
async function connectQueue() {
    try {
        connection = await amqp.connect("amqps://xvpsimiz:Lhs1PQyvSRvqHnvub1lQdwEz_Bgx06dW@rattlesnake.rmq.cloudamqp.com/xvpsimiz");
        channel = await connection.createChannel()

        await channel.assertQueue("test-queue")

        channel.consume("test-queue", data => {
            console.log(`${Buffer.from(data.content)}`);
            channel.ack(data);
        })
    } catch (error) {
        console.log(error);
    }
}
connectQueue();

app.use(express.json());
app.get("/send-msg", (req, res) => {

    // data to be sent
    const data = {
        title: "Six of Crows",
        author: "Leigh Burdugo"
    }
    sendData(data);  // pass the data to the function we defined
    console.log("A message is sent to queue")
    res.send("Message Sent"); //response to the API request

})

app.listen(PORT, () => {
    console.log("Server started on port:", PORT);
});
