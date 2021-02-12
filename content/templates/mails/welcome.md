---
subject: L'enregistrement de {{=data.nom}} a bien été reçu
to: '"{{=data.representant.prenom}} {{=data.representant.nom}}" <{{=data.representant.email}}>'
bcc: zipang <christophe.desguez@gmail.com>
attachments: attestation
---
<img src="https://invie78.fr/images/logo.jpg" alt="logo" />

Paris, le {{=(new Date).toISOString().substr(0,10)}}

Bonjour **{{=data.representant.prenom}} {{=data.representant.nom}}**,

L'enregistrement de votre société **{{=data.nom}}** a bien été pris en compte en date du {{=data.date_creation}}.

