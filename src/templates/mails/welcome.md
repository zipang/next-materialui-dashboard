---
subject: Votre Enregistrement a bien été reçu
bcc: zipang <christophe.desguez@gmail.com>
attachments: attestation
---
|     | Date                      |
| --- | ------------------------: |
|     | Paris, le {{=(new Date).toISOString().substr(0,10)}} |


Bonjour **{{=it.representant.prenom}} {{=it.representant.nom}}**,

L'enregistrement de votre société **{{=it.nom}}** a bien été pris en compte.

![logo]({{=it.env.SITE_URL + '/'}})

