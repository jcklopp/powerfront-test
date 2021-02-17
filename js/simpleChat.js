/**
 *  jQueryless version
 *  https://www.powerfront.com/jobs/front-end-developer/en-us/
 */

debug = false  // enable for basic console logging
historyArray = []  // TODO In a real version this data would be archived via api
lastResponse = ''  // agents more recent comment
agentIsThinking = false  // indicator for dummy response delay

function sendMessage(){
  if(debug)console.log('agent thinking? ' + agentIsThinking)
  // get the inputs and strip out potentially harmful characters
  //messageText = document.getElementById('chatInput').value.replace(/[^\w\s]/gi, '')  // a little too restrictive
  messageText = document.getElementById('chatInput').value.replace(/[`~#$%^&*()_|+\-='",.<>\{\}\[\]\\\/]/gi, '');
  if (messageText.length > 256){  // truncate the message if it overflows input size max length
    messageText = messageText.substring(0,255)
  }
  document.getElementById('chatInput').value = '' // clear input
  if (messageText == '') return  // ignore blanks
  if (historyArray.length == 0){
    document.getElementById('chatInput').placeholder = 'Continue the conversation...'
    //document.getElementById('endItAll').style.opacity = '1.0'
    document.getElementById('endChat').textContent = 'END CHAT'
  }
  dt = new Date()
  timeStamp = dt.toLocaleTimeString('en-US')
  responseText = ''  // TODO in real version this would come from backend via api
  if(messageText.toLowerCase().indexOf("hello") != -1 || messageText.toLowerCase().indexOf("hi") != -1) {
       responseText = operatorGreetingChat()
  } else if(messageText.indexOf("?") != -1) {
                     responseText = operatorAnswerChat()
  } else {
                     responseText = operatorChat()
  }

  historyArray.push([messageText,responseText,timeStamp])  // TODO send via api to server
  prevCH = document.getElementById('chatHistory').innerHTML
  if (agentIsThinking){
    document.getElementById('chatHistory').innerHTML = 
      '<span style="color:red;">' + timeStamp +' Visitor: <b>' + messageText + '</b></span><br>' +
      prevCH
  }else{
    document.getElementById('chatHistory').innerHTML =
      '<span style="color:red;">' + timeStamp +' Visitor: <b>' + messageText + '</b></span><br>' +
      lastResponse + prevCH
  }
  // reset chat input and setTimeout to create semi-realistic time delays
  document.getElementById('liveChat').innerHTML = ''
  responseDelay = 250 * Math.floor(Math.random() * Math.floor(4))
  setTimeout(resetLive,responseDelay)
  rndDelay = 1500 * ( Math.floor(Math.random() * Math.floor(6))  + 0.5 ) 
  if (debug) console.log ('delay response: ' + responseDelay + ':' + rndDelay)
  setTimeout(updateLive,rndDelay,responseText)
  if (debug) console.log(historyArray)
}


function resetLive(){
  agentIsThinking = true
  if(debug)console.log('start thinking')
  document.getElementById('liveChat').innerHTML = '<div class="pulsingTextClass"><div class="spinner-border" role="status" style="font-size:10px;"><span class="sr-only">Responding...</span></div>...YOUR AGENT IS TYPING...<div class="spinner-border" role="status" style="font-size:10px;"><span class="sr-only">Responding...</span></div></div>'
}
function updateLive(msg){
  dt = new Date()
  timeStamp = dt.toLocaleTimeString('en-US')
  lastResponse = '<span style="color:blue;">' + timeStamp +' Operator: <b>' + msg + '</b></span><br>'
  if (debug) console.log('lastResponse ' + lastResponse)
  document.getElementById('liveChat').innerHTML = '<span style="font-size:18px;color:blue;"><b>Operator: ' + msg + '</b></span>'
  agentIsThinking = false
  if(debug)console.log('done thinking')
  document.getElementById('chatInput').focus()  // ready for more input
}

/* pseudo randomized demo responses */
function operatorChat(){
      rN = Math.floor(Math.random()*responses.length)
      if(debug)console.log(rN)
      return responses[rN] //Math.floor(Math.random()*responses.length)];
}
function operatorAnswerChat(){
      return answers[Math.floor(Math.random()*greetings.length)];
}
function operatorGreetingChat(){
      return greetings[Math.floor(Math.random()*answers.length)];
}
var responses = [
                "OK, let me check that out for you",
                "Message received. I'll see what I can do.",
                "ok, thank you.",
                "I understand.",
                "Hmm, I'm not sure I understand, can you rephrase that?",
                "Right ok, let me sort that out for you."
]
var greetings = [
                "Hello there, welcome to the site. How may I help you?",
                "Good day! How are you?",
                "Hello, what can I do for you?",
                "Hi and welcome!",
                "Greetings :-)"
]
var answers = [
                "Thank you for your question.",
                "OK, let me check that out for you",
                "A very good question! Let me have a look...",
                "Hmm, ok give me a minute and I'll sort that out.",
                "Yes, I think so."
]

// endChat is for the top button which, depending on state is either going to
// show a chat history, start a new chat or end the current chat session
// normally an enumerated list of items would serve to toggle rather than button title
function endChat(){
  if (document.getElementById('endChat').textContent=='VIEW CHAT HISTORY'){
      document.getElementById('liveChat').innerHTML='Chat Transcript Above.'
      document.getElementById('chatInput').disabled = true
      document.getElementById('chatSubmit').disabled = true
      document.getElementById('chatInput').placeholder = 'Viewing a chat history.'
      document.getElementById('endChat').textContent='START NEW CHAT'
      showTranscript()  // This would be a call to backend for data
      return
  }
  if (document.getElementById('endChat').textContent=='START NEW CHAT'){
     document.getElementById('liveChat').innerHTML='How can I help?'
      document.getElementById('chatInput').disabled = false
      document.getElementById('chatSubmit').disabled = false 
      document.getElementById('chatInput').placeholder = 'Type your question here...'
      document.getElementById('endChat').textContent='VIEW CHAT HISTORY'
      //document.getElementById('endItAll').style.opacity = '0'
      historyArray = []
      document.getElementById('chatHistory').innerHTML = ''
  }else{
    goodbye = confirm('Would you like to end this chat session and receive a transcript?')
    if(goodbye){
      myEmail = prompt('Please enter your email address')  // TODO add validation
      document.getElementById('liveChat').innerHTML='Thanks and goodbye!  Check your email for the transcript.'
      document.getElementById('chatInput').disabled = true
      document.getElementById('chatSubmit').disabled = true
      document.getElementById('chatInput').placeholder = 'Chat session has ended.'
      document.getElementById('endChat').textContent='START NEW CHAT'
    }
  }
  // TODO email the transcript of the chat session
}

/* show hard coded transcript */
function showTranscript(){
   var d = new Date();
   d.setTime(d.getTime()-200000)
   timeStamp = d.toLocaleTimeString('en-US')
   historyArray = []  // dispensing with the JSON format, but that would probably make more sense if sending to DB
   historyArray.push(["hello", "Visitor", timeStamp]);
   d.setTime(d.getTime()+4000)
   timeStamp = d.toLocaleTimeString('en-US')
   historyArray.push(["Hi, how can I help you?", "Operator", timeStamp]);
   d.setTime(d.getTime()+4000)
   timeStamp = d.toLocaleTimeString('en-US')
   historyArray.push(["I'm looking for a size 7, but can't find it", "Visitor", timeStamp]);
   d.setTime(d.getTime()+10000)
   timeStamp = d.toLocaleTimeString('en-US')
   historyArray.push(["Ok, one moment I'll check the stock", "Operator", timeStamp])
   d.setTime(d.getTime()+4000)
   timeStamp = d.toLocaleTimeString('en-US')
   historyArray.push(["I'm sorry, there is no size 7 available in that colour. There are some in red and blue however", "Operator", timeStamp])
   d.setTime(d.getTime()+4000)
   timeStamp = d.toLocaleTimeString('en-US')
   historyArray.push(["Oh great, thank you", "Visitor", timeStamp]);
   d.setTime(d.getTime()+4000)
   timeStamp = d.toLocaleTimeString('en-US')
   historyArray.push(["my pleasure :-)", "Operator", timeStamp]);
   if(debug)console.log(historyArray)
   chatDivText = ''
   for (i=0; i< historyArray.length; i++){
     chatDivText += '<span>' + historyArray[i][2] +' ' + historyArray[i][1] + ': <b>' + historyArray[i][0] + '</b></span><br>'
   }
   document.getElementById('chatHistory').innerHTML = chatDivText
}
