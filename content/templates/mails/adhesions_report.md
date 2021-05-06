---
subject: Rapport des adhésions INVIE à renouveler le {{=data.today}}
to: '{{=data.env.MAIL_CONTACT}}'
bcc: zipang <christophe.desguez@gmail.com>
---
A la date du {{=data.today}}

{{?data.a_renouveler.length}}
Liste des adhérents ayant leur adhésion à renouveler dans un mois :
{{?}}
{{~ data.a_renouveler :adhesion }}
 * {{=adhesion }}
{{~}}

{{?data.closed.length}}
Liste des adhérents ayant terminé leur adhésion :
{{?}}
{{~ data.closed :adhesion }}
 * {{=adhesion }}
{{~}}

