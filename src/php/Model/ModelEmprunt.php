<?php

require_once "Model.php";

class ModelEmprunt extends Model {
    static $object = "emprunt";
    static $primary = "idLivre";

        public static function getLivresEmprunts($idAdh){

        try {
            $pdo = self::$pdo;
            $table_name = static::$object;
            $class_name = 'Model' . ucfirst(static::$object);
            $sql = "SELECT titreLivre from livre JOIN emprunt ON livre.idlivre = emprunt.idlivre WHERE emprunt.idadherent = $idAdh";
            $rep = $pdo->query($sql);
            $rep->setFetchMode(PDO::FETCH_CLASS, $class_name);
            return $rep->fetchAll();
        } catch (PDOException $e) {
            echo $e->getMessage(); // affiche un message d'erreur
            die();
        }

    }

    public static function getEmprunteur($idLivre){

        try {
            $pdo = self::$pdo;
            $table_name = static::$object;
            $class_name = 'Model' . ucfirst(static::$object);
            $sql = "SELECT nomAdherent FROM adherent JOIN emprunt ON adherent.idAdherent = emprunt.idAdherent WHERE idLivre = $idLivre";
            $rep = $pdo->query($sql);
            $rep->setFetchMode(PDO::FETCH_CLASS, $class_name);
            return $rep->fetchAll();
        } catch (PDOException $e) {
            echo $e->getMessage(); // affiche un message d'erreur
            die();
        }
    }
}