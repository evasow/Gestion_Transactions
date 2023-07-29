// console.log("Starting");
// ------------------Constantes--------------------------------
const url = 'http://127.0.0.1:8000/api/compte';
const Fournisseurs : string[]= ["Orange Money","Wave","Wari"]
const Transactions : string[]= ["depot","retrait","transfert"]

// -----------------HTMLElement--------------------------------
let numExp=document.querySelector('#numExp') as HTMLInputElement
let numDest=document.querySelector('#numDest') as HTMLInputElement
let nomExp=document.querySelector('#nomExp') as HTMLInputElement
let nomDest=document.querySelector('#nomDest') as HTMLInputElement
let colorExp=document.querySelector('.colorExp') as HTMLSpanElement
let fourn=document.querySelector("#fourn") as HTMLSelectElement
let trans=document.querySelector("#trans") as HTMLSelectElement
let montant=document.querySelector("#montant") as HTMLInputElement
let valider=document.querySelector("#valider") as HTMLButtonElement
let success=document.querySelector("#success") as HTMLDivElement
let myform=document.querySelector("#myform") as HTMLFormElement

// -----------------------Enumeration-----------------------------
enum ColorExp{
    "OM" = "orange",
    "WV" = "#00bfff",
    "WR" = "green",
}
// ---------------------Interface ou Type-------------------------
interface Compte{
    "solde": number;
    "numCompte": string;
    "client" : {
        "id" : number;
        "nom" : string;
        "prenom" : string;
        "tel" : number;
        "dateNaiss":string;
        "cni" : number;
    };
    "transactions" : [];
}


// ------------------------Expediteurs------------------------
// Fonction fetch data
const fetchData = (url: string) => {
    return fetch(url)
      .then(res => res.json()) 
      .then(data => data);  
}

// fetch donnees comptes
fetchData(url).then(data => {
    let donnees=data.data
    console.log(donnees); 
    donnees.forEach((element : Compte) => {
        numExp.addEventListener('input',()=>{
            if (+numExp.value==element.client.tel || numExp.value==element.numCompte) {
                console.log(element.client.prenom +" "+ element.client.nom); 
                nomExp.value= element.client.prenom +" "+ element.client.nom; 
               let fourn:string= element.numCompte.split("_")["0"]
                colorExpediteur(colorExp, fourn)  
                console.log(+element.solde);    
                
                montant.addEventListener("input",()=>{
                    verifieMontant(montant, 500, +element.solde)
                }); 
                valider.addEventListener("click",()=>{
                    if (numExp.value!=="") {
                        notif("alert-success")
                        
                    }
                    else if (numExp.value==""){
                        notif("alert-danger")
                    }
                    myform.reset();
                });
            } 
        })  
        numDest.addEventListener('input',()=>{
            if (+numDest.value==element.client.tel || numDest.value==element.numCompte) {
                console.log(element.client.prenom +" "+ element.client.nom); 
                nomDest.value= element.client.prenom +" "+ element.client.nom;
                
            }
        })
    });
  });

// function pour color l'expéditeur
function colorExpediteur(span:HTMLSpanElement, fourn:string) {
    if (fourn=="WV") {
        span.style.backgroundColor=ColorExp.WV
    }
    else if (fourn=="OM") {
        span.style.backgroundColor=ColorExp.OM
    }
    else if (fourn=="WR") {
        span.style.backgroundColor=ColorExp.WR  
    }
}

// --------------------Transaction------------------------
// Charger le select des fournisseurs
Fournisseurs.forEach(fournisseur => {
    let option=document.createElement('option');
    option.innerHTML=fournisseur
    fourn.appendChild(option);
    
});
// charger le select des transactions
Transactions.forEach(transaction => {
    let option=document.createElement('option');
    option.innerHTML=transaction
    trans.appendChild(option);

});
// Vérifier le montant saisie pour la transaction
montant.addEventListener("input",()=>{
    
    verifieMontant(montant, 500)
  
})

// Fonction pour controler le montant saisie
function verifieMontant(input:HTMLInputElement,montant:number, solde:number=1000000) {
    if (+input.value<montant || +input.value>solde) {
        input.style.color="red"
        valider.setAttribute("disabled", "disabled")
    }
    else{
        input.style.color="green"
        valider.removeAttribute("disabled")
    }
}

function notif(color:string) {
    success.classList.remove("d-none");
    success.classList.add(color)
    setTimeout(() => {
        success.classList.add("d-none");
    }, 5000);
}
// Valider transaction
