
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
let montantEnv=document.querySelector("#montantEnv") as HTMLInputElement
let soldeError=document.querySelector('#soldeError') as HTMLDivElement
let sold=document.querySelector("#solde") as HTMLSpanElement
let divmtnEnv=document.querySelector("#divmtnEnv") as HTMLDivElement
let frais=document.querySelector("#frais") as HTMLDivElement
let valider=document.querySelector("#valider") as HTMLButtonElement
let success=document.querySelector("#success") as HTMLDivElement
let myform=document.querySelector("#myform") as HTMLFormElement
let histTrans=document.querySelector("#histTrans") as HTMLIFrameElement
let historique=document.querySelector("#historique") as HTMLDivElement
let ulhist=document.querySelector(".ulhist") as HTMLUListElement
let destinataire=document.querySelector("#destinataire") as HTMLDivElement
let notification=document.querySelector("#notif") as HTMLSpanElement
let code=document.querySelector("#code") as HTMLDivElement
let withCode=document.querySelector("#withCode") as HTMLInputElement
let mtnFrais=document.querySelector("#mtnFrais") as HTMLSpanElement
let invalideFourn=document.querySelector("#invalideFourn") as HTMLDivElement

// form Data------------------------
let client=document.querySelector("#client") as HTMLInputElement
let compt=document.querySelector("#compte") as HTMLInputElement

// -----------------------Enumeration-----------------------------
enum ColorExp{
    "OM" = "orange",
    "WV" = "#00bfff",
    "WR" = "green",
    "CB" = "yellow",
    "NEUTRE" = "grey",
}
enum Frais{
    OM_WV = "1%",
    WR = "2%",
    CB = "5%",
}
enum Fournisseur{
    OM = "Orange Money",
    WV = "Wave",
    WR = "Wari",
    CB = "Compte Bancaire",
}
// ---------------------Interface ou Type-------------------------
type Client={
    "id" : number;
    "nom" : string;
    "prenom" : string;
    "tel" : number;
    "dateNaiss":string;
    "cni" : number;
};

type Transaction={
    id:number,
    typeTrans:string,
    montantTrans:number,
    client_id:number,
    compte_id:number,
    numDestinataire:number,
    created_at:Date,
    client_dest:Client,

}
interface Compte{
    "id":number;
    "solde": number;
    "numCompte": string;
    "client" : Client;
    "transactions" :Transaction [];
}
// ------fonction faire une transaction -----------------------
function validerTrans() {
    
    valider.addEventListener("click",()=>{
        console.log(trans.value,+montant.value,nomExp.getAttribute("idClient"),nomExp.getAttribute("idCompte"),+numDest.value);
        
        const object = {
            typeTrans: trans.value,
            montantTrans: +montant.value,
            client_id :nomExp.getAttribute("idClient"),
            compte_id:nomExp.getAttribute("idCompte"),
            client_dest_id:nomDest.getAttribute("destId"),
            transfert_type:withCode.value,
            fournisseur:fourn.value,
            type_cb_trans:0
        };
        fetch('http://127.0.0.1:8000/api/transaction', {
        method: 'POST', 
        body: JSON.stringify(object),
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
        }).then((res) => {
         return res.text()
        }).then((data) => {
             console.log(data);        
        })
        myform.reset();
    });
}
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
  
        // ------------Nom destinataires------------
        numDest.addEventListener('input',()=>{
            if (+numDest.value==element.client.tel || numDest.value==element.numCompte) {
                console.log(element.client.prenom +" "+ element.client.nom); 
                nomDest.value= element.client.prenom +" "+ element.client.nom;
                nomDest.setAttribute("destId", element.client.id.toString());
                
            }
        })
        // ---------historiques transactions--------
        
    });
//   --------------------evenement expediteur------------------------
    
    numExp.addEventListener('input',(e)=>{
      
      let trouveNum= tabNums.some(element=> element==+numExp.value);
      let trouveNumCompte= tabNumComptes.some(element=>element==numExp.value);

      if (trouveNum || trouveNumCompte) {
        let compte : Compte|undefined=donnees.find(element=> element.client.tel==+numExp.value ||element.numCompte==numExp.value);
        if (compte) {
            nomExp.value= compte.client.prenom +" "+ compte.client.nom;
            nomExp.setAttribute("idClient", compte.client.id.toString())
            nomExp.setAttribute("idCompte", compte.id.toString())
            
            let fourn:string= compte.numCompte.split("_")["0"];
            colorExpediteur(colorExp, fourn);
            historiqueTrans(compte.transactions);
            MontantValide(compte.solde)
            validerTrans(); 
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
// ----verifier frais operateur--------
function fraisOperateur() {
    if (fourn.value ==="Orange Money" || fourn.value ==="Wave") {
            
        montantEnv.value=Math.round(+montant.value-(+montant.value*0.01)).toString()
    }
    else{
        montantEnv.value=(+montant.value-(+montant.value*0.05)).toString()

    }
}
//------------------ Vérifier le montant saisie pour la transaction
function MontantValide(solde:number) {
    
    montant.addEventListener("input",()=>{
        
        verifieMontant(montant, 500,solde)
        fraisOperateur()
    
        if (verifieMontant(montant, 500,solde)) {
            soldeError.classList.remove("d-none");
            sold.innerHTML=`<b>solde : ${solde.toString()}</b>`;
        }
        else{
            soldeError.classList.add("d-none");
        }
      
    })
}

//----------------- Fonction pour controler le montant saisie
function verifieMontant(input:HTMLInputElement,montant:number, solde:number=1000000) {
    if (+input.value<montant || +input.value>solde) {
        input.style.color="red"
        valider.setAttribute("disabled", "disabled")
        return true;
    }
    else{
        input.style.color="green"
        valider.removeAttribute("disabled")
        return false;
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

        ulhist.innerHTML='';
        transactions.forEach((transaction:Transaction) => {
            let li=document.createElement("li");
            li.classList.add("list-group-item");
            console.log(transaction);
            
            // li.innerHTML=transaction.typeTrans+" "+transaction.montantTrans+" "+transaction.numDestinataire;
            const date = new Date(transaction.created_at);
            if (transaction.typeTrans=="transfert") {
                
            }
            li.innerHTML=`<div class="d-flex justify-content-around>
            <div><h6 class="text-info"><b>${transaction.typeTrans}</b></h6></div>
            <div>${transaction.client_dest.prenom+" "+transaction.client_dest.nom} </div>
            </div>
            
            <span>${date.toLocaleDateString()}</span>
            <div class="d-flex justify-content-end"><h6 class="text-info">${transaction.montantTrans}</h6></div>`
            ulhist.appendChild(li);
        });
        
    });
}
// -----function transaction avec ou sas code -----
function transCode() {
   withCode.addEventListener("change", ()=>{
    if (withCode.checked) {
        withCode.value="1"
        console.log(withCode.value);
        
    }
    else{
        withCode.value="0"
        console.log(withCode.value);
        
    }
   })
}
// --------------retait / destinataire none--------------------------------
trans.addEventListener('change',()=>{    

    if(trans.value=="retrait"){      
        destinataire.classList.add('d-none');
    }else{
        destinataire.classList.remove('d-none');
    } 
    if (trans.value=="transfert") {
        divmtnEnv.classList.remove('d-none');
        if (fourn.value=="Orange Money" || fourn.value=="Wave") {
            code.classList.remove('d-none');
            transCode()
            mtnFrais.innerHTML=Frais.OM_WV
            frais.classList.remove('d-none');
        }
        else if (fourn.value=="Wari") {
            mtnFrais.innerHTML=Frais.WR
            frais.classList.remove('d-none');
        }
    } 
    else{
        divmtnEnv.classList.add('d-none');
    }  
})

fourn.addEventListener("change",()=>{
    console.log(numExp.value.split("_")[0]);
    fraisOperateur()

    if (trans.value=="transfert") {
        if (fourn.value=="Orange Money" || fourn.value=="Wave") {
            mtnFrais.innerHTML=Frais.OM_WV
        }
        else{
            mtnFrais.innerHTML=Frais.WR
            code.classList.add('d-none');
        }  
    }
   
});

