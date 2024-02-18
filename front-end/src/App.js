import { useState } from "react";
import axios from 'axios'
import * as XLSX from "xlsx"
 
function App() {

  const [msg,setmsg] = useState()
  const [status,setstatus] = useState(false)
  const [emailList,setemailList] = useState([])
  function handlemsg(event)
  {
    setmsg(event.target.value)
  }

  function handlefile(event)
  {
    const file = event.target.files[0]

    const reader = new FileReader()
    
    reader.onload = function(event){
        const data = event.target.result
        const workbook = XLSX.read(data,{type:'binary'})
        const sheetname = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetname]
        const emailList = XLSX.utils.sheet_to_json(worksheet,{header:'A'})
        const totalemail = emailList.map(function(item){return(item.A)})
        console.log(totalemail)
        setemailList(totalemail)
        console.log(emailList)
    }

    reader.readAsBinaryString(file)
  }

  function send()
  {
    setstatus(true)
    axios.post("http://localhost:5000/mail",{msg:msg, emailList:emailList}).then(function(data)
    {
      if(data.data === true)
      {
        setstatus(false)
        alert("Email send Successfully")
      }
      else{
        alert("Failed")
        setstatus(false)
      }
    })
  }

  return (
    <div className="App bg-[#1E4FD8] p-0 m-0">

      <div className="bg-gray-800 text-white text-center">
        <h1 className="text-4xl font-medium px-5 py-4">Bulk Mail</h1>
      </div>
      <div className=" relative inset-0 flex items-center justify-center bg-gradient-to-t from-blue-300 to-blue-700 w-full h-full mt-14">
        <div className="msx-w-lg mx-auto p-6  mb-14 bg-white rounded-lg shadow-md border-white border">
          <h1 className="text-2xl font-medium text-gray-900  mt-4 mb-4">Welcome to Bulk Mail,your dedicated platform for simplifying and enhancing your bulk email experience.</h1>
          <div className="flex flex-col items-center text-black px-6 py-4">
            <textarea onChange={handlemsg} value={msg} className="w-[70%] h-44 py-5 outline-none px-5 bg-white late-300 border border-black rounded-md items-center justify-center" placeholder="Enter the email text...">
            </textarea>
          </div>
          <div className=" text-black text-2xl font-semibold text-center p-3">
            <h1>Drag and Drop Here 👇</h1>
          </div>
          <div className="flex items-center justify-center">
            <input type="file" onChange={handlefile} className=" border-4 border-dashed border-gray-300 py-5 px-5 mt-5 mb-5 items-center justify-center" />
          </div>
          <p className="text-black flex items-center justify-center">Total Emails in the file: {emailList.length}</p>
          <div className="flex items-center justify-center">         
            <button onClick={send} className=" bg-gray-700 py-3 px-5 mt-5 text-white text-2xl font-medium rounded-md">{status ? "Sending..." : "Send"}</button>
          </div>
 
        </div>
      </div>
    </div>
  );
}

export default App;