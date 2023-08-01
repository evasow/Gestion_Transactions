"use strict";
// console.log("Starting");
// ------------------Constantes--------------------------------
const url = 'http://127.0.0.1:8000/api/compte';
const Fournisseurs = ["Orange Money", "Wave", "Wari"];
const Transactions = ["depot", "retrait", "transfert"];
// -----------------HTMLElement--------------------------------
let numExp = document.querySelector('#numExp');
let numDest = document.querySelector('#numDest');
let nomExp = document.querySelector('#nomExp');
let nomDest = document.querySelector('#nomDest');
let colorExp = document.querySelector('.colorExp');
let fourn = document.querySelector("#fourn");
let trans = document.querySelector("#trans");
let montant = document.querySelector("#montant");
let valider = document.querySelector("#valider");
let success = document.querySelector("#success");
let myform = document.querySelector("#myform");
let histTrans = document.querySelector("#histTrans");
let historique = document.querySelector("#historique");
let ulhist = document.querySelector(".ulhist");
let destinataire = document.querySelector("#destinataire");
// form Data------------------------
let client = document.querySelector("#client");
let compt = document.querySelector("#compte");
// -----------------------Enumeration-----------------------------
var ColorExp;
(function (ColorExp) {
    ColorExp["OM"] = "orange";
    ColorExp["WV"] = "#00bfff";
    ColorExp["WR"] = "green";
    ColorExp["NEUTRE"] = "grey";
})(ColorExp || (ColorExp = {}));
valider.addEventListener("click", () => {
    console.log(document.head.querySelector('[name="csrf-token"]'));
    const csrfToken = document.head.querySelector('[name="csrf-token"]').content;
    const object = {
        typeTrans: trans.value,
        montantTrans: montant.value,
        client_id: nomDest.getAttribute("idClient"),
        compte_id: nomDest.getAttribute("idCompte"),
        numDestinataire: numDest.value,
    };
    fetch('http://127.0.0.1:8000/api/transaction', {
        method: 'POST',
        body: JSON.stringify(object),
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
        },
    }).then((res) => {
        if (res.ok) {
            console.log("Données insérées avec succès");
        }
        else {
            console.log("Error");
        }
    });
});
// ------------------------Expediteurs------------------------
// Fonction fetch data
const fetchData = (url) => {
    return fetch(url)
        .then(res => res.json())
        .then(data => data);
};
// ----------------------fetch donnees comptes------------------------
let tabNums = [];
let tabNumComptes = [];
fetchData(url).then(data => {
    let donnees = data.data;
    console.log(donnees);
    donnees.forEach((element) => {
        tabNums.push(element.client.tel);
        tabNumComptes.push(element.numCompte);
        numExp.addEventListener('input', () => {
            //     montant.addEventListener("input",()=>{
            //         verifieMontant(montant, 500, +element.solde)
            //     }); 
            //     valider.addEventListener("click",()=>{
            //         if (numExp.value!=="") {
            //             notif("alert-success")
            //         }
            //         myform.reset();
            //     });
            //     historiqueTrans(element.transactions);
        });
        // ------------Nom destinataires------------
        numDest.addEventListener('input', () => {
            if (+numDest.value == element.client.tel || numDest.value == element.numCompte) {
                console.log(element.client.prenom + " " + element.client.nom);
                nomDest.value = element.client.prenom + " " + element.client.nom;
            }
        });
        // ---------historiques transactions--------
    });
    //   --------------------evenement expediteur------------------------
    numExp.addEventListener('input', (e) => {
        console.log(e.target);
        let trouveNum = tabNums.some(element => element == +numExp.value);
        let trouveNumCompte = tabNumComptes.some(element => element == numExp.value);
        if (trouveNum || trouveNumCompte) {
            let compte = donnees.find(element => element.client.tel == +numExp.value || element.numCompte == numExp.value);
            if (compte) {
                nomExp.value = compte.client.prenom + " " + compte.client.nom;
                nomExp.setAttribute("idClient", compte.client.id.toString());
                nomExp.setAttribute("idCompte", compte.client.id.toString());
                console.log(nomExp);
                let fourn = compte.numCompte.split("_")["0"];
                colorExpediteur(colorExp, fourn);
                historiqueTrans(compte.transactions);
            }
        }
        else if (!trouveNum || !trouveNumCompte) {
            nomExp.value = "";
            colorExpediteur(colorExp, "NEUTRE");
        }
    });
});
// function pour color l'expéditeur
function colorExpediteur(span, fourn) {
    if (fourn == "WV") {
        span.style.backgroundColor = ColorExp.WV;
    }
    else if (fourn == "OM") {
        span.style.backgroundColor = ColorExp.OM;
    }
    else if (fourn == "WR") {
        span.style.backgroundColor = ColorExp.WR;
    }
    else if (fourn == "NEUTRE") {
        span.style.backgroundColor = ColorExp.NEUTRE;
    }
    // span.style.backgroundColor=ColorExp[fourn]
}
// --------------------Transaction------------------------
// Charger le select des fournisseurs
Fournisseurs.forEach(fournisseur => {
    let option = document.createElement('option');
    option.innerHTML = fournisseur;
    fourn.appendChild(option);
});
// ----------------charger le select des transactions
Transactions.forEach(transaction => {
    let option = document.createElement('option');
    option.innerHTML = transaction;
    trans.appendChild(option);
});
//------------------ Vérifier le montant saisie pour la transaction
montant.addEventListener("input", () => {
    verifieMontant(montant, 500);
});
//----------------- Fonction pour controler le montant saisie
function verifieMontant(input, montant, solde = 1000000) {
    if (+input.value < montant || +input.value > solde) {
        input.style.color = "red";
        valider.setAttribute("disabled", "disabled");
    }
    else {
        input.style.color = "green";
        valider.removeAttribute("disabled");
    }
}
// ---------------------Notification transaction --------------------
function notif(color) {
    success.classList.remove("d-none");
    success.classList.add(color);
    setTimeout(() => {
        success.classList.add("d-none");
    }, 5000);
}
// --------historiqueTrans--------
function historiqueTrans(transactions) {
    histTrans.addEventListener("click", () => {
        console.log(historique);
        historique.classList.toggle("d-none");
        // ulhist.innerHTML='';
        // transactions.forEach((transaction:Transaction) => {
        //     let li=document.createElement("li");
        //     li.classList.add("list-group-item");
        //     console.log(transaction);
        //     li.innerHTML=transaction.typeTrans+" "+transaction.montantTrans+" "+transaction.numDestinataire;
        //     ulhist.appendChild(li);
        // });
    });
}
// --------------retait / destinataire none--------------------------------
trans.addEventListener('change', () => {
    if (trans.value == "retrait") {
        destinataire.classList.add('d-none');
    }
    else {
        destinataire.classList.remove('d-none');
    }
});
