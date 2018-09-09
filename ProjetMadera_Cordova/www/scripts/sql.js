﻿nomBdd = 'designpattern';
nomTable = 'listeClients';
url = "http://127.0.0.1/projetMadera_Cordova/index.php";

var xhr;
var db;
var cnx;

// on tente l'ouverture de la base de données au démarrage
document.addEventListener("deviceready", OuvertureBddLocale, false);

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
/*
function Echec(cnx, err) {
    console.log("Erreur générale : " + err);
}

function CreationBdd(cnx) {
    console.log("Début du requétage.");

    // on supprime les précédentes données
    cnx.executeSql("DROP TABLE IF EXISTS " + nomTable);

    // on créer une structure identique aux données qui seront reçues
    cnx.executeSql("CREATE TABLE IF NOT EXISTS " + nomTable + " (id, prenom, nom)");
}

// l'objet XHR (Ajax) renvoi ici les données reçues
// https://openclassrooms.com/fr/courses/245710-ajax-et-lechange-de-donnees-en-javascript/244798-lobjet-xmlhttprequest
/*
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
        // données reçues
        RemplissageBdd(xhr.responseText)
    }
};
*/

function TelechargementDonnees() {
    console.log("Envoi de la demande XHR.")
    xhr = new XMLHttpRequest(); // création d'un nouvel objet AJAX

    xhr.open("POST", url, true); // méthode d'envoi des données + url
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // nécessaire uniquement en POST
    xhr.onload() = function () {
        if (xhr.status === 200) {
            alert('Something went wrong.  Name is now ' + xhr.responseText);
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    xhr.send("demande=listeClients");
}

function RemplissageBdd(json) {
    console.log("Réception de données.")
    // on converti le paramètre en objet JSON

    var objetJson = JSON.parse(json);
    for (var j in objetJson) {
        console.log("Ajout d'une entrée dans la base de données locale.")
        cnx.executeSql("INSERT INTO " + nomTable + "(id unique, prenom, nom) VALUES (" + j["id"] + ", " + j["nom"] + ", " + j["prenom"] + ")");
    }
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
}*/