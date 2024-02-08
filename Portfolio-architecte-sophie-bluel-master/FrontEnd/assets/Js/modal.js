// Modal
document.addEventListener('DOMContentLoaded', function () {

    // Vérifier si le jeton et l'ID utilisateur sont présents dans le localStorage
    if (localStorage.getItem('token') != null && localStorage.getItem('userId') != null) {
        // Modifier la présentation visuelle de la page en mode administrateur
        document.querySelector('body').classList.add('connecté');
        let topBar = document.getElementById('top-bar');
        topBar.style.display = "flex";
        let filters = document.getElementById('all-filters');
        filters.style.display = "none";
        let space = document.getElementById('space-only-admin');
        space.style.paddingBottom = "100px";
        let introduction = document.getElementById('space-introduction-in-mode-admin');
        introduction.style.marginTop = "-50px";
    }

    const modalClose = document.querySelector('.modal-close');

    // Cliquer sur déconnexion pour se déconnecter
    const logoutButton = document.getElementById('nav-logout');
if (logoutButton) {
    logoutButton.addEventListener('click', function (event) {
        event.preventDefault();
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        // Changer la présentation de la page lorsque l'administrateur est déconnecté
        document.querySelector('body').classList.remove(`connecté`);
        let topBar = document.getElementById('top-bar');
        if (topBar) {
            topBar.style.display = "none";
        }
        let filters = document.getElementById('all-filters');
        if (filters) {
            filters.style.display = "flex";
        }
        let space = document.getElementById('space-only-admin');
        if (space) {
            space.style.paddingBottom = "0";
        }
    });
}

    // Ouvrir la modal avec le bouton "modifier" en mode administrateur, pour voir tous les travaux
    const updateWorksButton = document.getElementById('update-works');

if (updateWorksButton) {
    updateWorksButton.addEventListener('click', function (event) {
    document.getElementById('update-works').addEventListener('click', function (event) {
        event.preventDefault();
        // New code for updating works
        fetch("http://localhost:5678/api/works")
            .then(response => response.json())
            .then(data => {
                let works = data;
                document.querySelector('#modal-works.modal-gallery .modal-content').innerText = '';
                works.forEach((work, index) => {
                    let myFigure = document.createElement('figure');
                    myFigure.setAttribute('class', `work-item category-id-0 category-id-${work.categoryId}`);
                    myFigure.setAttribute('id', `work-item-popup-${work.id}`);
                    let myImg = document.createElement('img');
                    myImg.setAttribute('src', work.imageUrl);
                    myImg.setAttribute('alt', work.title);
                    myFigure.appendChild(myImg);
                    let myFigCaption = document.createElement('figcaption');
                    myFigCaption.textContent = 'éditer';
                    myFigure.appendChild(myFigCaption);
                    let crossDragDrop = document.createElement('i');
                    crossDragDrop.classList.add('fa-solid', 'fa-arrows-up-down-left-right', 'cross');
                    myFigure.appendChild(crossDragDrop);
                    let trashIcon = document.createElement('i');
                    trashIcon.classList.add('fa-solid', 'fa-trash-can', 'trash');
                    myFigure.appendChild(trashIcon);
                    trashIcon.addEventListener('click', function (event) {
                        event.preventDefault();
                        if (confirm("Voulez-vous supprimer cet élément ?")) {
                            fetch(`http://localhost:5678/api/works/${work.id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                                }
                            })
                                .then(response => {
                                    switch (response.status) {
                                        case 500:
                                        case 503:
                                            alert("Comportement inattendu !");
                                            break;
                                        case 401:
                                            alert("Suppression impossible !");
                                            break;
                                        case 200:
                                        case 204:
                                            console.log("Projet supprimé.");
                                            document.getElementById(`work-item-${work.id}`).remove();
                                            console.log(`work-item-${work.id}`);
                                            document.getElementById(`work-item-popup-${work.id}`).remove();
                                            console.log(`work-item-popup-${work.id}`);
                                            break;
                                        default:
                                            alert("Erreur inconnue !");
                                            break;
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        }
                    });
                    document.querySelector("div.modal-content").appendChild(myFigure);
                    let modal = document.getElementById('modal');
                    modal.style.display = "flex";
                    let modalWorks = document.getElementById('modal-works');
                    modalWorks.style.display = "block";
                });
            })
            .catch(err => {
                console.log(err);
            });
    });
});
}

    // Gestion de la fermeture de la modalité lors du clic à l'extérieur
    // La modalité de travail ne peut pas se fermer si vous cliquez à l'intérieur de son contenu
    document.querySelectorAll('#modal-works').forEach(modalWorks => {
        modalWorks.addEventListener('click', function (event) {
            event.stopPropagation();
        });
        // La modalité de modification ne peut pas se fermer si vous cliquez à l'intérieur de son contenu
        document.querySelectorAll('#modal-edit').forEach(modalEdit => {
            modalEdit.addEventListener('click', function (event) {
                event.stopPropagation();
            });
            // Fermeture des deux fenêtres modales avec un clic à l'extérieur
            document.getElementById('modal').addEventListener('click', function (event) {
                event.preventDefault();
                let modal = document.getElementById('modal');
                modal.style.display = "none";
                let modalWorks = document.getElementById('modal-works');
                modalWorks.style.display = "none";
                let modalEdit = document.getElementById('modal-edit');
                modalEdit.style.display = "none";
                // Réinitialiser tous les formulaires dans la modalité de modification
                // Supprimer l'image si elle existe
                if (document.getElementById('form-image-preview') != null) {
                    document.getElementById('form-image-preview').remove();
                }
                // Revenir à la conception originale du formulaire
                document.getElementById('modal-edit-work-form').reset();
                let iconNewPhoto = document.getElementById('photo-add-icon');
                iconNewPhoto.style.display = "block";
                let buttonNewPhoto = document.getElementById('new-image');
                buttonNewPhoto.style.display = "block";
                let photoMaxSize = document.getElementById('photo-size');
                photoMaxSize.style.display = "block";
                let modalEditPhoto = document.getElementById('modal-edit-new-photo');
                modalEditPhoto.style.padding = "30px 0 19px 0";
                document.getElementById('submit-new-work').style.backgroundColor = "#A7A7A7";
            });
        });
    });

    // Fermeture de la première fenêtre de la modalité avec le bouton "x"
    const closeButton = document.getElementById('button-to-close-first-window');

if (closeButton) {
    closeButton.addEventListener('click', function (event) {
        event.preventDefault();
        let modal = document.getElementById('modal');
        modal.style.display = "none";
        let modalWorks = document.getElementById('modal-works');
        if (modalWorks) {
            modalWorks.style.display = "none";
        }
    });
}

    // Fermeture de la deuxième fenêtre de la modalité avec le bouton "x"
    const closeSecondButton = document.getElementById('button-to-close-second-window');

    if (closeSecondButton) {
        closeSecondButton.addEventListener('click', function (event) {
            event.preventDefault();
            let modal = document.getElementById('modal');
            modal.style.display = "none";
            let modalEdit = document.getElementById('modal-edit');
            if (modalEdit) {
                modalEdit.style.display = "none";
                // Réinitialiser tous les formulaires dans la modalité de modification
                // Supprimer l'image si elle existe
                let formImagePreview = document.getElementById('form-image-preview');
                if (formImagePreview) {
                    formImagePreview.remove();
                }
                // Revenir à la conception originale du formulaire
                document.getElementById('modal-edit-work-form').reset();
                let iconNewPhoto = document.getElementById('photo-add-icon');
                if (iconNewPhoto) {
                    iconNewPhoto.style.display = "block";
                }
                let buttonNewPhoto = document.getElementById('new-image');
                if (buttonNewPhoto) {
                    buttonNewPhoto.style.display = "block";
                }
                let photoMaxSize = document.getElementById('photo-size');
                if (photoMaxSize) {
                    photoMaxSize.style.display = "block";
                }
                let modalEditPhoto = document.getElementById('modal-edit-new-photo');
                if (modalEditPhoto) {
                    modalEditPhoto.style.padding = "30px 0 19px 0";
                }
                let submitNewWork = document.getElementById('submit-new-work');
                if (submitNewWork) {
                    submitNewWork.style.backgroundColor = "#A7A7A7";
                }
            }
        });
    }
    
    // Ouverture de la deuxième fenêtre de la modalité avec le bouton "Ajouter photo"
    const modalEditAddButton = document.getElementById('modal-edit-add');

if (modalEditAddButton) {
    modalEditAddButton.addEventListener('click', function (event) {
    document.getElementById('modal-edit-add').addEventListener('click', function (event) {
        event.preventDefault();
        let modalWorks = document.getElementById('modal-works');
        modalWorks.style.display = "none";
        let modalEdit = document.getElementById('modal-edit');
        modalEdit.style.display = "block";
    });
});
}

    // Retour à la première fenêtre de la modalité avec la flèche
    const arrowReturnButton = document.getElementById('arrow-return');

if (arrowReturnButton) {
    arrowReturnButton.addEventListener('click', function (event) {
        event.preventDefault();
        let modalWorks = document.getElementById('modal-works');
        if (modalWorks) {
            modalWorks.style.display = "block";
            let modalEdit = document.getElementById('modal-edit');
            if (modalEdit) {
                modalEdit.style.display = "none";
                // Réinitialiser tous les formulaires dans la modalité de modification
                // Supprimer l'image si elle existe
                let formImagePreview = document.getElementById('form-image-preview');
                if (formImagePreview) {
                    formImagePreview.remove();
                }
                // Revenir à la conception originale du formulaire
                let modalEditWorkForm = document.getElementById('modal-edit-work-form');
                if (modalEditWorkForm) {
                    modalEditWorkForm.reset();
                }
                let iconNewPhoto = document.getElementById('photo-add-icon');
                if (iconNewPhoto) {
                    iconNewPhoto.style.display = "block";
                }
                let buttonNewPhoto = document.getElementById('new-image');
                if (buttonNewPhoto) {
                    buttonNewPhoto.style.display = "block";
                }
                let photoMaxSize = document.getElementById('photo-size');
                if (photoMaxSize) {
                    photoMaxSize.style.display = "block";
                }
                let modalEditPhoto = document.getElementById('modal-edit-new-photo');
                if (modalEditPhoto) {
                    modalEditPhoto.style.padding = "30px 0 19px 0";
                }
                let submitNewWork = document.getElementById('submit-new-work');
                if (submitNewWork) {
                    submitNewWork.style.backgroundColor = "#A7A7A7";
                }
            }
        }
    });
}

    // Requête pour ajouter les options de catégorie dans la modalité de modification
    fetch("http://localhost:5678/api/categories")
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function (data) {
            let categories = data;
            // Boucle sur chaque catégorie
            categories.forEach((category, index) => {
                // Création de la balise <options> dans la modalité de modification
                let myOption = document.createElement('option');
                myOption.setAttribute('value', category.id);
                myOption.textContent = category.name;
                // Ajout de la nouvelle balise <option> dans le select.choice-category existant
                document.querySelector("select.choice-category").appendChild(myOption);
            });
        })
        .catch(function (err) {
            console.log(err);
        });

    // Gestion du formulaire
    document.addEventListener('DOMContentLoaded', function () {
    
        // Gestion du formulaire
        const modalEditWorkForm = document.getElementById('modal-edit-work-form');
    
        if (modalEditWorkForm) {
            modalEditWorkForm.addEventListener('submit', function (event) {
                event.preventDefault();
                let formData = new FormData();
                formData.append('title', document.getElementById('form-title').value);
                formData.append('category', document.getElementById('form-category').value);
                formData.append('image', document.getElementById('form-image').files[0]);
                // Nouvelle requête pour poster un nouveau projet
                fetch('http://localhost:5678/api/works', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                    body: formData
                })
                    .then(function (response) {
                        switch (response.status) {
                            case 500:
                                alert("Erreur serveur.");
                                break;
                            case 503:
                                alert("Erreur inattendue !");
                                break;
                            case 400:
                                alert("Mauvaise requête.");
                                break;
                            case 404:
                                alert("Impossible d'ajouter le nouveau projet !");
                                break;
                            case 200:
                            case 201:
                                console.log("Projet ajouté avec succès !");
                                return response.json();
                                break;
                            default:
                                alert("Erreur inconnue !");
                                break;
                        }
                    })
                    .then(function (json) {
                        console.log(json);
                        // Création de l'élément HTML
                        // Création de la balise <figure>
                        let myFigure = document.createElement('figure');
                        myFigure.setAttribute('class', `work-item category-id-0 category-id-${json.categoryId}`);
                        myFigure.setAttribute('id', `work-item-${json.id}`);
                        // Création de la balise <img>
                        let myImg = document.createElement('img');
                        myImg.setAttribute('src', json.imageUrl);
                        myImg.setAttribute('alt', json.title);
                        myFigure.appendChild(myImg);
                        // Création de la balise <figcaption>
                        let myFigCaption = document.createElement('figcaption');
                        myFigCaption.textContent = json.title;
                        myFigure.appendChild(myFigCaption);
                        // Ajout de la nouvelle balise <figure> dans la div.gallery existante
                        document.querySelector("div.gallery").appendChild(myFigure);
                        // Fermer la modalité de modification
                        let modal = document.getElementById('modal');
                        modal.style.display = "none";
                        let modalEdit = document.getElementById('modal-edit');
                        modalEdit.style.display = "none";
                        // Réinitialiser tous les formulaires dans la modalité de modification
                        // Supprimer l'image si elle existe
                        if (document.getElementById('form-image-preview') != null) {
                            document.getElementById('form-image-preview').remove();
                        }
    
                        // Retour à la conception du formulaire d'origine
                        document.getElementById('modal-edit-work-form').reset();
                        let iconNewPhoto = document.getElementById('photo-add-icon');
                        iconNewPhoto.style.display = "block";
                        let buttonNewPhoto = document.getElementById('new-image');
                        buttonNewPhoto.style.display = "block";
                        let photoMaxSize = document.getElementById('photo-size');
                        photoMaxSize.style.display = "block";
                        let modalEditPhoto = document.getElementById('modal-edit-new-photo');
                        modalEditPhoto.style.padding = "30px 0 19px 0";
                        document.getElementById('submit-new-work').style.backgroundColor = "#A7A7A7";
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            });
        } else {
            console.error("Element with ID 'modal-edit-work-form' not found");
        }
    
        // ... (the rest of your code)
    });
    
// Vérifier la taille du fichier image
document.addEventListener('DOMContentLoaded', function () {
    // ... (your existing code)

    // Vérifier la taille du fichier image
    let fileInput = document.getElementById('form-image');
    
    if (fileInput) {
        fileInput.addEventListener('change', () => {
            const maxFileSize = 4 * 1024 * 1024; // 4 Mo
            if (fileInput.files[0].size > maxFileSize) {
                alert("Le fichier sélectionné est trop volumineux. La taille maximale est de 4 Mo.");
                fileInput.value = '';
            } else {
                if (fileInput.files.length > 0) {
                    // Création de l'aperçu de l'image
                    let myPreviewImage = document.createElement('img');
                    myPreviewImage.setAttribute('id', 'form-image-preview');
                    myPreviewImage.src = URL.createObjectURL(fileInput.files[0]);
                    let modalEditNewPhoto = document.getElementById('modal-edit-new-photo');
                    if (modalEditNewPhoto) {
                        modalEditNewPhoto.appendChild(myPreviewImage);
                        myPreviewImage.style.display = "block";
                        myPreviewImage.style.height = "169px";
                    }
                    let iconNewPhoto = document.getElementById('photo-add-icon');
                    if (iconNewPhoto) {
                        iconNewPhoto.style.display = "none";
                    }
                    let buttonNewPhoto = document.getElementById('new-image');
                    if (buttonNewPhoto) {
                        buttonNewPhoto.style.display = "none";
                    }
                    let photoMaxSize = document.getElementById('photo-size');
                    if (photoMaxSize) {
                        photoMaxSize.style.display = "none";
                    }
                    let modalEditPhoto = document.getElementById('modal-edit-new-photo');
                    if (modalEditPhoto) {
                        modalEditPhoto.style.padding = "0";
                    }
                }
            }
        });
    }

    // ... (the rest of your code)
});


document.addEventListener('DOMContentLoaded', function () {
    // ... (your existing code)

    // Lier la fonction checkNewProjectFields() aux 3 champs en écoutant les événements "input"
    let formTitle = document.getElementById('form-title');
    let formCategory = document.getElementById('form-category');
    let formImage = document.getElementById('form-image');

    if (formTitle && formCategory && formImage) {
        formTitle.addEventListener('input', checkNewProjectFields);
        formCategory.addEventListener('input', checkNewProjectFields);
        formImage.addEventListener('input', checkNewProjectFields);
    }

    // Création de la fonction checkNewProjectFields() qui vérifie les champs image + titre + catégorie
    function checkNewProjectFields() {
        let title = formTitle.value.trim();
        let category = formCategory.value.trim();
        let image = formImage.files;

        let submitWork = document.getElementById('submit-new-work');
        if (title === "" || category === "" || image.length === 0) {
            submitWork.style.backgroundColor = "#A7A7A7";
        } else {
            submitWork.style.backgroundColor = "#1D6154";
        }
    }

    // ... (the rest of your code)
});
})
