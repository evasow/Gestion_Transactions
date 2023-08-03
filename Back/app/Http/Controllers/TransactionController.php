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
          return "$request->typeTrans  effectué avec succés !";
        }
        elseif($request->typeTrans=="retrait"){
          $compte->update(['solde'=>$compte->solde-$request->montantTrans]);
          return "$request->typeTrans  effectué avec succés !";
        }
        else {
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
                // return $expCompte;
                return "transfert effectué avec succés !";
            }
            else{
                return "vous ne pouvez pas pas transféré vers ce compte";
            }
         }
         else{
             $faker = Faker::create();
             return $faker->numerify('#######################');
         }
    }
    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
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
