<?php

function Bdd() {
    try {
        $hote = "designpattern";
        $id = "root";
        $mdp = "";

        $bdd = new PDO('mysql:host=localhost;dbname=' . $hote, $id, $mdp) or die (print_r($bdd->errorInfo()));
        $bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $bdd->exec('SET NAMES utf8');

        return $bdd;
    }
    catch (Exception $e) {
        die ('Erreur : ' . $e->getMessage());
    }
}


function GetListeClients() {
    $cnx = Bdd();

    $req = $cnx->prepare("SELECT * FROM personnes");
    //$req->bindParams(":nom", "valeur");
    $req->execute();

    return json_encode($req->fetchAll(PDO::FETCH_CLASS));
}
?>