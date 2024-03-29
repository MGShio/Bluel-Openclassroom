let allProjects = [];

fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(data => {
        allProjects = data;
        displayProjects(data);
    });

function displayProjects(projects) 
{
    const createGallery = () => 
    {
        const gallery = /*html*/
            <div class="gallery">
                ${projects.map((project) => /*html*/
                    <figure>
                        <img src="${project.imageurl}" alt="${project.title}" />
                        <figcaption>${project.title}</figcaption>
                    </figure>
                ).join('')}
            </div>
        ;

        // Cherche la section avec l'id "portfolio"
        const portfolioSection = document.getElementById('portfolio');

        // Vérifie s'il y a déjà une galerie, si oui, la remplace
        const existingGallery = document.querySelector('.gallery');
        if (existingGallery) {
            existingGallery.outerHTML = gallery;
        } else {
            // Sinon, ajoute la nouvelle galerie à l'interieur de la section "portfolio"
            portfolioSection.insertAdjacentHTML('beforeend', gallery);
        }
    };
}
    createGallery(); // Appel de la fonction createGallery pour créer la galerie d'images
