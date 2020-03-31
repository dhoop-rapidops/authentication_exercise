document.getElementById("signup").addEventListener("click", () => {
    const email = document.querySelector("input[type=text]");
    const [password, cn_password ] = document.querySelectorAll("input[type=password]");
    
    const data = {
        email: email.value,
        password: password.value,
        cn_password: cn_password.value
    }

    fetch("http://127.0.0.1:3000/auth/signup", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(result => {
        return result.json();
    }).then(data => {
        console.log("data", data);
        if(data.message === "ok") {
            const a = document.createElement("a");
            a.href = "/auth/login";
            a.click();
        } else {
            document.getElementById("info").innerHTML = JSON.stringify(data.message);
        }
    }).catch(err => {
        console.log("error", err);
    });

});