function changePage(event) {
    var nomPage = event.srcElement.name;

    // cas où on clique sur le contenu du lien
    if (nomPage == undefined) {
        nomPage = event.srcElement.parentNode.name;
    }

    if (nomPage != undefined) {
        // on désactive les boutons dans le menu pour activer celui de la page correspondante
        desactiveBtn();

        // on active le bouton de destination
        activeBtn(nomPage);

        // idem avec les pages
        desactivePage();
        activePage(nomPage);
    }
}

// retire la classe "btnActif" de tous les boutons du menu
function desactiveBtn() {
    var children = document.getElementById("menu").children;
    
    for (var i = 0; i < children.length; i++) {
        children[i].classList.remove("btnActif");
    }
}

// place la classe "btnActif" sur le bouton, dont le nom est passé en paramètre
function activeBtn(nomBtn) {
    var children = document.getElementById("menu").children;

    for (var i = 0; i < children.length; i++) {
        var child = children[i];

        if (child.name == nomBtn) {
            child.classList.add("btnActif");
            break;
        }
    }
}

// retire la page actuellement visible
function desactivePage() {
    var children = document.getElementById("page").children;
    

    for (var i = 0; i < children.length; i++) {
        children[i].classList.remove("active");
        children[i].classList.add("masque");
    }
}

// place la classe "active" sur la page à afficher
function activePage(nomPage) {
    var children = document.getElementById("page").children;

    for (var i = 0; i < children.length; i++) {
        var child = children[i];

        if (child.id == nomPage) {
            child.classList.remove("masque");
            child.classList.add("active");
            break;
        }
    }
}

var formulaire = document.getElementById("menu");
formulaire.addEventListener("click", changePage, false);