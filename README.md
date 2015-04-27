# Public Roam Information Manager (prim)

Webapp running under Meteor designed to display fittings for a public roaming community.

PRIM automatically calculates fitting stats using [libdogma](https://github.com/osmium-org/libdogma).

## Known Issues
* T3Ds not yet tested / implemented
* fitting more than one propulsion modules leads to wrong speed / signature stats
* a fitted cloak is active and reduces speed
* /OFFLINE not supported
* EHP calculations do not take AARs / ASBs into account

## Structure

### DESC
DESC (dogma enhanced stats calculator) is a node-ffi binding for the C library [libdogma](https://github.com/osmium-org/libdogma) and a wrapper library for easy use.
It also includes an EFT fitting parser.

### Packages used

* Meteor Core
  * meteor-platform
* Routing
  * [iron:router](https://github.com/EventedMind/iron-router)
  * [zimme:iron-router-active](https://github.com/zimme/meteor-iron-router-active)
* Collections
  * [aldeed:collection2](https://github.com/aldeed/meteor-collection2)
  * [dburles:collection-helpers](https://github.com/dburles/meteor-collection-helpers)
* Accounts
  * [accounts-password](https://github.com/meteor/meteor/tree/devel/packages/accounts-password)
* UI and UX
  * [fastclick](https://github.com/meteor/meteor/tree/devel/packages/fastclick)
  * [meteorhacks:fast-render](https://github.com/meteorhacks/fast-render)
  * [natestrauser:animate-css](https://github.com/nate-strauser/meteor-animate-css/)
  * [nemo64:bootstrap](https://github.com/Nemo64/meteor-bootstrap/)
  * [ian:accounts-ui-bootstrap-3](https://github.com/ianmartorell/meteor-accounts-ui-bootstrap-3/)
  * [aldeed:autoform](https://github.com/aldeed/meteor-autoform)
* Security
  * [browser-policy](https://github.com/meteor/meteor/tree/devel/packages/browser-policy)
  * [audit-argument-checks](https://github.com/meteor/meteor/tree/devel/packages/audit-argument-checks)
  * [matteodem:easy-security](https://github.com/matteodem/meteor-easy-security)
* SEO
  * [manuelschoebel:ms-seo](https://github.com/DerMambo/ms-seo)
* Development
  * [less](https://github.com/meteor/meteor/tree/devel/packages/less)
  * [jquery](https://github.com/meteor/meteor/tree/devel/packages/jquery)
  * [underscore](https://github.com/meteor/meteor/tree/devel/packages/underscore)
  * [raix:handlebar-helpers](https://github.com/raix/Meteor-handlebar-helpers)

## Licence

PRIM is licensed under AGPLv3, see LICENSE.txt.