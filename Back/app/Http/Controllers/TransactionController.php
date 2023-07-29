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
        Transaction::firstOrCreate([
            "typeTrans"=>$request->typeTrans,
            "montantTrans"=>$request->montantTrans,
            "client_id"=>$request->client_id,
            "compte_id"=>$request->compte_id,
            "numDestinataire"=>$request->numDestinataire
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
    
            if ($fourn=="WV"){
                $this->transfert($request->transfert_type, $request->numDestinataire, "WV",$request->montantTrans);
                // if($request->transfert_type==0){
                //    $destId=Client::where("tel",$request->numDestinataire)->pluck("id");
                //    $destCompte=Compte::where("client_id",$destId[0])->first();

                //    if (explode("_",$destCompte->numCompte)[0]=="WV") {
                //     $solde=$destCompte->solde;
                //     $mtntTrans=$request->montantTrans;
                //     $destCompte->update(['solde'=>$solde+($mtntTrans-$mtntTrans*(1/100))]);
                //      return "$request->typeTrans  effectué avec succés !";
                //    }
                //    else{
                //         return "vous ne pouvez pas pas transféré vers ce compte";
                //    }
                // }
                // else{
                //     $faker = Faker::create();
                //     $code = $faker->numerify('#######################');
                //     return $code;
                // }
            }
        }
    }
    public function transfert($transfertType, $destinataire, $fourn,$montant)
    {
        return "service";
        if($transfertType==0){
            $destId=Client::where("tel",$destinataire)->pluck("id");
            $destCompte=Compte::where("client_id",$destId[0])->first();

            if (explode("_",$destCompte->numCompte)[0]==$fourn) {
             $solde=$destCompte->solde;
             $mtntTrans=$montant;
             $destCompte->update(['solde'=>$solde+($mtntTrans-$mtntTrans*(1/100))]);
              return "transfert effectué avec succés !";
            }
            else{
                 return "vous ne pouvez pas pas transféré vers ce compte";
            }
         }
         else{
             $faker = Faker::create();
             $code = $faker->numerify('#######################');
             return $code;
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
