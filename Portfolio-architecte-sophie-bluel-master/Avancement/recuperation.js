document.addEventListener('DOMContentLoaded', function () {

    let allProjects = [];

    fetch("http://localhost:5678/api/works")
        .then(response => response.json())
        .then(data => {
            allProjects = data;
            displayProjects(data);
        });

    function createGallery() {
        const existingGallery = document.querySelector('.gallery');

        if (existingGallery) {
            // Your existing code here
            const gallery = /*html*/ `
                <div class="gallery">
                    ${allProjects.map((project) => /*html*/ `
                        <figure>
                            <img src="${project.imageUrl}" alt="${project.title}" />
                            <figcaption>${project.title}</figcaption>
                        </figure>
                    `).join('')}
                </div>
            `;

            // Cherche la section avec l'id "portfolio"
            const portfolioSection = document.getElementById('portfolio');

            // Vérifie s'il y a déjà une galerie, si oui, la remplace
            existingGallery.outerHTML = gallery;
        } else {
            // Handle the case where .gallery doesn't exist in login.html
        }
    }

    function displayProjects(projects) {
        createGallery(); // Appel de la fonction createGallery pour créer la galerie d'images
    }
});
