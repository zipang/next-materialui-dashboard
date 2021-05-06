---
subject: Rapport des adhésions INVIE à renouveler le {{=data.today}}
to: {{=data.env.MAIL_CONTACT}}
bcc: zipang <christophe.desguez@gmail.com>
---
A la date du {{=data.today}}

{{? data.a_renouveler.length > 1 }}
    {{=data.a_renouveler.length}} adhérents ont leur adhésion à renouveler dans un mois :
{{?}}
{{? data.a_renouveler.length === 1 }}
    1 adhérent a son adhésion à renouveler dans un mois :
{{?}}
{{~ data.a_renouveler :adhesion }}
 * {{=adhesion }}
{{~}}

{{? data.closed.length > 1 }}
    {{=data.closed.length}} adhérents viennent de terminer leur adhésion :
{{?}}
{{? data.closed.length === 1 }}
    1 adhérent vient de terminer son adhésion :
{{?}}
{{~ data.closed :adhesion }}
 * {{=adhesion }}
{{~}}

