<?php

require_once "Model.php";
require_once "ModelLivre.php";
require_once "ModelEmprunt.php";

class ModelAdherent extends Model {
    static $object = "adherent";
    static $primary = "idAdherent";

    public static function countNbLivresEmprunts($idAdh)
    {
        try {
            $sql = "SELECT COUNT(*) FROM adherent a JOIN emprunt e ON a.idAdherent=e.idAdherent WHERE a.idAdherent=:idA;";
            $req_prep = Model::$pdo->prepare($sql);
            $values = array(
                "primary" => $idAdh
            );
            return $req_prep->execute($values);
        }catch (PDOException $e){
            echo $e->getMessage(); // affiche un message d'erreur
            die();
        }
    }
}