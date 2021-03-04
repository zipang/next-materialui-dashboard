# Application Models

## Usage

Application models are the data structures that are stored in the Parse database, 
on which we can perform only a selection of relevant actions.
The most basic operations (CRUD) are already implemented by the fact that these models 
inherit from Parse.Object.

The more specific actions that implement a specific business workflof are declared 
as statiuc methods on the Parse.Model.

Example :

Parse.Adherent