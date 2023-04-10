async function affichageLivreDispo(){
    let espaceLivre = document.getElementById("listeLivresDisponibles");
    espaceLivre.innerHTML = "";
    await fetch('php/Controller/ControllerLivre.php?action=readNotBorrowed',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(response => response.json())
    .then(listeLivre => {
        let ul = document.createElement("ul")
        for(let livre of listeLivre){
            let li = document.createElement("li");
            let p = document.createElement("p");
            let img = document.createElement("img");
            let img2 = document.createElement("img");

            p.innerHTML = `${livre.idLivre}-${livre.titreLivre}`
            p.style.display = "inline";

            img.src = `img/image.svg`;
            img2.src = 'img/x.svg';

            p.setAttribute("onclick", `ajouteEmprunt("${livre.idLivre}","${livre.titreLivre}")`);
            img.setAttribute("onclick", `afficheCouverture("${livre.titreLivre}")`);
            img2.setAttribute("onclick", `deleteLivre("${livre.titreLivre}",'${livre.idLivre}')`);

            li.appendChild(p);
            li.appendChild(img);
            li.appendChild(img2);
            ul.appendChild(li)
        }
        espaceLivre.append(ul);
    });
}

async function ajouterLivre(){
    let inputLivre = document.getElementById("titreLivre");
    const response = await fetch('php/Controller/ControllerLivre.php?action=create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `titre=${inputLivre.value}`
    });
    if(response.ok){
        affichageLivreDispo();
        inputLivre.value = "";
    }
}

async function ajouteEmprunt(idLivre, titreLivre){
    swal({
        text: `Veuillez entrer l\'identifiant de l\'adhérent qui empruntera ${titreLivre}`,
        content : 'input',
        button : {
            text: "Valider",
            closeModal : true
        }
    }).then(async (idAhderent)=>{
        if (!idAhderent) throw null;

        const response = await fetch('php/Controller/ControllerEmprunt.php?action=create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `idAdherent=${idAhderent}&idLivre=${idLivre}`
        });
        if(response.ok){
            affichageLivreDispo();
            affichageLivreEmpruntes();
            affichageAdherents();
        }
    })
}

async function deleteLivre(titre, id) {
    swal({
        title : `Etes vous sur de détruire ${titre} ?`,
        icon : "warning",
        buttons : true,
        dangerMode: true,
    }).then(async (willDelete) => {
        if(willDelete){
            const response = await fetch(`php/Controller/ControllerLivre.php?action=delete&id=${id}`);
            const data = await response.text();
            if(response.ok){
                affichageLivreDispo();
                affichageLivreEmpruntes();
                affichageAdherents();

                swal("Le livre a été supprimé",{
                    icon : "success"
                });
            }
            else{
                swal("Il y a eu une erreur, veuillez recommencer.",{
                    icon : "error"
                });
            }
        }else{
            swal("Le livre n'a pas été supprimé",{
                icon : "error"
            });
        }
    })
    return null;
}

async function afficheCouverture(nom){
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${nom}&maxResults=40`);
    if(response.ok){
        const data = await response.json();
        const link = data.items[0].selfLink;
        const response2 = await fetch(link);
        if(response2.ok){
            const donnees = await response2.json();
            let img;
            try{
                img = donnees.volumeInfo.imageLinks.thumbnail;
                swal({
                    title: nom,
                    icon : img,
                });
            }catch (Exception){
                console.log(Exception)
                swal({
                    title : nom,
                    icon : "error",
                    text: "Pas de couverture disponible"
                });
            }
        }
        else{
            swal("Il y a eu une erreur, veuillez recommencer.",{
                icon : "error"
            });
        }
    }
    else{
        swal("Il y a eu une erreur, veuillez recommencer.",{
            icon : "error"
        });

    }
}