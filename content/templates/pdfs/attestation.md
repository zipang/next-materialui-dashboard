---
filename: "Adhésion-INVIE-{{=(new Date).toISOString().substr(0,10)}}-{{=data.nom}}.pdf"
---
<img src="https://invie78.fr/images/logo.jpg" alt="logo" />

<h1 style="width: 80%; text-align: center; background-color: 'orange'"> RECU D'ADHESION {{=data.adhesion.no}}</h1>

En date du {{=data.adhesion.date_debut}}  

L'association INVIE atteste avoir reçu au titre de l'année {{=(new Date).toISOString().substr(0,4)}}  
l'adhésion de  

<h2 style="width: 80%; text-align: center; margin-left: auto; margin-right: auto; background-color: 'orange'"> {{=data.nom}}</h2>

Identification SIRET : {{=data.siret}}  

Pour la somme de : **200€**  

Fait aux Mureaux, le {{=(new Date).toISOString().substr(0,10)}}, pour valoir ce que de droit.

<div style="width: 50%; margin-left: 50%; font-weight: bold;">
COUTEAU DELORD Stéphanie<br>  
Responsable Administratif et Financier
</div>

