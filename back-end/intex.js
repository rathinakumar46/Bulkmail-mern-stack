const express = require('express')
const cors = require('cors')
const nodemailer = require("nodemailer");
const app = express()
const mongooes = require('mongoose')

app.use(cors())
app.use(express.json())

mongooes.connect("mongodb+srv://toji:2448736@cluster0.pvy9ro2.mongodb.net/passkey?retryWrites=true&w=majority").then(function () {
  console.log("Connected to DB")
}).catch(function () {
  console.log("connection failed")
})

const credential = mongooes.model("credential", {}, "bulkmail")


app.post("/mail", function (req, res) {
  var msg = req.body.msg
  var emailList = req.body.emailList
  credential.find().then(function (data) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data[0].toJSON().user,
        pass: data[0].toJSON().pass,
      },
    });

    new Promise(async function (resolve, reject) {
      try {
        for (var i = 0; i < emailList.length; i++) {
          await transporter.sendMail(
            {
              from: "rathenagamingofficial@gmail.com",
              to: emailList[i],
              subject: "A mail from Bulk Mail",
              text: msg
            }
          )
          console.log("email send to:" + emailList[i])
        }
        resolve("success")
      }
      catch (error) {
        reject("failed")
      }
    }).then(function () {
      res.send(true)
    })
      .catch(function () {
        res.send(false)
      })

  }).catch(function () {
    console.log("errorr")
  })

})



app.listen(5000, function () {
  console.log("server started...")
})