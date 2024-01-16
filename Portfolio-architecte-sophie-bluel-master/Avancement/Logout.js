// Création de la fonction de déconnexion
function deconnect() {
    const loginLink = document.querySelector(".loginlogout");

    if (loginLink) {
        // Vérification si le token est déjà stocké dans le local storage
        if (localStorage.getItem("token")) {

            // Changement du text du lien "login" en "logout"
            loginLink.textContent = "logout";

            // Déconnexion lors du clique sur "logout"
            loginLink.addEventListener("click", function (event) {
                event.preventDefault();

                // Suppression du token du local storage
                localStorage.removeItem("token")

                // Redirection vers la page d'identification
                window.location.href = "login.html"
            });
        }
    }
}