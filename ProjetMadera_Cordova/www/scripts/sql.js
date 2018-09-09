nomBdd = 'designpattern';
nomTable = 'listeClients';
url = "http://127.0.0.1/projetMadera_Cordova/index.php";

var xhr;
var db;
var cnx;

// on tente l'ouverture de la base de données au démarrage
document.addEventListener("deviceready", OuvertureBddLocale, false);

// utilisation de SQL Lite (ancienne méthode dépréciée)
// https://cordova.apache.org/docs/en/latest/cordova/storage/storage.html#sqlite-plugin

function OuvertureBddLocale() {
    console.log("Tentative d'accès à la base de données locale");

    // on retire le clignotement
    document.getElementById("deviceready").classList.remove("blink");
    
    // on ouvre la base de données locale. Si inexistance, elle est créée.
    db = window.openDatabase(nomBdd, "1.0", nomTable, 200000);
    db.transaction(CreationBdd, EchecOuvBdd, SuccesOuvBdd);
}

function SuccesOuvBdd() {
    console.log("Base de données ouverte avec succès.");

    // en cas de succès, on affiche les options
    document.getElementById("appPrete").classList.remove("masque");
}

function EchecOuvBdd(cnx, err) {
    console.log("Erreur lors de l'ouverture ou de la création de la base de données : " + err);
}

function Echec(cnx, err) {
    console.log("Erreur générale : " + err);
}

function CreationBdd(cnx) {
    // https://github.com/litehelpers/Cordova-sqlite-storage#using-draft-standard-transaction-api
    console.log("Début du requétage.");
    this.cnx = cnx;

    // on supprime les précédentes données
    cnx.executeSql("DROP TABLE IF EXISTS " + nomTable);

    // on créer une structure identique aux données qui seront reçues
    cnx.executeSql("CREATE TABLE IF NOT EXISTS " + nomTable + " (id, prenom, nom)");
}


function TelechargementDonnees() {
    console.log("Envoi de la demande XHR.")
    xhr = new XMLHttpRequest(); // création d'un nouvel objet AJAX

    // l'objet XHR (Ajax) renvoi ici les données reçues
    // https://openclassrooms.com/fr/courses/245710-ajax-et-lechange-de-donnees-en-javascript/244798-lobjet-xmlhttprequest
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            // données reçues
            RemplissageBdd(xhr.responseText)
        }
    };

    xhr.open("POST", url, true); // méthode d'envoi des données + url
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // nécessaire uniquement en POST
    xhr.send("demande=listeClients");
}

function RemplissageBdd(json) {
    console.log("Réception de données.")
    // on converti le paramètre en objet JSON

    var objetJson = JSON.parse(json);
    objetJson.forEach(function (j) {
        console.log("Ajout d'une entrée dans la base de données locale.")
        req = 'INSERT INTO ' + nomTable + ' (`id`, `prenom`, `nom`) VALUES (' + j["id"] + ', "' + j["nom"] + '", "' + j["prenom"] + '")';
        cnx.executeSql(req);
    });
}

// https://www.c-sharpcorner.com/UploadFile/c25b6d/sql-database-in-apache-cordovaphonegap/
function ConsultationBddLoc() {
    cnx.executeSql("SELECT * FROM " + nomTable, [], AffichageListeClients, Echec);
}

function AffichageListeClients(cnx, resultats) {
    var table = document.getElementById("tableDemo").childNodes("tbody");

    for (var r in resultats.rows.item) {
        var tr = document.createElement("tr");
        table.appendChild(tr);

        var td = document.createElement("td");
        tr.appendChild(td);

        var tdText = document.createTextNode(r.id);
        td.appendChild(tdText);

        tdText = document.createTextNode(r.nom);
        td.appendChild(tdText);

        tdText = document.createTextNode(r.prenom);
        td.appendChild(tdText);
    }
}