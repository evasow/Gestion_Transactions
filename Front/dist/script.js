"use strict";
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
let trans = document.querySelector("#transaction");
let montant = document.querySelector("#montant");
let montantEnv = document.querySelector("#montantEnv");
let soldeError = document.querySelector('#soldeError');
let sold = document.querySelector("#solde");
let divmtnEnv = document.querySelector("#divmtnEnv");
let frais = document.querySelector("#frais");
let valider = document.querySelector("#valider");
let success = document.querySelector("#success");
let myform = document.querySelector("#myform");
let histTrans = document.querySelector("#histTrans");
let historique = document.querySelector("#historique");
let ulhist = document.querySelector(".ulhist");
let destinataire = document.querySelector("#destinataire");
let notification = document.querySelector("#notif");
let code = document.querySelector("#code");
let withCode = document.querySelector("#withCode");
let mtnFrais = document.querySelector("#mtnFrais");
let invalideFourn = document.querySelector("#invalideFourn");
let ajoutClient = document.querySelector("#insertClient");
let nomClient = document.querySelector("#nomClient");
let prenomClient = document.querySelector("#prenomClient");
let telClient = document.querySelector("#telClient");
let insertCompte = document.querySelector("#insertCompte");
let numNvClient = document.querySelector("#numNvClient");
let nomNvClient = document.querySelector("#nomNvClient");
let fournNvClient = document.querySelector("#fournNvClient");
let numClClient = document.querySelector("#numClClient");
let nomClClient = document.querySelector("#nomClClient");
let closeCompte = document.querySelector("#closeCompte");
let numblClient = document.querySelector("#numblClient");
let nomblClient = document.querySelector("#nomblClient");
let bloquer = document.querySelector("#bloquer");
let debloquer = document.querySelector("#debloquer");
let annTrans = document.querySelector("#annTrans");
let numTrans = document.querySelector("#numTrans");
// form Data------------------------
let client = document.querySelector("#client");
let compt = document.querySelector("#compte");
// -----------------------Enumeration-----------------------------
var ColorExp;
(function (ColorExp) {
    ColorExp["OM"] = "orange";
    ColorExp["WV"] = "#00bfff";
    ColorExp["WR"] = "green";
    ColorExp["CB"] = "yellow";
    ColorExp["NEUTRE"] = "grey";
})(ColorExp || (ColorExp = {}));
var Frais;
(function (Frais) {
    Frais["OM_WV"] = "1%";
    Frais["WR"] = "2%";
    Frais["CB"] = "5%";
})(Frais || (Frais = {}));
var Fournisseur;
(function (Fournisseur) {
    Fournisseur["OM"] = "Orange Money";
    Fournisseur["WV"] = "Wave";
    Fournisseur["WR"] = "Wari";
    Fournisseur["CB"] = "Compte Bancaire";
})(Fournisseur || (Fournisseur = {}));
// ------fonction faire une transaction -----------------------
function validerTrans() {
    valider.addEventListener("click", () => {
        console.log(trans.value, +montant.value, nomExp.getAttribute("idClient"), nomExp.getAttribute("idCompte"), +numDest.value);
        const object = {
            typeTrans: trans.value,
            montantTrans: +montant.value,
            client_id: nomExp.getAttribute("idClient"),
            compte_id: nomExp.getAttribute("idCompte"),
            client_dest_id: nomDest.getAttribute("destId"),
            transfert_type: withCode.value,
            fournisseur: fourn.value,
            type_cb_trans: 0
        };
        fetchDatas(object, "POST", 'http://127.0.0.1:8000/api/transaction');
        myform.reset();
        // location.reload(); 
    });
}
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
        // ------------Nom destinataires------------
        numDest.addEventListener('input', () => {
            if (+numDest.value == element.client.tel || numDest.value == element.numCompte) {
                console.log(element.client.prenom + " " + element.client.nom);
                nomDest.value = element.client.prenom + " " + element.client.nom;
                nomDest.setAttribute("destId", element.client.id.toString());
            }
        });
        // ---------historiques transactions--------
    });
    //   -----------------evenement expediteur----------
    numExp.addEventListener('input', (e) => {
        let trouveNum = tabNums.some(element => element == +numExp.value);
        let trouveNumCompte = tabNumComptes.some(element => element == numExp.value);
        if (trouveNum || trouveNumCompte) {
            let compte = donnees.find(element => element.client.tel == +numExp.value || element.numCompte == numExp.value);
            if (compte) {
                nomExp.value = compte.client.prenom + " " + compte.client.nom;
                nomExp.setAttribute("idClient", compte.client.id.toString());
                nomExp.setAttribute("idCompte", compte.id.toString());
                let fourn = compte.numCompte.split("_")["0"];
                colorExpediteur(colorExp, fourn);
                historiqueTrans(compte.transactions);
                MontantValide(compte.solde);
                validerTrans();
            }
        }
        else if (!trouveNum || !trouveNumCompte) {
            nomExp.value = "";
            colorExpediteur(colorExp, "NEUTRE");
        }
    });
});
// -------------function pour color l'expéditeur-------------------
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
// -----------------------function charger select --------------------
function chargerSelect(select, tableau) {
    tableau.forEach((element) => {
        let option = document.createElement("option");
        option.innerHTML = element;
        select.appendChild(option);
    });
}
// --------------------Transaction------------------------
// Charger le select des fournisseurs
chargerSelect(fourn, Fournisseurs);
// ----------------charger le select des transactions
chargerSelect(trans, Transactions);
// ----------------charger le select des fournisseurs pour nvClients------------------------
chargerSelect(fournNvClient, Object.keys(Fournisseur));
// ----verifier frais operateur--------
function fraisOperateur() {
    if (fourn.value === "Orange Money" || fourn.value === "Wave") {
        montantEnv.value = Math.round(+montant.value - (+montant.value * 0.01)).toString();
    }
    else {
        montantEnv.value = (+montant.value - (+montant.value * 0.05)).toString();
    }
}
//------------------ Vérifier le montant saisie pour la transaction
function MontantValide(solde) {
    montant.addEventListener("input", () => {
        if (trans.value !== "depot") {
            verifieMontant(montant, 500, solde);
            fraisOperateur();
            if (verifieMontant(montant, 500, solde)) {
                soldeError.classList.remove("d-none");
                sold.innerHTML = `<b>solde : ${solde.toString()}</b>`;
            }
            else {
                soldeError.classList.add("d-none");
            }
        }
    });
}
//----------------- Fonction pour controler le montant saisie
function verifieMontant(input, montant, solde = 1000000) {
    if (+input.value < montant || +input.value > solde) {
        input.style.color = "red";
        valider.setAttribute("disabled", "disabled");
        return true;
    }
    else {
        input.style.color = "green";
        valider.removeAttribute("disabled");
        return false;
    }
}
// ---------------------Notification transaction --------------------
function notif(color, notif, message) {
    notif.innerHTML = message;
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
        ulhist.innerHTML = '';
        transactions.forEach((transaction) => {
            let li = document.createElement("li");
            li.classList.add("list-group-item");
            console.log(transaction);
            // li.innerHTML=transaction.typeTrans+" "+transaction.montantTrans+" "+transaction.numDestinataire;
            const date = new Date(transaction.date);
            li.innerHTML = `<div class="d-flex justify-content-around>
            <h6 class="text-info"><b>${transaction.typeTrans}</b></h6>
            
            </div>
            
            <span>${date.toLocaleDateString()}</span>
            <div class="d-flex justify-content-end"><h6 class="text-info">${transaction.montantTrans}</h6></div>`;
            ulhist.appendChild(li);
        });
    });
}
// -----function transaction avec ou sans code -----
function transCode() {
    withCode.addEventListener("change", () => {
        if (withCode.checked) {
            withCode.value = "1";
            console.log(withCode.value);
        }
        else {
            withCode.value = "0";
            console.log(withCode.value);
        }
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
    if (trans.value == "transfert") {
        divmtnEnv.classList.remove('d-none');
        if (fourn.value == "Orange Money" || fourn.value == "Wave") {
            code.classList.remove('d-none');
            transCode();
            mtnFrais.innerHTML = Frais.OM_WV;
            frais.classList.remove('d-none');
        }
        else if (fourn.value == "Wari") {
            mtnFrais.innerHTML = Frais.WR;
            frais.classList.remove('d-none');
        }
    }
    else {
        divmtnEnv.classList.add('d-none');
        code.classList.add('d-none');
        frais.classList.add('d-none');
    }
});
fourn.addEventListener("change", () => {
    console.log(numExp.value.split("_")[0]);
    fraisOperateur();
    if (trans.value == "transfert") {
        if (fourn.value == "Orange Money" || fourn.value == "Wave") {
            mtnFrais.innerHTML = Frais.OM_WV;
        }
        else {
            mtnFrais.innerHTML = Frais.WR;
            code.classList.add('d-none');
        }
    }
});
// -----------------Ajout Client ------------------------
ajoutClient.addEventListener("click", () => {
    if (!(isTel(telClient.value))) {
        alert("Numero de telephone invalide");
        return;
    }
    const object = {
        nom: nomClient.value,
        prenom: prenomClient.value,
        tel: +telClient.value
    };
    fetchDatas(object, "POST", 'http://127.0.0.1:8000/api/client');
});
// -----------------Ajout Compte ------------------------
findClientByNum(numNvClient, nomNvClient);
insertCompte.addEventListener("click", () => {
    const object = {
        solde: 0,
        client_id: nomNvClient.getAttribute("idCli"),
        numCompte: fournNvClient.value + "_" + numNvClient.value
    };
    fetchDatas(object, "POST", 'http://127.0.0.1:8000/api/compte');
});
// -----------------Fermer Compte ------------------------
findClientByNum(numClClient, nomClClient);
closeCompte.addEventListener("click", () => {
    console.log(nomClClient);
    const object = {
        id: nomClClient.getAttribute("idCli"),
    };
    fetchDatas(object, "PUT", 'http://127.0.0.1:8000/api/compte/' + nomClClient.getAttribute("idCli"));
});
// -----------------Blocage Compte ------------------------
function blocageCompte(button, numClient, nomClient, etat) {
    findClientByNum(numClient, nomClient);
    button.addEventListener("click", () => {
        const object = {
            id: nomClient.getAttribute("idCli"),
        };
        fetchDatas(object, "PUT", 'http://127.0.0.1:8000/api/compte/' + nomClient.getAttribute("idCli") + '/' + etat);
    });
}
blocageCompte(bloquer, numblClient, nomblClient, 1);
blocageCompte(debloquer, numblClient, nomblClient, 0);
// -----------------Annuler Transaction ------------------------
annTrans.addEventListener("click", () => {
    const object = {
        id: numTrans.value
    };
    fetchDatas(object, "post", 'http://127.0.0.1:8000/api/transaction/' + numTrans.value);
});
// --------------------function fetch POST data --------------------
function fetchDatas(object, method, url) {
    fetch(url, {
        method: method,
        body: JSON.stringify(object),
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
    })
        .then((res) => {
        return res.json();
    })
        .then((data) => {
        console.log(data);
        notif("alert-success", notification, data.message);
    });
}
// ----------------function trouver client par son numero--------------------
function findClientByNum(inputNum, inputNom) {
    inputNum.addEventListener("change", () => {
        if (!(isNumCompte(inputNum.value) || isTel(inputNum.value))) {
            alert("Numero de compte ou telephone invalide");
            return;
        }
        inputNom.value = "";
        fetch("http://127.0.0.1:8000/api/client/" + inputNum.value)
            .then(response => response.json())
            .then(dataResponse => {
            console.log(dataResponse);
            if (dataResponse.data) {
                inputNom.value = dataResponse.data.prenom + " " + dataResponse.data.nom;
                inputNom.setAttribute("idCli", dataResponse.data.id);
            }
            else {
                console.log(dataResponse);
                alert(dataResponse.message);
            }
        });
    });
}
// ------------------------validate numero------------------------
function isTel(telephone) {
    // let supEspace=telephone.split(' ').join("");
    let tel = telephone.replace(' ', "");
    if (tel.length != 9) {
        return false;
    }
    if (isNaN(+tel)) {
        return false;
    }
    return true;
}
function isNumCompte(numCompte) {
    let supEspace = numCompte.trim();
    let explod = numCompte.split('_');
    if (explod.length != 2 || !isTel(explod[1]) || !(Object.keys(Fournisseur).includes(explod[0]))) {
        return false;
    }
    return true;
}
