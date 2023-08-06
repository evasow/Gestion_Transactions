<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Compte;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Faker\Factory as Faker;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }
    /**
     * Store a newly created resource in storage.
     */
    public function storeTrans(Request $request)
    {

        if ($this->compteFermeOuBloque($request->compte_id,"etat")) {
            return response()->json([
                "message" => "Compte fermé ! Impossible de faire des opérations avec ce compte"
            ]);
        }
        $minAmount = 500;

        if($request->fournisseur == 'Orange Money' || $request->fournisseur == 'Wave') {
            $minAmount = 500;
        }
        $validate=$request->validate([
            "typeTrans"=>"required",
            "montantTrans"=>"required|numeric|min:$minAmount",
            "client_id"=>"required",
            "compte_id"=>"required",
            "numDestinataire"=>"string",
        ]);
        Transaction::firstOrCreate([
            "typeTrans"=>$request->typeTrans,
            "montantTrans"=>$request->montantTrans,
            "client_id"=>$request->client_id,
            "compte_id"=>$request->compte_id,
            "transfert_type"=>$request->transfert_type,
            "fournisseur"=>$request->fournisseur,
            "type_cb_trans"=>$request->type_cb_trans,
            "client_dest_id"=>$request->client_dest_id,

        ]);
        $compte=  Compte::where("id",$request->compte_id)->first();
        if ($request->typeTrans=="depot") {
          $compte->update(['solde'=>$request->montantTrans+$compte->solde]);
          return response()->json([
            "message"=> "$request->typeTrans  effectué avec succés !",
          ]);
        }
        elseif($request->typeTrans=="retrait"){
            if ($this->compteFermeOuBloque($request->compte_id,"blocage")) {
                return response()->json([
                    "message" => "Compte bloqué ! Impossible de faire des opérations avec ce compte"
                ]);
            }
          $compte->update(['solde'=>$compte->solde-$request->montantTrans]);
          return response()->json([
            "message"=> "$request->typeTrans  effectué avec succés !",
          ]);
        }
        else {
            if ($this->compteFermeOuBloque($request->compte_id,"blocage")) {
                return response()->json([
                    "message" => "Compte bloqué ! Impossible de faire des opérations avec ce compte"
                ]);
            }
            $fourn= explode("_",$compte->numCompte)[0];
    
            return $this->transfert(
                $request->transfert_type, $request->client_dest_id, $fourn,$request->montantTrans,$compte);
               
        }
    }
    public function transfert($transfertType, $destinataireId, $fourn,$montant,$expCompte)
    {
        
        if($transfertType==0){
            $destId=Client::where("id",$destinataireId)->pluck("id");
            $destCompte=Compte::where("client_id",$destId[0])->first();

            if (explode("_",$destCompte->numCompte)[0]==$fourn) {
             $soldeDest=$destCompte->solde;
             $soldeExp=$expCompte->solde;
             $mtntTrans=$montant;
             $destCompte->update(['solde'=>$soldeDest+($mtntTrans-$mtntTrans*(1/100))]);
             $expCompte->update(['solde'=>$soldeExp-($mtntTrans-$mtntTrans*(1/100))]);
            
             return response()->json([
                "message"=> "Transfert effectué avec succés !",
              ]);
            }
            else{
                return response()->json([
                    "message"=> "vous ne pouvez pas pas transféré vers ce compte !",
                  ]);
            }
         }
         else{
             $faker = Faker::create();
             return response()->json([
                "code"=>$faker->numerify('#######################')
            ]);
             
         }
    }


    public function compteFermeOuBloque($compteId,$colonne){
        
        $table = Compte::where('id',$compteId);
        $etat=$table->pluck($colonne);
        if ($etat[0]==0) {
           return false;
        }
        return true;
    }

    public function BloquerOuDebloquerCompte($compteId,$blocage){
        $compte=Compte::where("id",$compteId)->first();
        if ($compte) {
            if ($this->compteFermeOuBloque($compteId,"blocage") && $blocage==1) {
                return response()->json([
                    "message"=>"ce compte est déja bloqué"
                ]);
            }
            $table = Compte::where('id',$compteId);
    
                $table->update([
                    "blocage"=>$blocage
            ]);
            if ($blocage==1) {
                return response()->json([
                    "message"=>"Compte bloqué !"
                ]);
            }
            return response()->json([
                "message"=>"Compte débloqué !"
            ]);
        }
        return response()->json([
            "message"=>"Ce client n'a pas de compte"
        ]);

    }
    public function fermerCompte($compteId){
        if ($this->compteFermeOuBloque($compteId,"etat")) {
            return response()->json([
                "message"=>"ce compte est déjà fermé"
            ]);
         }
        $table = Compte::where('id',$compteId);

            $table->update([
                "etat"=>1
        ]);
        return response()->json([
            "message"=>"Compte Fermé !"
        ]);
    }
    public function annulerTrans($idTrans,Request $request)
    {
        $validate=$request->validate([
            "id"=>"required",
        ]);
        $trans=Transaction::where("id",$idTrans)->first();
        
        if ($trans->typeTrans!=="transfert") {
            return response()->json([
                "message"=>"Impossible d'annuler cette transaction"
            ]);
        }
        if ($trans->created_at->addHours(24) < now()) {
            return response()->json([
                "message"=>"La transaction a duré plus de 24 heures "
            ]);
        }
         $idDest= $trans->client_dest_id;
         $idExp=$trans->client_id;
         $montantTrans= $trans->montantTrans;
        $compteDest= Compte::where("client_id", $idDest)->first();
        $compteExp= Compte::where("client_id", $idExp)->first();
        if ($compteDest->solde<$montantTrans) {
            return response()->json([
                "message"=>"Impossible d'annuler la transaction , l'argent a déjà été retiré"
            ]);
        }
        $compteDest->update(["solde"=>$compteDest->solde=$compteDest->solde-$montantTrans]);
        $compteExp->update(["solde"=>$compteExp->solde=$compteExp->solde+$montantTrans]);

        return response()->json([
            "message"=>"Transaction annulé avec success",
        ]);
        
    }
    /**
     * Display the specified resource.
     */
    
        //char
    public function update(Request $request, Transaction $transaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        //
    }
}
