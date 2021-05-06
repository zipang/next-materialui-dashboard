---
subject: Nouvelle adhésion ({{=data.nom}})
to: '{{=data.env.MAIL_CONTACT}}'
bcc: zipang <christophe.desguez@gmail.com>
---
{{=data.nom}} vient d'adhérer/renouveler son adhésion.

Les coordonnées :

**{{=data.nom}}**  
{{=data.adresse?.rue1}}  
{{=data.adresse?.rue2}}  
{{=data.adresse?.code_postal}} {{=data.adresse?.commune}}  

Standard: {{=data.contact?.telephone}}  
Email: {{=data.contact?.email}}

Représentant {{=data.representant.prenom}} {{=data.representant.nom}}.
Email: {{=data.representant?.email}}
N° Mobile: {{=data.representant?.mobile}}

{{? data.demande_contact_adherent }}
**La structure a souhaité être recontactée**
{{? }}
