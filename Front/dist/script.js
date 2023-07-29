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
// -----------------------Enumeration-----------------------------
var ColorExp;
(function (ColorExp) {
    ColorExp["OM"] = "orange";
    ColorExp["WV"] = "#00bfff";
    ColorExp["WR"] = "green";
})(ColorExp || (ColorExp = {}));
// ------------------------Expediteurs------------------------
// Fonction fetch data
const fetchData = (url) => {
    return fetch(url)
        .then(res => res.json())
        .then(data => data);
};
// fetch donnees comptes
fetchData(url).then(data => {
    let donnees = data.data;
    console.log(donnees);
    donnees.forEach((element) => {
        numExp.addEventListener('input', () => {
            if (+numExp.value == element.client.tel || numExp.value == element.numCompte) {
                console.log(element.client.prenom + " " + element.client.nom);
                nomExp.value = element.client.prenom + " " + element.client.nom;
                let fourn = element.numCompte.split("_")["0"];
                colorExpediteur(colorExp, fourn);
                console.log(+element.solde);
                montant.addEventListener("input", () => {
                    verifieMontant(montant, 500, +element.solde);
                });
                valider.addEventListener("click", () => {
                    if (numExp.value !== "") {
                        notif("alert-success");
                    }
                    else if (numExp.value == "") {
                        notif("alert-danger");
                    }
                    myform.reset();
                });
            }
        });
        numDest.addEventListener('input', () => {
            if (+numDest.value == element.client.tel || numDest.value == element.numCompte) {
                console.log(element.client.prenom + " " + element.client.nom);
                nomDest.value = element.client.prenom + " " + element.client.nom;
            }
        });
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
}
// --------------------Transaction------------------------
// Charger le select des fournisseurs
Fournisseurs.forEach(fournisseur => {
    let option = document.createElement('option');
    option.innerHTML = fournisseur;
    fourn.appendChild(option);
});
// charger le select des transactions
Transactions.forEach(transaction => {
    let option = document.createElement('option');
    option.innerHTML = transaction;
    trans.appendChild(option);
});
// Vérifier le montant saisie pour la transaction
montant.addEventListener("input", () => {
    verifieMontant(montant, 500);
});
// Fonction pour controler le montant saisie
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
function notif(color) {
    success.classList.remove("d-none");
    success.classList.add(color);
    setTimeout(() => {
        success.classList.add("d-none");
    }, 5000);
}
// Valider transaction
