<?php

$demande = "";
$retour = "";

if (isset($_REQUEST) && count($_REQUEST) > 0)
{
    require_once('./inc/fonctions.php');

    extract($_REQUEST);

    $demande = trim($demande);

    switch($demande)
    {
        case "listeClients":
            $retour = GetListeClients();
            break;
        default :
            $retour = "Syntaxe : index.php?demande=[la demande]";
    }
}

header("Content-Type: text/plain");

//var_dump($_REQUEST);

echo $retour;

?>