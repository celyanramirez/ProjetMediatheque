function initialise(){
    affichageAdherents();
    affichageLivreEmpruntes();
    affichageLivreDispo();
}

function getData(url) {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                // la requête est terminée avec succès
                const data = JSON.parse(xhr.responseText);
                resolve(data);  // la promesse est résolue
            } else {
                // erreur pendant la requête
                reject(`${xhr.status}: ${xhr.responseText}`);   // promesse rejetée
            }
        }
        xhr.send();
    });
}



initialise();