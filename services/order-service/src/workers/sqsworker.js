import "dotenv/config";

import sqsClient from "../config/sqs.js";
import snsClient from "../config/sns.js";

import {
  ReceiveMessageCommand,
  DeleteMessageCommand
} from "@aws-sdk/client-sqs";

import {
  PublishCommand
} from "@aws-sdk/client-sns";


const QUEUE_URL = process.env.AWS_SQS_QUEUE_URL;
const SNS_TOPIC_ARN = process.env.AWS_SNS_TOPIC_ARN;


// ==========================================
// PROCESS SQS MESSAGES
// ==========================================

const processMessages = async () => {
  try {

    const response = await sqsClient.send(
      new ReceiveMessageCommand({
        QueueUrl: QUEUE_URL,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20,
        VisibilityTimeout: 30
      })
    );


    // ------------------------------------------
    // NO MESSAGES AVAILABLE
    // ------------------------------------------

    if (!response.Messages || response.Messages.length === 0) {
      return;
    }


    // ------------------------------------------
    // PROCESS EVERY MESSAGE
    // ------------------------------------------

    for (const message of response.Messages) {
      try {

        const event = JSON.parse(message.Body);


        console.log(
          "Received SQS event:",
          event
        );


        // ==========================================
        // HANDLE ORDER_CREATED EVENT
        // ==========================================

        if (event.eventType === "ORDER_CREATED") {

          console.log(
            "Processing ORDER_CREATED:",
            event.orderId
          );


          console.log(
            "Order details:",
            {
              userId: event.userId,
              totalPrice: event.totalPrice,
              totalItems: event.totalItems,
              paymentMethod: event.paymentMethod
            }
          );


          // ------------------------------------------
          // PUBLISH NOTIFICATION TO AWS SNS
          // ------------------------------------------

          await snsClient.send(
            new PublishCommand({
              TopicArn: SNS_TOPIC_ARN,

              Subject: "ShopKart Order Created",

              Message: `New order created successfully.

Order ID: ${event.orderId}
User ID: ${event.userId}
Total Items: ${event.totalItems}
Total Price: ₹${event.totalPrice}
Payment Method: ${event.paymentMethod}
Created At: ${event.createdAt}`
            })
          );


          console.log(
            "ORDER_CREATED notification sent to SNS"
          );
        }


        // ==========================================
        // DELETE MESSAGE ONLY AFTER SUCCESS
        // ==========================================

        await sqsClient.send(
          new DeleteMessageCommand({
            QueueUrl: QUEUE_URL,
            ReceiptHandle: message.ReceiptHandle
          })
        );


        console.log(
          "SQS message processed and deleted"
        );


      } catch (messageError) {

        console.error(
          "Error processing SQS message:",
          messageError
        );

        // Message is NOT deleted.
        // SQS can make it available again later.
      }
    }


  } catch (error) {

    console.error(
      "SQS worker error:",
      error.message
    );
  }
};


// ==========================================
// START WORKER
// ==========================================

console.log("SQS Worker started...");


// Run immediately once
processMessages();


// Continue polling for messages
setInterval(
  processMessages,
  5000
);