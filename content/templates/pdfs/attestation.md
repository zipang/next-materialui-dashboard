---
filename: "Attestation-Adhésion-{{=data.siret}}.pdf"
---
<img src="https://invie78.fr/images/logo.jpg" alt="logo" />

Paris, le {{=(new Date).toISOString().substr(0,10)}}


# ATTESTATION D'ADHESION

Ce document confirme que votre société **{{=data.nom}}** (N° de Siret `{{=data.siret}}`) a bien souscrit un contrat d'adhésion auprès du service **INVIE** en date du {{=data.date_adhesion}}

Le contrat a été signé par votre représentant {{=data.representant.prenom}} {{=data.representant.nom}}.

Les coordonnées de votre société sont les suivantes :

**{{=data.nom}}**  
{{=data.adresse?.rue1}}  
{{=data.adresse?.rue2}}  
{{=data.adresse?.code_postal}} {{=data.adresse?.commune}}  

Standard: {{=data.contact?.telephone}}  
Email: {{=data.contact?.email}}

