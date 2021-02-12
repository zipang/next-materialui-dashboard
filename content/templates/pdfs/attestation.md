---
filename: "Attestation-Adhésion-{{=it.siret}}.pdf"
---
|                                                | Date                      |
| :--------------------------------------------- | ------------------------: |
| ![logo]({{=it.env.SITE_URL + '/logo.svg'}})    |  |
|     | Paris, le {{=(new Date).toISOString().substr(0,10)}} |


# ATTESTATION D'ADHESION

Ce document confirme que votre société {{=it.nom}} a bien souscrit un contrat d'adhésion en date du {{=it.date_adhesion}}

Le contrat a été signé par votre représentant {{=it.representant.prenom}} {{=it.representant.prenom}}


