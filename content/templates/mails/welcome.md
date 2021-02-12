---
subject: L'enregistrement de {{=it.nom}} a bien été reçu
to: "{{=it.representant.prenom}} {{=it.representant.nom}} <{{=it.representant.email}}>"
bcc: zipang <christophe.desguez@gmail.com>
attachments: attestation
---
|     | Date                      |
| --- | ------------------------: |
|     | Paris, le {{=(new Date).toISOString().substr(0,10)}} |


Bonjour **{{=it.representant.prenom}} {{=it.representant.nom}}**,

L'enregistrement de votre société **{{=it.nom}}** a bien été pris en compte en date du {{=it.date_creation}}.

![logo]({{=it.env.NEXT_PUBLIC_SITE_URL + '/'}})

