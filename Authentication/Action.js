//###########################################################################################
class SendData {
    SubmitData(data) {
        try {
            fetch("http://192.168.1.19/serverside/", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(res => {
                // Check HTTP status before parsing JSON
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status} - ${res.statusText}`);
                }
                return res.json();
            })
            .then(text => {
                ////////////////////////////////
                if (data.action == "registration") {
                    document.querySelector("#error").setAttribute("class", "success");
                    document.getElementById("phaseone").style.display = "block";
                    document.getElementById("phasetwo").style.display = "none";
                    document.querySelector(".success").innerHTML = "!!Registration success";
                    setTimeout(() => { location.href = `index.html?username=${text.UserName}` }, 0);
                }
                //////////////////////////////////////////////////////////////////////
                else if (data.action == "login") {
                    document.querySelector("#error").setAttribute("class", "success");
                    document.querySelector(".success").innerHTML = "!!Login success";
                    setTimeout(() => { location.href = `../Dashboard/index.html?username=${text.UserName}` }, 2000);
                }
                //////////////////////////////////////////////////////////////////
                else if (data.action === "forgot") {
                    document.querySelector("#error").setAttribute("class", "success");

                    const mailLink = `mailto:${text.email}?subject=Verification Code&body=Your code is ${text.code}`;
                    const anchor = document.createElement("a");
                    anchor.href = mailLink;
                    anchor.style.display = "block";
                    document.body.appendChild(anchor);

                    try { anchor.click(); } 
                    catch (error) { alert("Failed to open email client automatically. Please click the link manually."); }

                    document.querySelector(".success").innerHTML = `!! Enter code sent to your Email <br>${text.code}`;
                    document.querySelector(".error1").innerHTML = "";

                    const verify = document.querySelector("#verify");

                    verify.addEventListener("input", () => {
                        const email = document.querySelector("#email").value;

                        if (verify.value !== text.code || email !== text.email) {
                            document.querySelector("#error").setAttribute("class", "error");
                            document.querySelector(".error").innerHTML = "Invalid code";
                        } else {
                            document.querySelector("#error").setAttribute("class", "success");
                            document.querySelector(".error1").innerHTML = "";

                            const resetMailLink = `mailto:${text.email}?subject=Request to change password&body=Click the link to reset: resetpassword.html`;

                            const anchorReset = document.createElement("a");
                            anchorReset.href = resetMailLink;
                            anchorReset.style.display = "none";
                            document.body.appendChild(anchorReset);

                            try { anchorReset.click(); } 
                            catch (error) { alert("Failed to open email client for reset link."); }

                            document.querySelector(".success").innerHTML = "Password reset link sent to your email";

                            setTimeout(() => {
                                location.href = `resetpassword.html?email=${text.email}`;
                            }, 4000);
                        }
                    });
                }
                //////////////////////////////////////////////////////////////
                else if (data.action == "reset") {
                    document.querySelector("#error1").setAttribute("class", "success");
                    document.querySelector(".success").innerHTML = "!!Password Reset successfully";
                    setTimeout(() => { location.href = `index.html?username=` }, 1000);
                }
            })
            .catch(error => {
                console.error("Fetch error:", error);  // log full error to console

                // Show error details on screen
                document.querySelector("#error").setAttribute("class", "error");
                document.querySelector("#error").innerHTML = `⚠️ Request failed: ${error.message}`;

                if (data.action == "registration") {
                    document.getElementById("phaseone").style.display = "block";
                    document.getElementById("phasetwo").style.display = "none";
                }
                else if (data.action == "login") {
                    document.querySelector("#error").textContent = "Incorrect Password or Email";
                }
                else if (data.action == "forgot") {
                    document.querySelector("#error1").textContent = "Email not Found";
                }
                else if (data.action == "reset") {
                    document.querySelector("#error1").textContent = "!! Failed to reset Password";
                }
            });
        } catch (error) {
            console.error("Unexpected error:", error);
            document.querySelector("#error").setAttribute("class", "error");
            document.querySelector("#error").textContent = "⚠️ Unexpected error: " + error.message;
        }
    }
}

//################################################################################
document.addEventListener("DOMContentLoaded",()=>{
    const params =new URLSearchParams(window.location.search);
    const form = document.querySelector("#login")??document.querySelector("#reset")??document.querySelector("#register")??document.querySelector("#forgot");
   
        form.addEventListener("submit",(e)=>{
        const formData = new FormData(form);
        var email ;
        var password;
        
    if(form.id =="register"){
        var username = formData.get("username") ??"guest";
         email = formData.get("email") ?? "guest@gmail.com";
        var phone = formData.get("phone")??"0";
         password = formData.get("password")??"null";

        var cpassword = document.getElementById("confirm");
        const details =[username,email,phone,password];
        for(var a =0;a<details.length;a++){
            
        if(details[a] ==""){
             document.getElementById("phaseone").style.display ="block";
             document.getElementById("phasetwo").style.display ="none";
             document.querySelector("#error").textContent = "All fields are required";
        }
        else{
            const data ={username:`${username}`,email:`${email}`,phone:`${phone}`,password:`${password}`,action:`registration`};
            const sendData = new SendData();
            sendData.SubmitData(data);
        }
    }
        
        
        
    }
    else if(form.id =="login"){
        email = formData.get("email") ?? "";
         password = formData.get("password")??"";
         if(email ==""){
            document.querySelector("#error").textContent ="!! Please enter your Email";
            document.querySelector("#error2").textContent ="";
        }
        if(password == ""){
            document.querySelector("#error2").textContent ="!! Password required";
            document.querySelector("#error").textContent ="";
        }
         if(password !="" && email !=""){
        const sendData = new SendData();
         const data = {
        email: `${email}`,password:`${password}`,action:"login"
     };
        sendData.SubmitData(data);
        }
    }
     else if(form.id =="forgot"){
      email = formData.get("email") ?? "";
        if(email != ""){
             data = {
        email: `${email}`,action:"forgot"};
           const sendData = new SendData();
            sendData.SubmitData(data);
        }else{
         document.querySelector("#error1").textContent ="!! Please enter your Email";
         document.querySelector(".error").innerHTML = "";
        
        }
        
    }
     else if(form.id =="reset"){
      password = formData.get("password") ?? "";
      email =params.get("email");

        if(password != ""){
           const sendData = new SendData();
           const data = {
        email: `${email}`,password:`${password}`,action:"reset"
     };
           sendData.SubmitData(data);
        }else{
         document.querySelector("#error1").textContent ="!!Password Required";
         document.querySelector("#error").innerHTML = "";
        
        }
    }else{}
        
        if(password =="" && email ==""){
            document.querySelector("#error").textContent ="All fields required";
            document.querySelector("#error2").textContent ="";
        }
        e.preventDefault();
        })
});



