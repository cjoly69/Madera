var nomLigneDevis = "devL_";
var nbLignesDevis = 4;
var numLigneDevisModif = -1;

var estEnModification = false;

// MENU /////////////////////////////////////////////////////////////

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

/////////////////////////////////////////////////////////////////////
// Corps du devis ///////////////////////////////////////////////////

function gestionDevis(event) {
    var ligne = event.srcElement.parentNode.parentNode; // on revient jusqu'à la balise <tr>

    if (ligne.id == "saisieLignDevis") {
        if (event.srcElement.id == "validModif") {
            majLigneDevis();
        }
        else if (event.srcElement.id == "annulModif") {
            nettoyageSaisieLigne();
        }
        else if (event.srcElement.id == "ajLign") {
            ajoutLigneDevis();
        }
    }
    else {
        if (!estEnModification) {
            if (ligne.id != undefined && ligne.id != "") {
                var nomFonct = event.srcElement.className;

                switch(nomFonct) {
                    case "btnModLign":
                        numLigneDevisModif = ligne.id.substring(nomLigneDevis.length); // on récupère l'id de la ligne
                        modificationLigneDevis(ligne);
                        break;

                    case "btnSuppLign":
                            ligne.classList.add("confirmationSupp");

                            if (confirm("Voulez-vous vraiment supprimer cette ligne ?")) {
                                suppressionLigneDevis(ligne);
                            }
                            else {
                                ligne.classList.remove("confirmationSupp");
                            }
                        break;
                        
                }
            }
        }
        else {
            alert("Vous ne pouvez pas réaliser ce type d'opération quand vous éditez une ligne de devis.");
        }
    }
}

// ajoute une ligne au devis
function ajoutLigneDevis() {
    nbLignesDevis++;

    var ligneSaisie = document.getElementById("saisieLignDevis");

    // on copie une ligne du devis
    var nvlleLigne = document.getElementById("modele").cloneNode(true);

    // on applique les nouvelles propriétés 
    nvlleLigne.id = nomLigneDevis + nbLignesDevis;

    for (var i = 0; i < ligneSaisie.cells.length; i++) {        
        if (ligneSaisie.cells[i].firstElementChild.type === "text") {
            nvlleLigne.cells[i].innerText = ligneSaisie.cells[i].firstElementChild.value;
        }
    }

    nettoyageSaisieLigne();

    var corpsDevis = document.getElementById("corpsDevis");
    corpsDevis.appendChild(nvlleLigne);
}

// gestion de la suppression d'une ligne
function suppressionLigneDevis(ligne) {
    ligne.remove();
}

// permet à l'utilisateur de modifier une ligne de devis
function modificationLigneDevis(ligne) {
    var ligneSaisie = document.getElementById("saisieLignDevis");
    
    estEnModification = true;

    document.getElementById("ajLign").classList.add("masqueBtn");
    document.getElementById("validModif").classList.remove("masqueBtn");
    document.getElementById("annulModif").classList.remove("masqueBtn");

    for (var i = 0; i < ligneSaisie.cells.length; i++) {        
        if (ligneSaisie.cells[i].firstElementChild.type === "text") {
            ligneSaisie.cells[i].firstElementChild.value = ligne.cells[i].innerText;
        }
    }
}

// mise à jour de la ligne de devis
function majLigneDevis() {
    if (numLigneDevisModif != -1) {
        var ligneSaisie = document.getElementById("saisieLignDevis");
        var ligne = document.getElementById(nomLigneDevis + numLigneDevisModif);

        for (var i = 0; i < ligneSaisie.cells.length; i++) {        
            if (ligneSaisie.cells[i].firstElementChild.type === "text") {
                ligne.cells[i].innerText = ligneSaisie.cells[i].firstElementChild.value;
                ligneSaisie.cells[i].firstElementChild.value = "";
            }
        }

        document.getElementById("ajLign").classList.remove("masqueBtn");
        document.getElementById("validModif").classList.add("masqueBtn");
        document.getElementById("annulModif").classList.add("masqueBtn");

        estEnModification = false;
        numLigneDevisModif = -1;
    }
}

// nettoie la zone de saisie
function nettoyageSaisieLigne() {
    var ligneSaisie = document.getElementById("saisieLignDevis");

    for (var i = 0; i < ligneSaisie.cells.length; i++) {        
        if (ligneSaisie.cells[i].firstElementChild.type === "text") {
            ligneSaisie.cells[i].firstElementChild.value = "";
        }
    }

    document.getElementById("ajLign").classList.remove("masqueBtn");
    document.getElementById("validModif").classList.add("masqueBtn");
    document.getElementById("annulModif").classList.add("masqueBtn");

    estEnModification = false;
    numLigneDevisModif = -1;
}

/////////////////////////////////////////////////////////////////////
// Evènements ///////////////////////////////////////////////////////

// gestion du menu
document.getElementById("menu").addEventListener("click", changePage, false);

// gestion du devis
document.getElementById("corpsDevis").addEventListener("click", gestionDevis, false);