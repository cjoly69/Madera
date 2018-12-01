var nomLigneDevis = "devL_";
var nbLignesDevis = 4;
var numLigneDevisModif = -1;

var estEnModification = false;

var idUtilisateur = "legrand";
var mdpUtilisateur = "passpass";
var jeton = "4sd5fg1f1bqg51b5q1f3bg3f5q1b5gd1bq515b56dg1b3q5g1bd";

var estModeJour = true;

var estConnecte = false;

var typeStatusConnexion = Object.freeze({ "enDeconnexion": 1, "enConnexion": 2, null:3 })
var statusCnx = typeStatusConnexion.null;

var txTva = 0.2;

var patternDigit = /[0-9]*[.,]?[0-9]+/g;
var patternCbBoxLignRemise = /\[\d\]/gm;

var idLigneRemise = null;

var montantTtcFact = 8000;

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
        if (localStorage.getItem("estModeJour") == 'true') {
            estModeJour = true;
        }
        else {
            estModeJour = false;
        }
    }
    activationModeAff();


    gestionConnexion();

    if (!estConnecte) {
        document.getElementById("idUtilisateur").value = idUtilisateur;
        document.getElementById("mdpUtilisateur").value = mdpUtilisateur;
    }
    
    document.getElementById("cordovaAttente").classList.add("masque");
    document.getElementById("cordovaCharge").classList.remove("masque");
}

/////////////////////////////////////////////////////////////////////
// Connexion ////////////////////////////////////////////////////////

function cnxUtilisateur(event) {
    var nomBtn = event.srcElement.id;

    switch (nomBtn) {
        case "validConnex":
            statusCnx = typeStatusConnexion.enConnexion;
            gestionConnexion();
            statusCnx = typeStatusConnexion.null;
            break;
        case "effacConnex":
            document.getElementById("idUtilisateur").value = "";
            document.getElementById("mdpUtilisateur").value = "";
            break;
    }
}

function decnxUtilisateur() {
    statusCnx = typeStatusConnexion.enDeconnexion;
    localStorage.removeItem("jetonCnx");
    estConnecte = false;
    gestionConnexion();
    statusCnx = typeStatusConnexion.null;
}

function gestionConnexion() {
    var idUt = document.getElementById("idUtilisateur").value;
    var mdp = document.getElementById("mdpUtilisateur").value;

    if (!estConnecte) {
        if (
            idUt == idUtilisateur &&
            mdpUtilisateur == mdp
        ) {
            estConnecte = true;
            localStorage.setItem("jetonCnx", jeton);
        }
        else {
            if (statusCnx == typeStatusConnexion.enConnexion) {
                alert("Identifiants de connexions incorrects.")
            }
        }
    }

    var formCnx = document.getElementById("bodyConnexion");
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

function cnxModeAffichage(event) {
    var nomBtn = event.srcElement.id;

    switch (nomBtn) {
        case "cnxModeJour":
            estModeJour = true;
            activationModeAff();
            break;

        case "cnxModeNuit":
            estModeJour = false;
            activationModeAff();
            break;
    }
}

/////////////////////////////////////////////////////////////////////
// Menu /////////////////////////////////////////////////////////////

function changePage(event) {
    var nomPage = event.srcElement.name;

    // cas où on clique sur le contenu du lien
    if (nomPage == undefined || nomPage == '') {
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
            ajoutLigneDevisSaisie();
        }
    }
    else {
        if (!estEnModification) {
            if (ligne.id != undefined && ligne.id != "") {
                var nomFonct = event.srcElement.className;

                switch (nomFonct) {
                    case "btnModLign":
                        numLigneDevisModif = ligne.id.substring(nomLigneDevis.length); // on récupère l'id de la ligne
                        modificationLigneDevis(ligne);
                        break;

                    case "btnSuppLign":
                        ligne.classList.add("confirmationSupp");
                        
                        setTimeout(function () {
                            if (confirm("Voulez-vous vraiment supprimer cette ligne ?")) {
                                suppressionLigneDevis(ligne);
                            }
                            else {
                                ligne.classList.remove("confirmationSupp");
                            }
                        }, 50);
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
function ajoutLigneDevisSaisie() {
    if (controleSaisie()) {
        nbLignesDevis++;

        var ligneSaisie = document.getElementById("saisieLignDevis");

        // on copie le modèle d'une ligne du devis
        var nvlleLigne = document.getElementById("modele").cloneNode(true);

        // on applique les nouvelles propriétés 
        nvlleLigne.id = nomLigneDevis + nbLignesDevis;

        //var val = "";
        //var tabValeur = null;
        //var valeur = "";

        var gamme = ligneSaisie.cells[0].firstElementChild.value;
        var modele = ligneSaisie.cells[1].firstElementChild.value;
        var coupePrinc = ligneSaisie.cells[2].firstElementChild.value;
        var prix = ligneSaisie.cells[3].firstElementChild.value;

        ajoutLigneDevis(gamme, modele, coupePrinc, prix);

        /*

        for (var i = 0; i < ligneSaisie.cells.length; i++) {
            if (
                ligneSaisie.cells[i].firstElementChild.type === "text" ||
                ligneSaisie.cells[i].firstElementChild.type === "number"
            ) {
                val = ligneSaisie.cells[i].firstElementChild.value;

                if (i == 3) {
                    valeur = "";

                    tabValeur = val.match(patternDigit);
                    if (tabValeur != null) {

                        for (var j = 0; j < tabValeur.length; j++) {
                            valeur += tabValeur[j];
                        }

                        val = getFormatMillier(valeur)
                    }
                }

                nvlleLigne.cells[i].innerText = val;
            }
        }

        */

        nettoyageSaisieLigne();

        majFacturation();
    }
    else {
        alert("Tous les champs sont obligatoires.");
    }
}

// Ajoute une ligne de devis et la retourne
function ajoutLigneDevis(gamme, modele, coupePrinc, prix) {
    // on copie le modèle d'une ligne du devis
    var nvlleLigne = document.getElementById("modele").cloneNode(true);

    // on applique les nouvelles propriétés 
    nvlleLigne.id = nomLigneDevis + nbLignesDevis;

    var montantHt = "";

    // transformation du prix (chaine) en montant numérique pour retransformer en chaine avec la séparation des milliers
    var tabValeur = prix.match(patternDigit);
    if (tabValeur != null) {

        for (var j = 0; j < tabValeur.length; j++) {
            montantHt += tabValeur[j];
        }

        prix = getFormatMillier(montantHt)
    }

    nvlleLigne.cells[0].innerText = gamme;
    nvlleLigne.cells[1].innerText = modele;
    nvlleLigne.cells[2].innerText = coupePrinc;
    nvlleLigne.cells[3].innerText = prix;

    // on ajoute la ligne et on l'a retourne
    return document.getElementById("corpsDevis").appendChild(nvlleLigne);
}

// gestion de la suppression d'une ligne
function suppressionLigneDevis(ligne) {
    ligne.remove();

    majFacturation();
}

// permet à l'utilisateur de modifier une ligne de devis
function modificationLigneDevis(ligne) {
    var ligneSaisie = document.getElementById("saisieLignDevis");

    estEnModification = true;

    modifBtnSaisieLigne(false);
    /*
    document.getElementById("ajLign").classList.add("masqueBtn masque");
    document.getElementById("validModif").classList.remove("masqueBtn masque");
    document.getElementById("annulModif").classList.remove("masqueBtn masque");
    */

    for (var i = 0; i < ligneSaisie.cells.length; i++) {
        if (
            ligneSaisie.cells[i].firstElementChild.type === "text" ||
            ligneSaisie.cells[i].firstElementChild.type === "number"
        ) {
            val = ligne.cells[i].innerText;

            if (i == 3) {
                valeur = "";

                tabValeur = val.match(patternDigit);
                if (tabValeur != null) {
                    /*
                    tabValeur.forEach(element => {
                        valeur += element;
                    });
                    */

                    for (var j = 0; j < tabValeur.length; j++) {
                        valeur += tabValeur[j];
                    }

                    val = valeur;
                }
            }

            ligneSaisie.cells[i].firstElementChild.value = val;
        }
    }
}

// mise à jour de la ligne de devis
function majLigneDevis() {
    if (numLigneDevisModif != -1) {

        if (controleSaisie()) {
            var ligneSaisie = document.getElementById("saisieLignDevis");
            var ligne = document.getElementById(nomLigneDevis + numLigneDevisModif);

            for (var i = 0; i < ligneSaisie.cells.length; i++) {
                if (
                    ligneSaisie.cells[i].firstElementChild.type === "text" ||
                    ligneSaisie.cells[i].firstElementChild.type === "number"
                ) {
                    val = ligneSaisie.cells[i].firstElementChild.value;

                    if (i == 3) {
                        valeur = "";

                        tabValeur = val.match(patternDigit);
                        if (tabValeur != null) {
                            /*
                            tabValeur.forEach(element => {
                                valeur += element;
                            });
                            */

                            for (var j = 0; j < tabValeur.length; j++) {
                                valeur += tabValeur[j];
                            }

                            val = getFormatMillier(valeur)
                        }
                    }

                    ligne.cells[i].innerText = val;
                    ligneSaisie.cells[i].firstElementChild.value = "";
                }
            }

            modifBtnSaisieLigne(true);
            /*
            document.getElementById("ajLign").classList.remove("masqueBtn masque");
            document.getElementById("validModif").classList.add("masqueBtn masque");
            document.getElementById("annulModif").classList.add("masqueBtn masque");
            */

            estEnModification = false;
            numLigneDevisModif = -1;

            majFacturation();
        }
        else {
            alert("Tous les champs sont obligatoires.");
        }
    }
}

// nettoie la zone de saisie
function nettoyageSaisieLigne() {
    var ligneSaisie = document.getElementById("saisieLignDevis");

    for (var i = 0; i < ligneSaisie.cells.length; i++) {
        if (
            ligneSaisie.cells[i].firstElementChild.type === "text" ||
            ligneSaisie.cells[i].firstElementChild.type === "number"
        ) {
            ligneSaisie.cells[i].firstElementChild.value = "";
        }
    }

    modifBtnSaisieLigne(true);

    /*
    document.getElementById("ajLign").classList.remove("masqueBtn masque");
    document.getElementById("validModif").classList.add("masqueBtn masque");
    document.getElementById("annulModif").classList.add("masqueBtn masque");
    */

    estEnModification = false;
    numLigneDevisModif = -1;
}

// effectue les opérations affichant ou non les boutons [validation / annulation] + met en valeur la ligne en cours de modification
function modifBtnSaisieLigne(aMasquer) {
    var formModif = document.getElementById(nomLigneDevis + numLigneDevisModif);

    if (aMasquer) {
        document.getElementById("ajLign").classList.remove("masqueBtn");
        document.getElementById("ajLign").classList.remove("masque");

        document.getElementById("validModif").classList.add("masqueBtn");
        document.getElementById("validModif").classList.add("masque");

        document.getElementById("annulModif").classList.add("masqueBtn");
        document.getElementById("annulModif").classList.add("masque");

        if (formModif != null) {
            formModif.classList.remove("ligneModif");
        }
    }
    else {
        document.getElementById("ajLign").classList.add("masqueBtn");
        document.getElementById("ajLign").classList.add("masque");

        document.getElementById("validModif").classList.remove("masqueBtn");
        document.getElementById("validModif").classList.remove("masque");

        document.getElementById("annulModif").classList.remove("masqueBtn");
        document.getElementById("annulModif").classList.remove("masque");

        if (formModif != null) {
            formModif.classList.add("ligneModif");
        }
    }
}

function controleSaisie() {
    var r = true;

    var ligneSaisie = document.getElementById("saisieLignDevis");

    for (var i = 0; i < ligneSaisie.cells.length; i++) {
        if (
            ligneSaisie.cells[i].firstElementChild.type === "text" ||
            ligneSaisie.cells[i].firstElementChild.type === "number"
        ) {
            if (ligneSaisie.cells[i].firstElementChild.value.trim().length == 0) {
                r = false;
                break;
            }
        }
    }

    return r;
}

function getFormatMillier(montant) {
    return String(montant).replace(/(.)(?=(\d{3})+$)/g, '$1 ')
}

function majFacturation() {
    var ttc = 0;

    // formatage des valeurs
    var montant = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

    // récupère uniquement les chiffres dans les chaines
    //var pattern = /[-]{0,1}[\d]*[\.]{0,1}[\d]+/g;
    var resReg = null;

    // nb de lignes dans le tableau
    var lenTab = document.getElementById("corpsDevis").children.length;
    var tabValeur = null;
    var valeur = '';

    // on parcourt chaque ligne pour obtenir le ttc
    for (var i = 0; i < lenTab; i++) {
        formTr = document.getElementById("corpsDevis").children[i];

        if (formTr.id.substring(0, nomLigneDevis.length) == nomLigneDevis) {
            /*
            valeur = "";

            // on remplace tout ce qui n'est pas numérique par rien
            tabValeur = formTr.children[3].innerText.match(patternDigit);

            for (var j = 0; j < tabValeur.length; j++) {
                valeur += tabValeur[j];
            }

            ttc += Number(valeur.replace(",", "."));
            */

            ttc += GetMontant(formTr.children[3].innerText);
        }
    }

    // https://www.toutjavascript.com/reference/ref-math.round.php
    montantHt = (Math.round(ttc * (1 - txTva)) * 100) / 100;

    document.getElementById("totalTtc").innerText = getFormatMillier((Math.round(ttc) * 100) / 100);
    document.getElementById("totalHt").innerText = getFormatMillier(montantHt);
    document.getElementById("totalTva").innerText = getFormatMillier((Math.round(ttc * txTva) * 100) / 100);
}

// Retourne la valeur numérique située dans une chaine
function GetMontant(valeurStr) {
    var r = "";

    // on remplace tout ce qui n'est pas numérique par rien
    tabValeur = valeurStr.match(patternDigit);

    if (tabValeur != null) {
        for (var j = 0; j < tabValeur.length; j++) {
            r += tabValeur[j];
        }

        // si le nombre est négatif, le signe n'est pas tout le temps pris en compte
        if (valeurStr.trim()[0] == "-" && r.trim()[0] != "-") {
            r = "-" + r;
        }

        r = Number(r.replace(",", "."));
    }

    return r;
}

/////////////////////////////////////////////////////////////////////
// Paramètres ///////////////////////////////////////////////////////

function panneauParametres(event) {
    var nomBtn = event.srcElement.id;

    // cas où on clique sur le contenu du lien
    if (nomBtn == undefined || nomBtn == '') {
        nomBtn = event.srcElement.parentNode.id;
    }

    switch (nomBtn) {
        case "cnxModeJour":
        case "btnPageJour":
            estModeJour = true;
            activationModeAff();
            break;

        case "cnxModeNuit":
        case "btnPageNuit":
            estModeJour = false;
            activationModeAff();
            break;

        case "btnChangeDevis":
            affichageGestionDevis(true);
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

        document.getElementById("cnxModeNuit").classList.remove("masque");
        document.getElementById("cnxModeJour").classList.add("masque");
    }
    else {
        document.getElementById("btnPageNuit").classList.remove("btnBase");
        document.getElementById("btnPageJour").classList.add("btnBase");

        document.getElementById("cnxModeJour").classList.remove("masque");
        document.getElementById("cnxModeNuit").classList.add("masque");
    }

    document.getElementById("cssJour").disabled = !estModeJour;
    document.getElementById("cssNuit").disabled = estModeJour;

    localStorage.setItem("estModeJour", estModeJour);
}

function affichageGestionDevis(afficher) {
    var form = document.getElementById("bodySelDevis")

    if (afficher) {
        form.classList.remove("masque");
    }
    else {
        form.classList.add("masque");
    }
}

function panneauGestionDevis(event) {
    var nomBtn = event.srcElement.id;

    switch (nomBtn) {
        case "fermerChoixDevis":
            affichageGestionDevis(false);
            break;
        case "validerChoixDevis":
            affichageGestionDevis(false);
            break;
    }
}

/* Active / désactive le panneau "Divers" */
function panneauDivers(event) {
    // TOGGLE : https://developer.mozilla.org/fr/docs/Web/API/Element/classList
    document.getElementById("divers").children[0].classList.toggle("masque");
    /*
    // https://developer.mozilla.org/fr/docs/Web/API/Element/classList
    var pann = document.getElementById("divers").children[0];
    var panneauOuvert = pann.classList.contains("masque");

    if (panneauOuvert) {
        panneauOuvert.classList.remove("masque");
    }
    else {
        panneauOuvert.classList.add("masque");
    }*/
}

/* choix d'une option dans le panneau Divers */
function panneauSelDivers(event) {
    var form = event.srcElement.id;

    switch (form) {
        case "remiseComm":
            document.getElementById("bodySelRemise").classList.remove("masque");
            break;
    }
}

/* Choix d'une remise et de ses options */
function panneauSelRemise(event) {
    var type = event.srcElement.localName;

    if (type == "input" || type =="button") {
        var form = event.srcElement.id;

        switch (form) {
            case "remiseGlobale":
                document.getElementById("selectionArticles").classList.add("masque");

                document.getElementById("pourcRemise").readOnly = false;
                document.getElementById("htRemise").readOnly = false;
                break;

            case "remiseUnitaire":
                document.getElementById("selectionArticles").classList.add("masque");

                document.getElementById("pourcRemise").readOnly = true;
                document.getElementById("htRemise").readOnly = true;

                var listArt = GenListeArticles();

                if (listArt != null && listArt.length > 0) {
                    var selArt = document.getElementById("selArticleRemise");
                    selArt.innerHTML = "";

                    for (var i = 0; i < listArt.length; i++) {
                        //selArt.innerHTML += '<div><input type="radio" name="choixRemiseGlobale_' + i + '" value="' + listArt[i] + '" /><label for="choixRemiseGlobale_' + i + '">' + listArt[i] + '</label><div>'
                        selArt.innerHTML += '<option value="' + i + '">' + listArt[i] + '</option>';
                    }
                }

                if (selArt.innerHTML.length > 0) {
                    document.getElementById("selectionArticles").classList.remove("masque");
                }
                break;

            case "validSelArt":
                document.getElementById("pourcRemise").readOnly = false;
                document.getElementById("htRemise").readOnly = false;

                // récupération de l'ID de la ligne
                // https://stackoverflow.com/a/1085810
                var e = document.getElementById("selArticleRemise");
                var tab = e[e.selectedIndex].innerText.match(patternCbBoxLignRemise);

                if (tab != null && tab.length > 0) {
                    idLigneRemise = Number(tab[0].substring(1, tab[0].length - 1));
                }
                break;


            case "fermerChoixRemise":
                idLigneRemise = null;
                document.getElementById("bodySelRemise").classList.add("masque");
                break;

            case "pourcRemise":
                if (!event.srcElement.readOnly) {
                    //var pourcentage = Number(document.getElementById("pourcRemise").value) / 100;
                    var montantApplique = 0;

                    // on regarde quel bouton radio est cochée
                    var nomBtnRadio = GetRadioSel();

                    switch (nomBtnRadio) {
                        case "remiseGlobale":
                            montantApplique = montantTtcFact;
                            break;

                        // récupération de la valeur de l'article
                        case "remiseUnitaire":
                            montantApplique = GetMontant(document.getElementById(nomLigneDevis + idLigneRemise).children[3].innerText)
                            break;
                    }

                    if (nomBtnRadio != "") {
                        var pourcentage = Number(event.srcElement.value) / 100;

                        if (pourcentage <= 100 && pourcentage > 1) {
                            document.getElementById("htRemise").value = Math.round(pourcentage * montantApplique * 100) / 100;
                        }
                        else {
                            alert("Le pourcentage de réduction ne peut dépasser 100 % ou être inférieur à 0 %.")
                        }
                    }
                }
                break;

            case "validerChoixRemise":
                // on regarde si un bouton radio est sélèctionné ainsi qu'un montant HT

                var montantTtcRemise = document.getElementById("htRemise").value;

                var nomBtnRadio = GetRadioSel();

                if (
                    nomBtnRadio.length > 0 &&
                    montantTtcRemise > 0
                ) {
                    var gamme = "# REMISE";
                    var modele = "GLOBAL";
                    var coupePrinc = "";
                    var prix = "-" + montantTtcRemise;

                    // si c'est une remise sur un article, on précise l'article dans le modèle
                    if (nomBtnRadio == "remiseUnitaire") {
                        var e = document.getElementById("selArticleRemise");
                        modele = e[e.selectedIndex].innerText.toUpperCase();
                    }

                    var ligneAjoute = ajoutLigneDevis(gamme, modele, coupePrinc, prix);

                    // on supprime le bouton d'édition
                    ligneAjoute.children[4].children[0].remove();

                    idLigneRemise = null;
                    document.getElementById("bodySelRemise").classList.add("masque");

                    // remet à zéro les boutons radio
                    var formRadio = document.getElementsByName("choixRemise");
                    if (formRadio != null) {
                        for (var i = 0; i < formRadio.length; i++) {
                                formRadio[i].checked = false
                        }
                    }

                    // efface le contenu de la comboBox des articles
                    document.getElementById("selArticleRemise").innerText = "";
                    document.getElementById("selectionArticles").classList.add("masque");
                    document.getElementById("pourcRemise").value = 0;
                    document.getElementById("htRemise").value = 0;

                    majFacturation();
                }
                else {
                    alert("Vous devez choisir un type de remise ainsi qu'un montant HT supérieur à 0 pour valider cette remise.")
                }
                break;
        }
    }
}

/* Bouton radio choisi pour la remise */
function GetRadioSel() {
    var formRadio = document.getElementsByName("choixRemise");
    var r = "";

    if (formRadio != null) {
        for (var i = 0; i < formRadio.length; i++) {
            if (formRadio[i].checked) {
                r = formRadio[i].id;
                break;
            }
        }
    }

    return r;
}

/* Retourne la liste des articles */
function GenListeArticles() {
    var listArticles = new Array();

    var lenTab = document.getElementById("corpsDevis").children.length;
    for (var i = 0; i < lenTab; i++) {
        formTr = document.getElementById("corpsDevis").children[i];

        if (formTr.id.substring(0, nomLigneDevis.length) == nomLigneDevis) {
            var numLign = formTr.id.substring(nomLigneDevis.length, formTr.id.length);

            listArticles.push("[" + numLign + "] " + formTr.children[0].innerText + " / " + formTr.children[1].innerText + " (" + formTr.children[3].innerText + " €)");
        }
    }

    return listArticles;
}

// interdiction des caractères spéciaux du pavé numérique du clavier d'Android
function paveNumAndroid(event) {
    // https://keycode.info/
    /*
        -   0
        +   61
        .   190 (autorisé)
        *   56
        /   191
        ,   188 (autorisé)
        (   57
        )   48
        =   61
            32
        #   51

        Sur Android, le pavé numérique : - + . , * 8 ( ) = # et ' ' = 0
    */

    if (event.keyCode == 0) {       
        event.preventDefault();
        event.stopPropagation();
        event.returnValue = false;
    }
}

/////////////////////////////////////////////////////////////////////
// Evènements ///////////////////////////////////////////////////////

// page de connexion
document.getElementById("btnCnx").addEventListener("click", cnxUtilisateur, false);
document.getElementById("modeAffichage").addEventListener("click", cnxModeAffichage, false);

// menu
document.getElementById("menu").addEventListener("click", changePage, false);

// devis
document.getElementById("corpsDevis").addEventListener("click", gestionDevis, false);

// affichage
document.getElementById("parametres").addEventListener("click", panneauParametres, false);

// gestion de la fenêtre des devis
document.getElementById("choixSelDevis").addEventListener("click", panneauGestionDevis, false);

// menu "Divers"
document.getElementById("divers").addEventListener("click", panneauDivers, false);

// sélection d'une ligne du menu
document.getElementById("choixOptionsDivers").addEventListener("click", panneauSelDivers, false);

// sélection d'une remise et de ses options
document.getElementById("bodySelRemise").addEventListener("click", panneauSelRemise, false);

// interdiction de la saisie de certains caractères via le pavé numérique Android
// https://stackoverflow.com/a/41715052
document.getElementById("saisiePrixCtrl").addEventListener("keydown", paveNumAndroid, false);
document.getElementById("pourcRemise").addEventListener("keydown", paveNumAndroid, false);
document.getElementById("htRemise").addEventListener("keydown", paveNumAndroid, false);

// à la fin du chargement du contenu
window.onload = finChargementPage;