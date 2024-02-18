const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const app = express()
var corsOptions = { origin: ['https://bulkmail-mern-stack.vercel.app/'], }
app.use(cors(corsOptions))
app.use(express.json())

app.listen(5000, function () {
  console.log("server connected...")
})
"use strict";
const nodemailer = require("nodemailer");


mongoose.connect("mongodb+srv://toji:2448736@cluster0.pvy9ro2.mongodb.net/passkey?retryWrites=true&w=majority").then(function () {
  console.log("Connected to DB")
}).catch(function (error) {
  console.log(error)
})


const credential = mongoose.model('credential', {}, "bulkmail")

app.get("/", function (req, res) {
  res.send("server is connected")
})



app.post("/mail", function (req, res) {
  res.send("returned")
  var msg = req.body.msg
  var emailList = req.body.emailList

  credential.find().then(function (data) {
    console.log(data[0].toJSON().pass)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data[0].toJSON().user,
        pass: data[0].toJSON().pass,

      },

    });

    new Promise(async function (resolve, reject) {
      try {
        for (var i = 0; i < emailList.length; i = i + 1) {
          await transporter.sendMail(
            {
              from: "rathenagamingofficial@gmail.com",
              to: newtotalemail[i],
              subject: "Testing mail from bulk mail app",
              text: msg
            }
          )
          console.log("Email sent to :" + emailList[i])
        }
        resolve("Success")

      }
      catch (error) {
        console.log(error)
        reject("failed")
      }
    }).then(function () {
      res.send(true)
    }).catch(function () {
      res.send(false)
    })
  }).catch(function () {
    console.log("Failed")
  })
});