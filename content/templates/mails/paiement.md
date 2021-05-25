---
subject: Votre adhésion INVIE ({{=data.nom}}) est validée
to: '"{{=data.representant.prenom}} {{=data.representant.nom}}" <{{=data.representant.email}}>'
bcc: zipang <christophe.desguez@gmail.com>
attachments: attestation
---
<img src="https://invie78.fr/images/logo.jpg" alt="logo" />

Les Mureaux, le {{=(new Date).toISOString().substr(0,10)}}

Vos références : {{=data.adhesion.no}} - {{=data.nom}}

Bonjour,

Nous accusons bonne réception de votre paiement pour l'adhésion {{=data.adhesion.no}}.
Vous pouvez trouver en pièce jointe l'attestation d'adhésion.


En vous remerciant pour votre confiance,
Cordialement,

L’équipe d’INVIE

Pour toute question complémentaire, vous pouvez nous contacter par téléphone au 01 39 29 43 48 ou par mail contact@invie78.fr
