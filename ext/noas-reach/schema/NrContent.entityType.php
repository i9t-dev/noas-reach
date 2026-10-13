<?php

use CRM_NoasReach_ExtensionUtil as E;

return [
    'name' => 'NrContent',
    'table' => 'civicrm_nr_content',
    'class' => 'CRM_NoasReach_DAO_NrContent',
    'getInfo' => fn() => [
        'title' => E::ts('NrContent'),
        'title_plural' => E::ts('NrContents'),
        'description' => E::ts('Text contents of entities'),
        'log' => TRUE
    ],
    'getFields' => fn() => [
        'id' => [
            'title' => E::ts('ID'),
            'sql_type' => 'int unsigned',
            'input_type' => 'Number',
            'required' => TRUE,
            'description' => E::ts('Unique entity ID'),
            'primary_key' => TRUE,
            'auto_increment' => TRUE
        ],
        'entity_id' => [
            'title' => E::ts('Entity ID'),
            'sql_type' => 'int unsigned',
            'input_type' => 'EntityRef',
            'description' => E::ts('Reference of entity')
        ],
        'entity_type' => [
            'title' => E::ts('Entity type'),
            'sql_type' => 'varchar(32)',
            'input_type' => 'String',
            'required' => TRUE,
            'description' => E::ts('Type of entity')
        ],
        'content' => [
            'title' => E::ts('Entity content'),
            'sql_type' => 'text',
            'input_type' => 'String',
            'descripion' => E::ts('Text content of entity')
        ],
    ],
    'getIndices' => fn() => [],
    'getPaths' => fn() => []
];
