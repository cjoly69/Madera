// d'après https://github.com/Icenium/Sample-To-Do-App-with-SQLite/blob/master/sample-sqlite/scripts/main.js
var nomTable = 'listeClients';
var url = "http://127.0.0.1/projetMadera_Cordova/serveur/index.php";
var dbName = "madera.db";
var xhr = null;

var app = {};
app.db = null;

document.addEventListener("deviceready", init, false);

function init() {
    app.openDb();
    app.createTable();
}

function telechDonnes() {
    console.log("Envoi de la demande XHR.")
    xhr = new XMLHttpRequest(); // création d'un nouvel objet AJAX

    // l'objet XHR (Ajax) renvoi ici les données reçues
    // https://openclassrooms.com/fr/courses/245710-ajax-et-lechange-de-donnees-en-javascript/244798-lobjet-xmlhttprequest
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            // données reçues
            app.traitementBdd(xhr.responseText)
        }
    };

    xhr.open("POST", url, true); // méthode d'envoi des données + url
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // nécessaire uniquement en POST
    xhr.send("demande=listeClients");
}

app.openDb = function () {
    if (window.navigator.simulator === true || window.navigator.simulator === undefined) {
        // For debugin in simulator fallback to native SQL Lite
        console.log("Utilisation de la BDD native");
        app.db = window.openDatabase(dbName, "1", "Cordova Sim", 200000);
    }
    else {
        console.log("Utilisation de la BDD sqLite");
        app.db = window.sqlitePlugin.openDatabase({ name: dbName, location: "default" });
    }

    affichInterface();
}

app.createTable = function () {
    var db = app.db;

    try {
        db.transaction(function (tx) {
            tx.executeSql(
                "DROP TABLE IF EXISTS `" + nomTable + "`;" +
                "CREATE TABLE IF NOT EXISTS `" + nomTable + "` (`id`, `prenom`, `nom`);", []);
        });
    } catch (e) {
        console.log(e);
    }
    /*
    db.transaction(function (tx) {
        tx.executeSql(
            "DROP TABLE IF EXISTS " + nomTable + ";" +
            "CREATE TABLE IF NOT EXISTS " + nomTable + " (id, prenom, nom);", []);
    });
    */
}

app.traitementBdd = function (json) {
    var db = app.db;

    console.log("Réception de données.")

    // on converti le paramètre en objet JSON
    db.transaction(function (tx) {

        // on regarde si la table existe
        try {
            tx.executeSql("SELECT * FROM " + nomTable);
        } catch (e) {
            app.createTable();
        }

        var params;
        var objetJson = JSON.parse(json);
        objetJson.forEach(function (j) {

            params = [ j["id"], j["nom"], j["prenom"] ]

            console.log("Ajout d'une entrée dans la base de données locale.")
            req = 'INSERT INTO ' + nomTable + ' (`id`, `prenom`, `nom`) VALUES (?1, ?2, ?3)';
            try {
                tx.executeSql(req, params,
                    app.onSuccess,
                    app.onError);
            } catch (e) {
                console.log(e);
            }
        });
    });
}

app.onError = function (tx, e) {
    console.log("Error: " + e.message);
}

app.onSuccess = function (tx, r) {
    console.log("Entrée ajoutée avec succès");
}

function ConsultationBddLoc() {
    var db = app.db;
    db.executeSql("SELECT * FROM " + nomTable, [], AffichageListeClients, Echec);
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

function Echec(cnx, err) {
    console.log("Erreur générale : " + err);
}