async function affichageLivreEmpruntes() {
    const espaceEmprunts = document.getElementById("listeLivresEmpruntes");
    espaceEmprunts.innerHTML = "";
  
    const response = await fetch('php/Controller/ControllerEmprunt.php?action=readAll');

    if(response.ok) {
        const listeEmprunts = await response.json();
        const ul = document.createElement("ul");
        for (const emprunt of listeEmprunts) {
            const li = document.createElement("li");
            const p = document.createElement("p");
            const img1 = document.createElement("img");
            const img2 = document.createElement("img");
            const img3 = document.createElement("img");
        
            img1.src = `img/image.svg`;
            img2.src='img/person.svg';
            img3.src = 'img/x.svg';
        
            p.setAttribute("onclick", `deleteEmprunt(${emprunt.idLivre})`);
            img2.setAttribute("onclick", `affichagePersonne(${emprunt.idAdherent})`);
            img3.setAttribute("onclick", `deleteLivreEmprunt(${emprunt.idLivre})`);
        
            const responseLivreEmprunt = await fetch(`php/Controller/ControllerLivre.php?action=read&id=${emprunt.idLivre}`);
            if(responseLivreEmprunt.ok) {        
                const infoLivre = await responseLivreEmprunt.json();
                p.innerHTML = `${infoLivre.idLivre}-${infoLivre.titreLivre}`;
                img1.setAttribute("onclick", `afficheCouverture("${infoLivre.titreLivre}")`);
                p.style.display = "inline";
                espaceEmprunts.appendChild(p);
                li.appendChild(p);
                li.appendChild(img1);
                li.appendChild(img2);
                li.appendChild(img3);
                ul.appendChild(li);
            }
        }
        espaceEmprunts.append(ul);
        }
  }

async function affichagePersonne(idLivre){

    const response = await fetch(`php/Controller/ControllerAdherent.php?action=read&id=${idLivre}`);
    if(response.ok){
        const donnees = await response.json();
        swal({
            title : `La personne ayant emprunté le livre est : ${donnees.nomAdherent}`,
            icon : "info",
        });
    }
    else{
        console.log('error');
    }
}

async function deleteEmprunt(idLivre){
    swal({
        title : `Voulez vous rendre ce livre ?`,
        buttons : true,
        icon : "warning",
        dangerMode: true,
    }).then(async (willConfirm)=>{
        if(willConfirm) {
            let response = await fetch(`php/Controller/ControllerEmprunt.php?action=delete&idLivre=${idLivre}`);
            console.log(response);
            const data = await response.text();
            console.log(data);
            if(response.ok){
                affichageLivreDispo();
                affichageLivreEmpruntes();
                affichageAdherents();
                swal({
                    title : 'Livre rendu !',
                    icon : 'success',
                })
            }
            else{
                swal("Il y a eu une erreur, veuillez recommencer.",{
                    icon : "error"
                });
            }
        }
        else{
            swal({
                title: 'Livre non rendu !',
                icon : 'error'
            })
        }
    })
    return null;
}

async function deleteLivreEmprunt(idLivre){
    swal({
        title : "Etes vous sur de détruire ce livre ?",
        icon : "warning",
        buttons : true,
        dangerMode: true,
    }).then(async (willeDelete)=>{
        if(willeDelete){
            let response = await fetch(`php/Controller/ControllerLivre.php?action=deleteid=${idLivre}`);
            const data = await response.text();
            console.log(data);
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
        }
        else{
            swal("Le livre n'a pas été supprimé",{
                icon : "error"
            });
        }
    })
    return null;
}