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
let histTrans=document.querySelector("#histTrans") as HTMLIFrameElement
let historique=document.querySelector("#historique") as HTMLDivElement
let ulhist=document.querySelector(".ulhist") as HTMLUListElement
let destinataire=document.querySelector("#destinataire") as HTMLDivElement
// form Data------------------------
let client=document.querySelector("#client") as HTMLInputElement
let compt=document.querySelector("#compte") as HTMLInputElement

// -----------------------Enumeration-----------------------------
enum ColorExp{
    "OM" = "orange",
    "WV" = "#00bfff",
    "WR" = "green",
    "NEUTRE" = "grey",
}
// ---------------------Interface ou Type-------------------------


type Transaction={
    id:number,
    typeTrans:string,
    montantTrans:number,
    client_id:number,
    compte_id:number,
    numDestinataire:number,
}
interface Compte{
    "id":number;
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
    "transactions" :Transaction [];
}

valider.addEventListener("click",()=>{
    console.log(document.head.querySelector('[name="csrf-token"]'));
    const csrfToken = (document.head.querySelector('[name="csrf-token"]')as HTMLMetaElement).content ;
    const object = {
        typeTrans: trans.value,
        montantTrans: montant.value,
        client_id :nomDest.getAttribute("idClient"),
        compte_id:nomDest.getAttribute("idCompte"),
        numDestinataire:numDest.value,
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
            
          } else {
            console.log("Error");
            
          }
        
      });
})
// ------------------------Expediteurs------------------------
// Fonction fetch data
const fetchData = (url: string) => {
    return fetch(url)
      .then(res => res.json()) 
      .then(data => data);  
}

// ----------------------fetch donnees comptes------------------------
let tabNums:number[]=[];
let tabNumComptes:string[]=[];
fetchData(url).then(data => {
    let donnees:Compte[]=data.data
    console.log(donnees); 
    donnees.forEach((element : Compte) => {
        tabNums.push(element.client.tel);
        tabNumComptes.push(element.numCompte);
        numExp.addEventListener('input',()=>{  
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
        })  
        // ------------Nom destinataires------------
        numDest.addEventListener('input',()=>{
            if (+numDest.value==element.client.tel || numDest.value==element.numCompte) {
                console.log(element.client.prenom +" "+ element.client.nom); 
                nomDest.value= element.client.prenom +" "+ element.client.nom;
                
            }
        })
        // ---------historiques transactions--------
        
    });
//   --------------------evenement expediteur------------------------
    
    numExp.addEventListener('input',(e)=>{
      console.log(e.target);
      
      let trouveNum= tabNums.some(element=> element==+numExp.value);
      let trouveNumCompte= tabNumComptes.some(element=>element==numExp.value);

      if (trouveNum || trouveNumCompte) {
        let compte : Compte|undefined=donnees.find(element=> element.client.tel==+numExp.value ||element.numCompte==numExp.value);
        if (compte) {
            nomExp.value= compte.client.prenom +" "+ compte.client.nom;
            nomExp.setAttribute("idClient", compte.client.id.toString())
            nomExp.setAttribute("idCompte", compte.client.id.toString())
            console.log(nomExp);
            
            let fourn:string= compte.numCompte.split("_")["0"];
            colorExpediteur(colorExp, fourn);
            historiqueTrans(compte.transactions);
        }
      }
      else if(!trouveNum ||!trouveNumCompte){
        nomExp.value=""
        colorExpediteur(colorExp, "NEUTRE");
      }
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
    else if (fourn=="NEUTRE") {
        span.style.backgroundColor=ColorExp.NEUTRE  
    }
    // span.style.backgroundColor=ColorExp[fourn]
}

// --------------------Transaction------------------------
// Charger le select des fournisseurs
Fournisseurs.forEach(fournisseur => {
    let option=document.createElement('option');
    option.innerHTML=fournisseur
    fourn.appendChild(option);
    
});
// ----------------charger le select des transactions
Transactions.forEach(transaction => {
    let option=document.createElement('option');
    option.innerHTML=transaction
    trans.appendChild(option);

});
//------------------ Vérifier le montant saisie pour la transaction
montant.addEventListener("input",()=>{
    
    verifieMontant(montant, 500)
  
})

//----------------- Fonction pour controler le montant saisie
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
// ---------------------Notification transaction --------------------
function notif(color:string) {
    success.classList.remove("d-none");
    success.classList.add(color)
    setTimeout(() => {
        success.classList.add("d-none");
    }, 5000);
}
// --------historiqueTrans--------
function historiqueTrans(transactions:Transaction[]) {
    
    histTrans.addEventListener("click",() => {
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
trans.addEventListener('change',()=>{    

    if(trans.value=="retrait"){      
        destinataire.classList.add('d-none');
    }else{
        destinataire.classList.remove('d-none');
    }   
})

