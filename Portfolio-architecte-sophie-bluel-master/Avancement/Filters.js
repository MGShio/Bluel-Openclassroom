document.addEventListener('DOMContentLoaded', function () {

fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(categories => {
        const filterButtons = document.querySelector('.filter-buttons');

        // Utilise map pour générer la structure HTML pour chaque catégorie
        const buttonsHtml = categories.map(category => {
            return '<button class="filter">' + category.name + '</button>';
        }).join('');

        // Ajoute le bouton "Tous" en tant que premier bouton
        const allButtonHtml = '<button class="filter filter-selected">Tous</button>';

        // Crée la structure complète en combinant le bouton "Tous" avec les boutons de catégories
        const filterButtonsHtml = allButtonHtml + buttonsHtml;

        // Utilise innerHTML pour mettre à jour le contenu de la div filter-buttons
        filterButtons.innerHTML = filterButtonsHtml;

        // Récupère tous les boutons de filtre
        const buttons = document.querySelectorAll('.filter-buttons button');

        // Ajoute un event listener à chaque bouton de filtre
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // Si le bouton "Tous" est cliqué (avec la classe "filter-selected"), on appelle "filterProjects" avec categoryId à null.
                // Sinon, on recherche l'id de la catégorie associée et on appelle "filterProjects" avec cet id pour filter les projects
                // par catégorie
                const categoryId = button.classList.contains('filter-selected') ? null : categories.find(category => category.name === button.textContent)?.id;
                filterProjects(categoryId, button);
            })
        })
    });

function filterProjects(categoryId, selectedButton) {
    const filteredProjects = !categoryId ? allProjects : allProjects.filter(project => project.categoryId === categoryId);
    displayProjects(filteredProjects);
    setSelectedFilter(selectedButton);
}

function setSelectedFilter(selectedButton) {
    const buttons = document.querySelectorAll('.filter-buttons button');
    buttons.forEach(button => {
        button.classList.remove('filter-selected');
    });
    selectedButton.classList.add('filter-selected');
}
})