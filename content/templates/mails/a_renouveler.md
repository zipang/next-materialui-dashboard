---
subject: Votre adhésion INVIE va bientôt expirer
to: '"{{=data.adherent.representant.prenom}} {{=data.adherent.representant.nom}}" <{{=data.adherent.representant.email}}>'
bcc: zipang <christophe.desguez@gmail.com>
---
<img src="https://invie78.fr/images/logo.jpg" alt="logo" />

Les Mureaux, le {{=data.today}}

Vos références adhérent : **{{=data.nom}}** - Adh. n° **{{=data.no}}**

Bonjour,

Votre adhésion à INVIE va bientôt arriver à expiration à sa date anniversaire le {{=data.date_fin}}.

Afin de procéder à son renouvellement, merci de vous connecter dans <a href="{{=data.env.NEXT_PUBLIC_SITE_URL}}">votre espace adhérent</a> et de revalider votre formulaire d'informations.
 
Pour toute question complémentaire ou demande de rdv, vous pouvez nous contacter par téléphone au 01 39 29 43 48 ou par mail contact@invie78.fr

Nous vous remercions pour votre confiance.

Cordialement,

L’équipe d’INVIE
