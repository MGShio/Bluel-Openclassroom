document.addEventListener('DOMContentLoaded', function () {

    // Define the handleSuccessfulAuthentication function
    function handleSuccessfulAuthentication(result) {
        // Your logic here, for example:
        console.log("Handling successful authentication:", result);
        // Additional actions you want to perform on successful authentication
    }

    async function sendId() {
        const formId = document.querySelector("#user-login-form");

        if (formId) {
            formId.addEventListener("submit", async function(event) {
                event.preventDefault();

                const email = document.querySelector("#email").value;
                const password = document.querySelector("#password").value;

                const user = {
                    email: email,
                    password: password
                };

                try {
                    const response = await fetch("http://localhost:5678/api/users/login", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(user)
                    });
                
                    if (response.status === 401) {
                        // Handle 401 unauthorized
                        errorMessage.textContent = "Erreur, mot de passe ou utilisateur incorrect.";
                        errorMessage.style.display = "block";
                    } else if (response.status === 404) {
                        // Handle 404 not found
                        errorMessage.textContent = "Erreur, mot de passe ou utilisateur incorrect.";
                        errorMessage.style.display = "block";
                    } else if (response.ok) {
                        const result = await response.json();
                
                        console.log("Authentication successful. Token:", result.token);

                        if (result && result.token) {
                            localStorage.setItem("token", result.token);

                            // Call the handleSuccessfulAuthentication function
                            handleSuccessfulAuthentication(result);

                            window.location.href = "index.html";
                            deconnect();

                             // Vérification de la réponse
                        }
                    }
                } catch (error) {
                    console.error("Error during authentication request:", error);
                }
                
            });
        }
    }

    sendId();
});
