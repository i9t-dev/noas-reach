<?php
use CRM_NoasReach_ExtensionUtil as E;

return [
  [
    'name' => 'Navigation_afsearchFondContents',
    'entity' => 'Navigation',
    'cleanup' => 'unused',
    'update' => 'unmodified',
    'params' => [
      'version' => 4,
      'values' => [
        'label' => E::ts('Find Contents'),
        'name' => 'afsearchFondContents',
        'url' => 'civicrm/find-contents',
        'icon' => 'crm-i fa-list-alt',
        'permission' => ['access CiviCRM'],
        'permission_operator' => 'AND',
        'parent_id.name' => 'Search',
        'weight' => 1,
      ],
      'match' => ['name', 'domain_id'],
    ],
  ],
];
