---
filename: "Attestation-Adhésion-{{=it.siret}}.pdf"
---
<img src="https://invie78.fr/images/logo.jpg" alt="logo" />

Paris, le {{=(new Date).toISOString().substr(0,10)}}


# ATTESTATION D'ADHESION

Ce document confirme que votre société **{{=it.nom}}** (N° de Siret {{=it.siret}}) a bien souscrit un contrat d'adhésion auprès du service **INVIE** en date du {{=it.date_adhesion}}

Le contrat a été signé par votre représentant {{=it.representant.prenom}} {{=it.representant.prenom}}.

Les coordonnées de votre société sont les suivantes :

**{{=it.nom}}**
{{=it.adresse.rue1}}
{{=it.adresse.rue2}}
{{=it.adresse.code_postal}} {{=it.adresse.commune}}

Standard: {{=it.contact.telephone}}
Email: {{=it.contact.email}}

