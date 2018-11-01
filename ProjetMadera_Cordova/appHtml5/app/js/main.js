var nomLigneDevis = "devL_";
var nbLignesDevis = 4;
var numLigneDevisModif = -1;

var estEnModification = false;

var idUtilisateur = "legrand";
var mdpUtilisateur = "passpass";
var jeton = "4sd5fg1f1bqg51b5q1f3bg3f5q1b5gd1bq515b56dg1b3q5g1bd";

var estModeJour = true;

var estConnecte = false;

function finChargementPage() {
    // on regarde si un jeton de connexion est disponible
    jetonTest = localStorage.getItem("jetonCnx");

    if (jetonTest == jeton) {
        estConnecte = true;
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
    if (!localStorage.getItem("estModeJour")) {
        localStorage.setItem("estModeJour", estModeJour);
    }
    else {
        // https://stackoverflow.com/a/264037
        estModeJour = (localStorage.getItem("estModeJour") == true);
    }
    activationModeAff();


    gestionConnexion();

    if (!estConnecte) {
        document.getElementById("idUtilisateur").value = idUtilisateur;
        document.getElementById("mdpUtilisateur").value = mdpUtilisateur;
    }
}

/////////////////////////////////////////////////////////////////////
// Connexion ////////////////////////////////////////////////////////

function cnxUtilisateur(event) {
    var nomBtn = event.srcElement.id;

    switch(nomBtn) {
        case "validConnex":
            gestionConnexion();
            break;
        case "effacConnex":
            document.getElementById("idUtilisateur").value = "";
            document.getElementById("mdpUtilisateur").value = "";
            break;
    }
}

function decnxUtilisateur() {
    localStorage.removeItem("jetonCnx");
    estConnecte = false;
    gestionConnexion();
}

function gestionConnexion() {
    var idUt = document.getElementById("idUtilisateur").value;
    var mdp = document.getElementById("mdpUtilisateur").value;

    if (
        idUt == idUtilisateur &&
        mdpUtilisateur == mdp &&
        !estConnecte
    ) {
        estConnecte = true;
        localStorage.setItem("jetonCnx", jeton);
    }

    var formCnx = document.getElementById("connexion");
    var accesPages = document.getElementById("estConnecte");

    if (estConnecte) {
        formCnx.classList.add("masque");
        accesPages.classList.remove("masque");

        document.getElementById("idUtilisateur").value = "";
        document.getElementById("mdpUtilisateur").value = "";
    }
    else {
        formCnx.classList.remove("masque");
        accesPages.classList.add("masque");
    }
}

/////////////////////////////////////////////////////////////////////
// Menu /////////////////////////////////////////////////////////////

function changePage(event) {
    var nomPage = event.srcElement.name;

    // cas où on clique sur le contenu du lien
    if (nomPage == undefined) {
        nomPage = event.srcElement.parentNode.name;
    }

    if (nomPage != undefined) {
        if (nomPage != "parametres") {
            // on désactive les boutons dans le menu pour activer celui de la page correspondante
            desactiveTsBtn();

            // on active le bouton de destination
            activeBtn(nomPage);

            // idem avec les pages
            desactivePages();
            activePage(nomPage);
        }
        else {
            var params = document.getElementById("parametres")

            if (params.classList.contains("masque")) {
                params.classList.remove("masque");
                activeBtn(nomPage);
            }
            else {
                params.classList.add("masque");
                desactiveBtn(nomPage);
            }
        }
    }
}

// désactive le bouton
function desactiveBtn(nomBtn) {
    var children = document.getElementById("menu").children;
    
    for (var i = 0; i < children.length; i++) {
        var child = children[i];

        if (child.name == nomBtn) {
            child.classList.remove("btnActif");
            break;
        }
    }
}

// retire la classe "btnActif" de tous les boutons du menu
function desactiveTsBtn() {
    var children = document.getElementById("menu").children;
    
    for (var i = 0; i < children.length; i++) {
        var child = children[i];

        if (child.name != "parametres") {
            child.classList.remove("btnActif");
        }
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
function desactivePages() {
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

    // on copie le modèle d'une ligne du devis
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
// Paramètres ///////////////////////////////////////////////////////

function panneauParametres(event) {
    var nomBtn = event.srcElement.id;
    
    switch(nomBtn) {
        case "btnPageJour":
            estModeJour = true;
            activationModeAff();
            break;

        case "btnPageNuit":
            estModeJour = false;
            activationModeAff();
            break;

        case "btnDeconnexion":
            decnxUtilisateur();
            break;
    }
}

// applique le thème de jour ou de nuit
function activationModeAff() {
    if (estModeJour) {
        document.getElementById("btnPageJour").classList.remove("btnBase");
        document.getElementById("btnPageNuit").classList.add("btnBase");
    }
    else {
        document.getElementById("btnPageNuit").classList.remove("btnBase");
        document.getElementById("btnPageJour").classList.add("btnBase");
    }

    document.getElementById("cssJour").disabled = !estModeJour;
    document.getElementById("cssNuit").disabled = estModeJour;

    localStorage.setItem("estModeJour", estModeJour);
}

/////////////////////////////////////////////////////////////////////
// Evènements ///////////////////////////////////////////////////////

// page de connexion
document.getElementById("btnCnx").addEventListener("click", cnxUtilisateur, false);

// menu
document.getElementById("menu").addEventListener("click", changePage, false);

// devis
document.getElementById("corpsDevis").addEventListener("click", gestionDevis, false);

// affichage
document.getElementById("parametres").addEventListener("click", panneauParametres, false);

// à la fin du chargement du contenu
window.onload = finChargementPage;