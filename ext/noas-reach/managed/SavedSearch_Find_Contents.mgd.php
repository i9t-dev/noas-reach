<?php
use CRM_NoasReach_ExtensionUtil as E;

return [
  [
    'name' => 'SavedSearch_Find_Contents',
    'entity' => 'SavedSearch',
    'cleanup' => 'unused',
    'update' => 'unmodified',
    'params' => [
      'version' => 4,
      'values' => [
        'name' => 'Find_Contents',
        'label' => E::ts('Find Contents'),
        'api_entity' => 'NrContent',
        'api_params' => [
          'version' => 4,
          'select' => ['id', 'entity_id', 'entity_type', 'content'],
          'orderBy' => [],
          'where' => [],
          'groupBy' => [],
          'join' => [],
          'having' => [],
        ],
      ],
      'match' => ['name'],
    ],
  ],
  [
    'name' => 'SavedSearch_Find_Contents_SearchDisplay_Find_Contents_Table',
    'entity' => 'SearchDisplay',
    'cleanup' => 'unused',
    'update' => 'unmodified',
    'params' => [
      'version' => 4,
      'values' => [
        'name' => 'Find_Contents_Table',
        'label' => E::ts('Find Contents Table'),
        'saved_search_id.name' => 'Find_Contents',
        'type' => 'table',
        'settings' => [
          'description' => NULL,
          'sort' => [],
          'limit' => 50,
          'pager' => [],
          'placeholder' => 5,
          'actions' => FALSE,
          'classes' => ['table', 'table-striped'],
          'columnMode' => 'custom',
          'button' => NULL,
          'columns' => [
            [
              'type' => 'field',
              'key' => 'id',
              'label' => E::ts('ID'),
              'sortable' => TRUE,
            ],
            [
              'type' => 'field',
              'key' => 'entity_id',
              'label' => E::ts('Entity ID'),
              'sortable' => TRUE,
            ],
            [
              'type' => 'field',
              'key' => 'entity_type',
              'label' => E::ts('Entity type'),
              'sortable' => TRUE,
            ],
            [
              'type' => 'field',
              'key' => 'content',
              'label' => E::ts('Entity content'),
              'sortable' => FALSE,
              'show_linebreaks' => TRUE,
            ],
          ],
        ],
      ],
      'match' => [
        'saved_search_id',
        'name',
      ],
    ],
  ],
];
