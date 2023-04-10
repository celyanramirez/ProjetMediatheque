function affichageAdherents(){
    let espaceAdherents = document.getElementById("listeAdherents");
    espaceAdherents.innerHTML = "";
    let url = "php/Controller/ControllerAdherent.php?action=readAll";
    getData(url)
        .then(data=>{
            let listeAdherents = data;
            let ul = document.createElement("ul");
            for(let adherent of listeAdherents){
                let urlRead = `php/Controller/ControllerEmprunt.php?action=countEmprunt&idAdherent=${adherent.idAdherent}`;
                getData(urlRead)
                    .then(data =>{
                        let nb = data[0].nb;
                        let li = document.createElement("li");
                        let p = document.createElement("p");
                        let imgBook = document.createElement("img");
                        imgBook.src = 'img/book.svg';
                        if(nb>0){
                            p.innerHTML = `${adherent.idAdherent}-${adherent.nomAdherent} (${nb} emprunts <img id="icoLivre" src='img/book.ico'>) `;
                        }else {
                            p.innerHTML = `${adherent.idAdherent}-${adherent.nomAdherent}`;
                        }
                        let urlLivre = `php/Controller/ControllerEmprunt.php?action=emprunts&idAdherent=${adherent.idAdherent}`
                        getData(urlLivre).then(data=>{
                            if(nb>0){
                                let result = data.map(a => a.titreLivre);
                                p.setAttribute("onclick", `afficherLivreAdherent("${result}","${adherent.nomAdherent}")`);
                            }else{
                                p.setAttribute("onclick",`afficherSansLivre("${adherent.nomAdherent}")`);
                            }
                        })
                        p.style.display = "inline";
                        let imgCroix = document.createElement("img");
                        imgCroix.src = 'img/x.svg';
                        imgCroix.setAttribute("onclick",`deleteAdherent('${adherent.nomAdherent}','${adherent.idAdherent}')`);
                        li.appendChild(p);
                        li.appendChild(imgCroix);
                        ul.appendChild(li);
                    });
            }
            espaceAdherents.append(ul)
        });
}

function deleteAdherent(nom,id){
    swal({
        title : `Etes vous sur de supprimer l'adhérent ${nom} ?`,
        icon : "warning",
        buttons : true,
        dangerMode: true,
    }).then(async (willDelete) => {
        console.log("test");
        if(willDelete){
            let response = await fetch(`php/Controller/ControllerAdherent.php?action=delete&id=${id}`);
            console.log(response);
            const data = await response.text();
            affichageAdherents();
            affichageLivreEmpruntes();
            affichageLivreDispo();
            swal("L'adhérent a été supprimé",{
                icon : "success"
            });
        }else{
            swal("L'adhérent n'a pas été supprimé", {
                icon : "error"
            });
        }
    })
    return null;
}

async function ajouterAdherent() {
    let response = await fetch('php/Controller/ControllerAdherent.php?action=create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `nom=${document.getElementById('nomAdherent').value}`
    });
    let field = document.getElementById('nomAdherent');
    field.value = "";
    const data = await response.text()
    affichageAdherents();
    //A modif et appeler une fonction de l'autre script
}

function afficherSansLivre(nomAdherent){
    swal({
        icon : "info",
        title : `L'adherent ${nomAdherent} n'a pas d'emprunt actuellement.`,
    })
}

function afficherLivreAdherent(result, nomAdherent){
    swal({
        title: `L'adherent ${nomAdherent} a emprunté :`,
        text : splitTextOnComma(result),
        icon : "info",
    });
}

function splitTextOnComma(text){
    let title = text.split(',');
    let str= "";
    for(let t of title){
        str += " \t► "+t;
        str += "\n";
    }
    return str;
}
