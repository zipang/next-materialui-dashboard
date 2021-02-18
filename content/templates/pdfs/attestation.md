---
filename: "Attestation-Adhésion-{{=data.siret}}-{{=data.nom}}.pdf"
---
<img src="https://invie78.fr/images/logo.jpg" alt="logo" />

<h1 style="width: 80%; text-align: center; background-color: 'orange'"> RECU D'ADHESION {{=data.adhesion.reference}}

L'association INVIE atteste avoir reçu au titre de l'année {{=data.adhesion.annee}}
l'adhésion de 

<h2 style="width: 80%; text-align: center; margin-left: auto; margin-right: auto; background-color: 'orange'"> {{=data.nom}} (N° de Siret `{{=data.siret}}`)</h2>

En date du : {{=data.adhesion.date}}

La somme de : **{{=data.adhesion.montant}}** 

Fait aux Mureaux, le {{=(new Date).toISOString().substr(0,10)}}, pour valoir ce que de droit.

    **COUTEAU DELORD Stéphanie**
    **Responsable Administratif et Financier**

